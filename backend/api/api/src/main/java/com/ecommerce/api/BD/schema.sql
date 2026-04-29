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
    purchase_date DATE,
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

CREATE TABLE IF NOT EXISTS payments (
    id_payment SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL,
    total DOUBLE PRECISION NOT NULL,
    payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    -- 'PENDING' | 'APPROVED' | 'CANCELLED'
    FOREIGN KEY (id_user) REFERENCES users(id_user)
);

CREATE TABLE IF NOT EXISTS detail_payment (
    id_detail_payment SERIAL PRIMARY KEY,
    id_payment INTEGER NOT NULL,
    id_product INTEGER NOT NULL,
    quantity DOUBLE PRECISION NOT NULL,
    unit_price DOUBLE PRECISION NOT NULL,   -- snapshot del precio al momento de compra
    subtotal DOUBLE PRECISION NOT NULL,   -- quantity * unit_price (desnormalizado intencionalmente)
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
EXECUTE FUNCTION check_stock_before_order;


'''
CREATE OR REPLACE PROCEDURE  checkout_cart(
    p_id_user INT
)LANGUAGE plpgpsl
DECLARE
    v_id_shopping_cart INT
BEGIN
    v_id_shopping_cart = SELECT id_shopping_cart FROM shopping_cart s WHERE p_id_user = s.id_user;
DECLARE
    v_item RECORD;
    v_total DOUBLE PRECISION:=0;
FOR v_item IN
    SELECT cd.id_product, cd_cuantity, p.product_price
    FROM cart_detail cd
    JOIN products p ON p.id_product = cd.id_product
    WHERE cd.id_shopping_cart = v_id_shopping_cart
LOOP
    v_subtotal := v_item.quantity * v_item.product_price;
    v_total := v_total + v_subtotal
    INSERT INTO detail_payments (id_payment,id_product,quantity,unit_price,subtotal) VALUES (,cd.id_product,cd_cuantity,p.product_price,v_subtotal);
END LOOP
'''



INSERT INTO roles (id_role, name_role) VALUES (1, 'ADMIN')
    ON CONFLICT (id_role) DO NOTHING;

INSERT INTO roles (id_role, name_role) VALUES (2, 'USER')
    ON CONFLICT (id_role) DO NOTHING;

INSERT INTO auth_user(username,password,email,id_role) VALUES ('jean.rojas','$2a$12$sd7EFCu9wX4vdDIgmWD0zeiOOREXg862ycfUvnxRfZTf1W1yzfNNC','jean.rojas@mail.com',1);
INSERT INTO users(name_user,rut,address,phone,id_auth) VALUES ('Jean Rojas','12345678-1','Av.Portugal','23242442',1);