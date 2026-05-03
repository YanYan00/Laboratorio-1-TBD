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


-- triger que se ejecutara al cambiar el status de pendiente a aprobado
CREATE TRIGGER trigger_last_purchase
    AFTER UPDATE ON payments
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
-- Admin: password = Admin1234
INSERT INTO auth_user (username, password, email, id_role)
VALUES ('jean.rojas', '$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO', 'jean.rojas@mail.com', 1);

-- User 1: password = User1234
INSERT INTO auth_user (username, password, email, id_role)
VALUES ('manuel.orellana', '$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO', 'manuel.orellana@mail.com', 2);

-- User 2: password = User1234
INSERT INTO auth_user (username, password, email, id_role)
VALUES ('luciano.carril', '$2a$12$t9i6h/nyBBuqEYLGyVbf2en17FPrnpDtYT5MChGXie0ct85s9BcrO', 'luciano.carril@mail.com', 2);

-- =====================
-- USERS
-- =====================
INSERT INTO users (name_user, rut, address, phone, id_auth)
VALUES ('Jean Rojas',    '12345678-1', 'Av. Portugal 123',  '23242442', 1);

INSERT INTO users (name_user, rut, address, phone, id_auth)
VALUES ('Manuel Orellana', '98765432-2', 'Av. Libertad 456',  '99887766', 2);

INSERT INTO users (name_user, rut, address, phone, id_auth)
VALUES ('Luciano Carril',     '11223344-3', 'Calle Nueva 789',   '88776655', 3);

-- =====================
-- CATEGORY
-- =====================
INSERT INTO categories (category_name, category_description)
VALUES ('Herramientas', 'Herramientas manuales y eléctricas');

INSERT INTO categories (category_name, category_description)
VALUES ('Escaleras', 'Escaleras de aluminio y fibra');

INSERT INTO categories (category_name, category_description)
VALUES ('Repuestos', 'Ruedas, tornillos y accesorios');

-- =====================
-- PRODUCTOS
-- Manuel (id_user=2) vende herramientas
-- =====================
INSERT INTO products (id_category, id_user, SKU_product, product_name, product_description, product_price, stock)
VALUES (1, 2, 1001, 'Martillo',        'Martillo de acero 500g',         8990,  50);

INSERT INTO products (id_category, id_user, SKU_product, product_name, product_description, product_price, stock)
VALUES (1, 2, 1002, 'Destornillador',  'Destornillador Phillips #2',     4990,  80);

INSERT INTO products (id_category, id_user, SKU_product, product_name, product_description, product_price, stock)
VALUES (2, 2, 2001, 'Escalera 3m',     'Escalera aluminio 3 metros',    29990,  20);

-- Luciano (id_user=3) vende repuestos y escaleras
INSERT INTO products (id_category, id_user, SKU_product, product_name, product_description, product_price, stock)
VALUES (2, 3, 2002, 'Escalera 5m',     'Escalera aluminio 5 metros',    49990,  15);

INSERT INTO products (id_category, id_user, SKU_product, product_name, product_description, product_price, stock)
VALUES (3, 3, 3001, 'Rueda Industrial','Rueda goma 10cm diámetro',       3990, 100);

INSERT INTO products (id_category, id_user, SKU_product, product_name, product_description, product_price, stock)
VALUES (3, 3, 3002, 'Tornillo 1/2',    'Tornillo hexagonal 1/2 pulgada',  190, 500);

-- =====================
-- CARTS
-- =====================
INSERT INTO shopping_cart (id_user) VALUES (2); -- cart Manuel
INSERT INTO shopping_cart (id_user) VALUES (3); -- cart Luciano

-- Manuel compra productos de Luciano
INSERT INTO cart_detail (id_shopping_cart, id_product, quantity) VALUES (1, 4, 2);
INSERT INTO cart_detail (id_shopping_cart, id_product, quantity) VALUES (1, 5, 3);

-- Luciano compra productos de Manuel
INSERT INTO cart_detail (id_shopping_cart, id_product, quantity) VALUES (2, 1, 1);
INSERT INTO cart_detail (id_shopping_cart, id_product, quantity) VALUES (2, 3, 2);

SELECT * FROM auth_user;