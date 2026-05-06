DROP TABLE IF EXISTS historial_stock CASCADE;
DROP TABLE IF EXISTS detail_payment CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS cart_detail CASCADE;
DROP TABLE IF EXISTS shopping_cart CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS auth_user CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
-- 1. Tabla de Roles (necesaria primero para la clave foránea en User)
CREATE TABLE IF NOT EXISTS roles (
                                     id_role SERIAL PRIMARY KEY,
                                     name_role VARCHAR(255) NOT NULL UNIQUE
);

-- 2. Tabla de Autenticación (Relación 1:1 con User)
CREATE TABLE IF NOT EXISTS auth_user (
                                         id_auth SERIAL PRIMARY KEY,
                                         username VARCHAR(30) NOT NULL UNIQUE,
                                         password VARCHAR(255) NOT NULL,
                                         email VARCHAR(100) NOT NULL UNIQUE,
                                         id_role INTEGER NOT NULL,
                                         CONSTRAINT fk_user_role FOREIGN KEY (id_role) REFERENCES roles(id_role)
);
-- 3. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
                                     id_user SERIAL PRIMARY KEY,
                                     name_user VARCHAR(255) NOT NULL,
                                     rut VARCHAR(25) NOT NULL UNIQUE,
                                     address VARCHAR(255) NOT NULL,
                                     phone VARCHAR(255) NOT NULL,
                                     id_auth INTEGER NOT NULL,
                                     last_purchase TIMESTAMP DEFAULT NULL,
                                     CONSTRAINT fk_auth_user FOREIGN KEY (id_auth) REFERENCES auth_user(id_auth)
);
-- 5. Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
                                          id_category SERIAL PRIMARY KEY,
                                          category_name VARCHAR(30) NOT NULL,
                                          category_description VARCHAR(125) NOT NULL
);
-- 4. Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
                                        id_product SERIAL PRIMARY KEY,
                                        id_category INTEGER NOT NULL,
                                        id_user INTEGER NOT NULL,
                                        SKU_product INTEGER NOT NULL,
                                        product_name VARCHAR(30) NOT NULL,
                                        product_description VARCHAR(125) NOT NULL,
                                        product_price DOUBLE PRECISION NOT NULL,
                                        original_price DOUBLE PRECISION DEFAULT NULL,
                                        percent_discount INTEGER DEFAULT 0,
                                        stock DOUBLE PRECISION NOT NULL,
                                        FOREIGN KEY (id_category) REFERENCES categories(id_category),
                                        FOREIGN KEY (id_user) REFERENCES users(id_user)
);

-- 6. Tabla de Carrito de Compras
CREATE TABLE IF NOT EXISTS shopping_cart (
                                             id_shopping_cart SERIAL PRIMARY KEY,
                                             id_user INTEGER NOT NULL,
                                             FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

-- 7. Tabla de Detalle de Carrito
CREATE TABLE IF NOT EXISTS cart_detail (
                                           id_detail SERIAL PRIMARY KEY,
                                           id_shopping_cart INTEGER NOT NULL,
                                           id_product INTEGER NOT NULL,
                                           quantity DOUBLE PRECISION,
                                           FOREIGN KEY (id_shopping_cart) REFERENCES shopping_cart(id_shopping_cart),
                                           FOREIGN KEY (id_product) REFERENCES products(id_product)

);

-- 8. Tabla de Historial de Stock
CREATE TABLE IF NOT EXISTS historial_stock (
                                               id_historial SERIAL PRIMARY KEY,
                                               id_user INTEGER NOT NULL,
                                               id_product INTEGER NOT NULL,
                                               amount_modificated DOUBLE PRECISION NOT NULL,
                                               FOREIGN KEY (id_product) REFERENCES products(id_product),
                                               FOREIGN KEY (id_user) REFERENCES users(id_user)

);
-- STATUS = 'PENDING' | 'APPROVED' | 'CANCELLED'
CREATE TABLE IF NOT EXISTS payments (
                                        id_payment SERIAL PRIMARY KEY,
                                        id_user INTEGER NOT NULL,
                                        total DOUBLE PRECISION NOT NULL,
                                        payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
                                        status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                                        payment_method  VARCHAR(20) NOT NULL DEFAULT 'CARD',
                                        FOREIGN KEY (id_user) REFERENCES users(id_user)
);

CREATE TABLE IF NOT EXISTS detail_payment (
                                              id_detail_payment SERIAL PRIMARY KEY,
                                              id_payment INTEGER NOT NULL,
                                              id_product INTEGER NOT NULL,
                                              quantity DOUBLE PRECISION NOT NULL,
                                              unit_price DOUBLE PRECISION NOT NULL,
                                              subtotal DOUBLE PRECISION NOT NULL,
                                              FOREIGN KEY (id_payment) REFERENCES payments(id_payment),
                                              FOREIGN KEY (id_product) REFERENCES products(id_product)
);

---Función con la lógica matematica para determinar si se compra más del stock disponible

CREATE OR REPLACE FUNCTION check_stock_before_order()
    RETURNS TRIGGER AS $$
DECLARE
    actualStock NUMERIC;
BEGIN
    SELECT stock INTO actualStock
    FROM products
    WHERE id_product = NEW.id_product;

    IF NEW.quantity > actualStock THEN
        RAISE EXCEPTION 'EL PRODUCTO TIENE STOCK INSUFICIENTE DEL PRODUCTO %, TIENE DISPONIBLE: %, Y SE SOLICITA: %', NEW.id_product, actualStock, NEW.quantity;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

----Trigger que evita el registro de productos que pidan mas que el stock disponible
CREATE TRIGGER trigger_stock
    BEFORE INSERT ON detail_payment
    FOR EACH ROW
EXECUTE FUNCTION check_stock_before_order();

--- Trigger para modificar el campo last_purchase

CREATE OR REPLACE FUNCTION update_last_Purchase()
    RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'APPROVED' THEN
        UPDATE users
        SET last_purchase = NEW.payment_date
        WHERE id_user = NEW.id_user;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


SELECT name_user, last_purchase FROM users WHERE id_user = 2;
-- triger que se ejecutara al cambiar el status de pendiente a aprobado
CREATE TRIGGER trigger_last_purchase
    AFTER INSERT OR UPDATE ON payments
    FOR EACH ROW
EXECUTE FUNCTION update_last_Purchase();

--- vista materializada de "ventas mensuales por categorias de productos"
CREATE MATERIALIZED VIEW  monthly_sales_by_product_category AS
SELECT DATE_TRUNC('month',p.payment_date) AS month,
       c.id_category,
       c.category_name,
       SUM(dp.quantity) AS total_product_sold,
       SUM(dp.subtotal) AS total_sales_amount

FROM payments p
         JOIN detail_payment dp on dp.id_payment = p.id_payment
         JOIN products pr ON dp.id_product = pr.id_product
         JOIN categories c on pr.id_category = c.id_category

WHERE p.status = 'APPROVED'

GROUP BY
    DATE_TRUNC('month', p.payment_date),
    c.id_category,
    c.Category_name

order by month, total_sales_amount DESC;
-- Index
CREATE INDEX index_products_sku ON products(SKU_product);
CREATE INDEX index_payments_user ON payments(id_user);
CREATE INDEX index_products_name ON  products(product_name);
CREATE INDEX index_products_description ON products(product_description);
-- Procedure
CREATE OR REPLACE PROCEDURE checkout_cart(
    p_id_user        INT,
    p_payment_method VARCHAR
) LANGUAGE plpgsql
AS $$
DECLARE
    v_item             RECORD;
    v_total            DOUBLE PRECISION := 0;
    v_subtotal         DOUBLE PRECISION;
    v_id_payment       INT;
    v_id_shopping_cart INT;
    v_status           VARCHAR;
BEGIN
    -- 1. Validar estado (ignorando mayúsculas)
    IF UPPER(p_payment_method) = 'CARD' OR UPPER(p_payment_method) = 'EFECTIVO' THEN
        v_status := 'APPROVED';
    ELSE
        v_status := 'PENDING';
    END IF;

    -- 2. Obtener el carrito
    SELECT id_shopping_cart INTO v_id_shopping_cart
    FROM shopping_cart 
    WHERE id_user = p_id_user;

    -- 3. Calcular el total usando COALESCE para evitar el error de NULL
    SELECT COALESCE(SUM(cd.quantity * p.product_price), 0) INTO v_total
    FROM cart_detail cd
    JOIN products p ON p.id_product = cd.id_product
    WHERE cd.id_shopping_cart = v_id_shopping_cart;

    -- SEGURIDAD: Si el total sigue siendo 0 o NULL, no procesar nada
    IF v_total IS NULL OR v_total = 0 THEN
        RAISE EXCEPTION 'El carrito está vacío o los productos no tienen precio.';
    END IF;

    -- 4. Insertar en PAYMENTS
    INSERT INTO payments (id_user, total, payment_date, status, payment_method)
    VALUES (p_id_user, v_total, NOW(), v_status, p_payment_method)
    RETURNING id_payment INTO v_id_payment;

    -- 5. Insertar detalles y bajar stock
    FOR v_item IN
        SELECT cd.id_product, cd.quantity, p.product_price
        FROM cart_detail cd
        JOIN products p ON p.id_product = cd.id_product
        WHERE cd.id_shopping_cart = v_id_shopping_cart
    LOOP
        v_subtotal := v_item.quantity * v_item.product_price;

        INSERT INTO detail_payment (id_payment, id_product, quantity, unit_price, subtotal)
        VALUES (v_id_payment, v_item.id_product, v_item.quantity, v_item.product_price, v_subtotal);

        -- DESCUENTO DE STOCK
        IF v_status = 'APPROVED' THEN
            UPDATE products
            SET stock = stock - v_item.quantity
            WHERE id_product = v_item.id_product;
        END IF;
    END LOOP;

    -- 6. Limpiar carrito
    DELETE FROM cart_detail WHERE id_shopping_cart = v_id_shopping_cart;

END;
$$;

CREATE OR REPLACE PROCEDURE  apply_discount(
    p_id_category INT,
    p_percent_discount NUMERIC
)LANGUAGE plpgsql
AS $$
DECLARE
BEGIN
    UPDATE products
    SET original_price = product_price,
        product_price = product_price * (1 - p_percent_discount / 100.0),
        percent_discount = p_percent_discount
    WHERE id_category = p_id_category AND percent_discount = 0;
END;
$$;

-- 1. ROLES (Base para Auth)
INSERT INTO roles (id_role, name_role) VALUES 
(1, 'ADMIN'), 
(2, 'USER') 
ON CONFLICT (id_role) DO NOTHING;

-- 2. AUTH USERS (Base para Users)
-- Todos tienen password '12345678'
INSERT INTO auth_user (id_auth, username, password, email, id_role) VALUES
(1,'manuel.Vasquez','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','manuel.Vasquez@mail.com',1),
(2,'admin.sodimac','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','compras@sodimac.cl',1),
(3,'admin.lider','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','compras@lider.cl',2),
(4,'admin.toyota','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','ventas@toyota.cl',2),
(5,'admin.bosch','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','ventas@bosch.cl',2),
(6,'admin.bridgestone','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','ventas@bridgestone.cl',2),
(7,'admin.easy','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','compras@easy.cl',2),
(8,'admin.homecenter','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','compras@homecenter.cl',2),
(9,'admin.3m','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','ventas@3m.cl',2),
(10,'admin.masisa','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','ventas@masisa.cl',2),
(11,'admin.codelco','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','compras@codelco.cl',2)
ON CONFLICT (id_auth) DO NOTHING;

-- 3. USERS (Relacionados con Auth)
INSERT INTO users (id_user, name_user, rut, address, phone, id_auth) VALUES
(1,'Manuel Vasquez','98765432-2','Av. Libertad 456','99887766',1),
(2,'Sodimac Chile S.A.','81123400-1','Av. Vicuña Mackenna 1270','226770000',2),
(3,'Lider Walmart Chile','96656960-2','Av. P. Eduardo Frei 7901','226340000',3),
(4,'Toyota Chile S.A.','79988750-3','Av. A. Vespucio 501','227410000',4),
(5,'Bosch Chile S.A.','84322400-4','Av. El Golf 40','223240000',5),
(6,'Bridgestone Chile','78921300-5','Ruta 68 Km 32','227190000',6),
(7,'Easy S.A.','96928530-6','Av. Kennedy 9001','226610000',7),
(8,'Homecenter Ltda.','77321450-7','Panamericana Norte 9501','228830000',8),
(9,'3M Chile S.A.','82340100-8','Av. Apoquindo 3600','223652000',9),
(10,'Masisa S.A.','91122330-9','Av. P. Riesco 5561','226300000',10),
(11,'Codelco Chile','61704000-K','Huérfanos 1270','226903000',11)
ON CONFLICT (id_user) DO NOTHING;

-- 4. CATEGORIES
INSERT INTO categories (id_category, category_name, category_description) VALUES
(1,'Neumáticos','Vehículos livianos e industriales'),
(2,'Repuestos Auto','Filtros, frenos, baterías'),
(3,'Maderas','Tableros y vigas industriales'),
(4,'Seguridad Ind.','EPP y equipos de protección'),
(5,'Electricidad','Cables y tableros eléctricos'),
(6,'Pinturas','Pinturas industriales'),
(7,'Herram. Elect.','Herramientas profesionales'),
(8,'Plomería','Tuberías y válvulas'),
(9,'Adhesivos','Cintas industriales'),
(10,'Minería','Equipos mineros')
ON CONFLICT (id_category) DO NOTHING;

-- 5. PRODUCTS
INSERT INTO products (id_product, id_category, id_user, SKU_product, product_name, product_description, product_price, stock) VALUES
(1,1,4,4001,'Llanta 195/65R15','Llanta Toyota original Corolla',89990,120),
(2,2,4,4002,'Filtro Aceite','Filtro original Toyota Hilux 2.8',12990,300),
(3,2,5,5001,'Batería 60Ah','Batería Bosch S4 libre mant.',79990,80),
(4,7,5,5002,'Taladro Percutor','Bosch GSB 21-2 RCT 1100W',189990,45),
(5,1,6,6001,'Neumático 265/65','Bridgestone Dueler 265/65R17',129990,90),
(6,9,9,7001,'Cinta Doble Faz','Cinta 3M industrial 50mm x 50m',8990,400),
(7,4,9,7002,'Mascarilla N95','3M N95 caja x 20 unidades',34990,250),
(8,3,10,8001,'Tablero MDF 15mm','Masisa 15mm 1.83x2.60m',32990,60)
ON CONFLICT (id_product) DO NOTHING;

-- 6. SINCRONIZAR SECUENCIAS 
SELECT setval('roles_id_role_seq', (SELECT MAX(id_role) FROM roles));
SELECT setval('auth_user_id_auth_seq', (SELECT MAX(id_auth) FROM auth_user));
SELECT setval('users_id_user_seq', (SELECT MAX(id_user) FROM users));
SELECT setval('categories_id_category_seq', (SELECT MAX(id_category) FROM categories));
SELECT setval('products_id_product_seq', (SELECT MAX(id_product) FROM products));
