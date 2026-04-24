-- 1. Tabla de Roles (necesaria primero para la clave foránea en User)
CREATE TABLE IF NOT EXISTS role (
    id_role SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 2. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id_user VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rut VARCHAR(25) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    id_role INTEGER NOT NULL,
    CONSTRAINT fk_user_role FOREIGN KEY (id_role) REFERENCES role(id_role)
);

-- 3. Tabla de Autenticación (Relación 1:1 con User)
CREATE TABLE IF NOT EXISTS auth_user (
    id_auth SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(10) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    id_user VARCHAR(255) NOT NULL UNIQUE,
    CONSTRAINT fk_auth_user FOREIGN KEY (id_user) REFERENCES "user"(id_user)
);

-- 4. Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
    id_product SERIAL PRIMARY KEY,
    product_name VARCHAR(30) NOT NULL,
    product_description VARCHAR(125) NOT NULL,
    product_price DOUBLE PRECISION NOT NULL,
    stock DOUBLE PRECISION NOT NULL
    );

-- 5. Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
    id_category SERIAL PRIMARY KEY
);

-- 6. Tabla de Carrito de Compras
CREATE TABLE IF NOT EXISTS shooping_cart (
    id_shopping_cart SERIAL PRIMARY KEY
);

-- 7. Tabla de Detalle de Carrito
CREATE TABLE IF NOT EXISTS cart_detail (
    id_detail SERIAL PRIMARY KEY,
    amount_of_product DOUBLE PRECISION
);

-- 8. Tabla de Historial de Stock
CREATE TABLE IF NOT EXISTS historial_stock (
    id_historial SERIAL PRIMARY KEY,
    amount_modificated DOUBLE PRECISION NOT NULL
);