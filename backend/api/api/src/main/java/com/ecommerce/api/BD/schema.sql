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
EXECUTE FUNCTION check_stock_before_order();

--- Trigger para modificar el campo last_purchase
/*
CREATE OR REPLACE FUNCTION update_last_Purchase()
        RETURN TRIGGER AS $$
       BEGIN
       IF NEW.status = 'APPROVED' THEN
          UPDATE users
              SET last_purchase = NEW.payment_date
                WHERE id_user = NEW.id_user;
        END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- triger que se ejecutara al cambiar el status de pendiente a aprovado
   CREATE TRIGGER trigger_last_purchase
    AFTER UPDATE payments
    FOR EACH ROW
    EXECUTE FUNCTION update_last_Purchase;




--- vista materializada de "ventas mensuales por categorias de productos"
CREATE MATERIALIZED VIEW  monthly_sales_by_product_category AS
       SELECT DATE_TRUNC('month',p.payment_date) AS month,
       c.id_catergory,
       c.category_name,
       SUM(dp.quantity) AS total_product_sold,
       SUM(dp.subtotal) AS total_sales_amount

       FROM payments p
       JOIN detail_payment dp on dp.id_payment = p.id_payment
        JOIN products pr ON dp.id_category = pr.id_category
        JOIN categories c on pr.id_category = c.id_category

        WHERE p.status = 'APPROVED'

        GROUP BY
            DATE_TRUNC('month', p.payment_date),
            c.id_category,
            c.Caategory_name

        order by month, total_sales_amount DESC;
*/






CREATE OR REPLACE PROCEDURE  checkout_cart(
    p_id_user INT
)LANGUAGE plpgsql
AS $$
DECLARE
    --Variables to usage in procedure
    v_item RECORD;
    v_total DOUBLE PRECISION :=0;
    v_subtotal DOUBLE PRECISION;
    v_id_payment INT;
    v_id_shopping_cart  INT;
BEGIN
    --Select cart of user
    SELECT id_shopping_cart INTO v_id_shopping_cart
    FROM shopping_cart
    WHERE id_user = p_id_user;
    FOR v_item IN
        SELECT cd.id_product, cd.quantity, p.product_price
        FROM cart_detail cd
        JOIN products p ON p.id_product = cd.id_product
        WHERE cd.id_shopping_cart = v_id_shopping_cart
    Loop
        v_subtotal := v_item.quantity * v_item.product_price;
        v_total    := v_total + v_subtotal;
    END LOOP;
    --Insert general information of payment obtained in loop
    INSERT INTO payments (id_user,total,payment_date,status)
    VALUES (p_id_user,v_total, NOW(),'APPROVED')
    --Take the payment
    RETURNING id_payment INTO v_id_payment;
    FOR v_item IN
        SELECT cd.id_product,cd.quantity,p.product_price
        FROM cart_detail cd
        JOIN products p ON p.id_product = cd.id_product
        WHERE cd.id_shopping_cart = v_id_shopping_cart
    LOOP
        v_subtotal := v_item.quantity * v_item.product_price;
        --Insert payment detail before execute update products
        INSERT INTO detail_payment(id_payment, id_product, quantity, unit_price, subtotal)
        VALUES (v_id_payment,v_item.id_product,v_item.quantity,v_item.product_price,v_subtotal);
        --Rest product quantity
        UPDATE products
        SET stock = stock - v_item.quantity
        WHERE id_product = v_item.id_product;
    END LOOP;
    --Delete detail cart user
    DELETE FROM cart_detail
    WHERE id_shopping_cart = v_id_shopping_cart;
    COMMIT;
    EXCEPTION
    WHEN OTHERS THEN
    ROLLBACK;
    RAISE;
END;
$$;




INSERT INTO roles (id_role, name_role) VALUES (1, 'ADMIN')
    ON CONFLICT (id_role) DO NOTHING;

INSERT INTO roles (id_role, name_role) VALUES (2, 'USER')
    ON CONFLICT (id_role) DO NOTHING;

INSERT INTO auth_user(username,password,email,id_role) VALUES ('jean.rojas','$2a$12$sd7EFCu9wX4vdDIgmWD0zeiOOREXg862ycfUvnxRfZTf1W1yzfNNC','jean.rojas@mail.com',1);
INSERT INTO users(name_user,rut,address,phone,id_auth) VALUES ('Jean Rojas','12345678-1','Av.Portugal','23242442',1);