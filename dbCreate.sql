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
-- 1. Tabla de Roles (necesaria primero para la clave for�nea en User)
CREATE TABLE IF NOT EXISTS roles (
                                     id_role SERIAL PRIMARY KEY,
                                     name_role VARCHAR(255) NOT NULL UNIQUE
    );

-- 2. Tabla de Autenticaci�n (Relaci�n 1:1 con User)
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
-- 5. Tabla de Categor�as
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

---Funci�n con la l�gica matematica para determinar si se compra m�s del stock disponible

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
    v_status           VARCHAR := 'PENDING';
BEGIN
    IF p_payment_method = 'CARD' THEN
        v_status := 'APPROVED';
END IF;

SELECT id_shopping_cart INTO v_id_shopping_cart
FROM shopping_cart
WHERE id_user = p_id_user;

FOR v_item IN
SELECT cd.id_product, cd.quantity, p.product_price
FROM cart_detail cd
         JOIN products p ON p.id_product = cd.id_product
WHERE cd.id_shopping_cart = v_id_shopping_cart
    LOOP
            v_subtotal := v_item.quantity * v_item.product_price;
v_total    := v_total + v_subtotal;
END LOOP;

INSERT INTO payments (id_user, total, payment_date, status, payment_method)
VALUES (p_id_user, v_total, NOW(), v_status, p_payment_method)
    RETURNING id_payment INTO v_id_payment;

FOR v_item IN
SELECT cd.id_product, cd.quantity, p.product_price
FROM cart_detail cd
         JOIN products p ON p.id_product = cd.id_product
WHERE cd.id_shopping_cart = v_id_shopping_cart
    LOOP
            v_subtotal := v_item.quantity * v_item.product_price;

INSERT INTO detail_payment (id_payment, id_product, quantity, unit_price, subtotal)
VALUES (v_id_payment, v_item.id_product, v_item.quantity, v_item.product_price, v_subtotal);

IF v_status = 'APPROVED' THEN
UPDATE products
SET stock = stock - v_item.quantity
WHERE id_product = v_item.id_product;
END IF;
END LOOP;

DELETE FROM cart_detail
WHERE id_shopping_cart = v_id_shopping_cart;
END;
$$;

CREATE OR REPLACE PROCEDURE restore_stock_on_cancel(p_id_payment INT)
    LANGUAGE plpgsql AS $$
BEGIN
UPDATE products p
SET stock = stock + dp.quantity
    FROM detail_payment dp
WHERE dp.id_payment = p_id_payment
  AND dp.id_product = p.id_product;
END;
$$;

CREATE OR REPLACE PROCEDURE  apply_discount(
    p_id_category INT,
    p_percent_discount INT
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

-- =====================
-- ROLES
-- =====================
INSERT INTO roles (id_role, name_role) VALUES (1, 'ADMIN') ON CONFLICT (id_role) DO NOTHING;
INSERT INTO roles (id_role, name_role) VALUES (2, 'USER')  ON CONFLICT (id_role) DO NOTHING;
-- =====================
-- AUTH USERS
-- =====================
-- password = 12345678

INSERT INTO auth_user (id_auth, username, password, email, id_role) VALUES
(1,'manuel.Vasquez','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','manuel.Vasquez@mail.com',1),
(4,'admin.sodimac','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','compras@sodimac.cl',1),
(5,'admin.lider','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','compras@lider.cl',2),
(6,'admin.toyota','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','ventas@toyota.cl',2),
(7,'admin.bosch','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','ventas@bosch.cl',2),
(8,'admin.bridgestone','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','ventas@bridgestone.cl',2),
(9,'admin.easy','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','compras@easy.cl',2),
(10,'admin.homecenter','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','compras@homecenter.cl',2),
(11,'admin.3m','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','ventas@3m.cl',2),
(12,'admin.masisa','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','ventas@masisa.cl',2),
(13,'admin.codelco','$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO','compras@codelco.cl',2);

-- =====================
-- USERS
-- =====================
INSERT INTO users (id_user, name_user, rut, address, phone, id_auth) VALUES
(1,'Manuel Vasquez','98765432-2','Av. Libertad 456','99887766',1),
(4,'Sodimac Chile S.A.','81123400-1','Av. Vicuña Mackenna 1270, Santiago','226770000',4),
(5,'Lider Walmart Chile','96656960-2','Av. Presidente Eduardo Frei 7901','226340000',5),
(6,'Toyota Chile S.A.','79988750-3','Av. Américo Vespucio 501, Quilicura','227410000',6),
(7,'Bosch Chile S.A.','84322400-4','Av. El Golf 40, Las Condes','223240000',7),
(8,'Bridgestone Chile','78921300-5','Ruta 68 Km 32, Pudahuel','227190000',8),
(9,'Easy S.A.','96928530-6','Av. Kennedy 9001, Las Condes','226610000',9),
(10,'Homecenter Ltda.','77321450-7','Panamericana Norte 9501, Quilicura','228830000',10),
(11,'3M Chile S.A.','82340100-8','Av. Apoquindo 3600, Las Condes','223652000',11),
(12,'Masisa S.A.','91122330-9','Av. Presidente Riesco 5561, Vitacura','226300000',12),
(13,'Codelco Chile','61704000-K','Huérfanos 1270, Santiago Centro','226903000',13);

-- =====================
-- CATEGORIES
-- =====================
INSERT INTO categories (id_category, category_name, category_description) VALUES
(4,'Neumáticos','Neumáticos y llantas para vehículos livianos e industriales'),
(5,'Repuestos Auto','Filtros, frenos, baterías y repuestos automotrices'),
(6,'Maderas','Tableros, vigas y productos de madera industrial'),
(7,'Seguridad Ind.','EPP y equipos de protección industrial'),
(8,'Electricidad','Cables, tableros y materiales eléctricos'),
(9,'Pinturas','Pinturas industriales y de uso comercial'),
(10,'Herram. Elect.','Herramientas eléctricas profesionales'),
(11,'Plomería','Tuberías, válvulas y accesorios sanitarios'),
(12,'Adhesivos','Adhesivos, sellantes y cintas industriales'),
(13,'Minería','Equipos y materiales para uso minero');

-- =====================
-- PRODUCTS
-- =====================
INSERT INTO products (id_product, id_category, id_user, SKU_product, product_name, product_description, product_price, stock) VALUES
(7,4,6,4001,'Llanta 195/65R15','Llanta Toyota original 195/65R15 Corolla',89990,120),
(8,5,6,4002,'Filtro Aceite','Filtro de aceite original Toyota Hilux 2.8',12990,300),
(9,5,7,5001,'Batería 60Ah','Batería Bosch S4 60Ah libre mantenimiento',79990,80),
(10,10,7,5002,'Taladro Percutor','Taladro percutor Bosch GSB 21-2 RCT 1100W',189990,45),
(11,4,8,6001,'Neumático 265/65','Neumático Bridgestone Dueler 265/65R17',129990,90),
(12,4,8,6002,'Neumático 205/55','Neumático Bridgestone Turanza 205/55R16',99990,150),
(13,12,11,7001,'Cinta Doble Faz','Cinta doble faz 3M industrial 50mm x 50m',8990,400),
(14,7,11,7002,'Mascarilla N95','Mascarilla 3M N95 8210 caja x 20 unidades',34990,250),
(15,6,12,8001,'Tablero MDF 15mm','Tablero MDF Masisa 15mm 1.83x2.60m',32990,60),
(16,6,12,8002,'Tablero OSB 18mm','Tablero OSB Masisa 18mm 1.22x2.44m',27990,75);

-- =====================
-- SHOPPING CART
-- =====================
INSERT INTO shopping_cart (id_shopping_cart, id_user) VALUES
(3,4),
(4,5),
(5,9),
(6,10),
(7,13);

-- =====================
-- CART DETAIL
-- =====================
INSERT INTO cart_detail (id_shopping_cart, id_product, quantity) VALUES
(3,11,20),
(3,15,10),
(4,13,50),
(4,14,30),
(5,16,15),
(5,8,40),
(6,10,10),
(6,9,25),
(7,11,50),
(7,14,100);