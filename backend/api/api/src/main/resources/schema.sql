DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS auth_user CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
-- 1. Tabla de Roles (necesaria primero para la clave foránea en User)
CREATE TABLE IF NOT EXISTS roles (
    id_role SERIAL PRIMARY KEY,
    name_role VARCHAR(255) NOT NULL UNIQUE
);

-- 2. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id_user SERIAL PRIMARY KEY,
    name_user VARCHAR(255) NOT NULL,
    rut VARCHAR(25) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    id_role INTEGER NOT NULL,
    id_auth INTEGER NOT NULL,
    CONSTRAINT fk_user_role FOREIGN KEY (id_role) REFERENCES roles(id_role),
    CONSTRAINT fk_auth_user FOREIGN KEY (id_user) REFERENCES users(id_user)
);

-- 3. Tabla de Autenticación (Relación 1:1 con User)
CREATE TABLE IF NOT EXISTS auth_user (
    id_auth SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
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
    id_categoty INTEGER NOT NULL,
    SKU_product INTEGER NOT NULL,
    product_name VARCHAR(30) NOT NULL,
    product_description VARCHAR(125) NOT NULL,
    product_price DOUBLE PRECISION NOT NULL,
    stock DOUBLE PRECISION NOT NULL
    FOREIGN KEY (id_category) REFERENCES categories(id_category)
    stock DOUBLE PRECISION NOT NULL,
    id_category INTEGER
    );



-- 6. Tabla de Carrito de Compras
CREATE TABLE IF NOT EXISTS shooping_cart (
    id_shopping_cart SERIAL PRIMARY KEY
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
INSERT INTO roles (id_role, name_role) VALUES (1, 'ADMIN')
    ON CONFLICT (id_role) DO NOTHING;

INSERT INTO roles (id_role, name_role) VALUES (2, 'USER')
    ON CONFLICT (id_role) DO NOTHING;
