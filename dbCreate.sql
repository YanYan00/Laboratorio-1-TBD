drop table if EXISTS order_details;
drop table if EXISTS purchase_orders;
drop table if EXISTS cart_details;
DROP TABLE IF EXISTS stock_history;
DROP TABLE IF EXISTS product;

DROP TABLE IF EXISTS shopping_cart;
DROP table IF EXISTS administrator;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS client;




CREATE TABLE administrator(
id_administrator  SERIAL PRIMARY KEY,
rut_administrator VARCHAR(11), -- this its with "_", but without dots
firstname_administrator VARCHAR(30),
lastname_administrator VARCHAR(30)
);

CREATE TABLE category(
id_category SERIAL PRIMARY KEY,
name_category VARCHAR(30),
description_category VARCHAR(100)
);

CREATE TABLE product(
sku_product SERIAL PRIMARY KEY,
name_product VARCHAR(50),
descripction_product VARCHAR(200),
price_product INTEGER,
stock_Product INTEGER,
id_category INTEGER NOT NULL,
id_administrator INTEGER NOT NULL,
FOREIGN KEY (id_category) REFERENCES category(id_category),
FOREIGN KEY (id_administrator) REFERENCES administrator(id_administrator)
);

CREATE TABLE client(
id_business SERIAL PRIMARY KEY,
rut_business varchar(11),
number_buy_business INTEGER  -- W  a trigger i add one each buy
-- last_buy_business esto debe actualizarse cada vez que se compre, un trigger debe hacer eso

);

CREATE TABLE stock_history(
id_history SERIAL PRIMARY key,
sku_product INTEGER,
id_administrator INTEGER,
modified_amount INTEGER,
FOREIGN KEY (sku_product) REFERENCES product(sku_product),
FOREIGN KEY (id_administrator) REFERENCES administrator(id_administrator)

);

Create TABLE shopping_cart(
id_shopping_cart SERIAL PRIMARY KEY,
id_client INTEGER,
FOREIGN KEY(id_client) REFERENCES client(id_business)
);

CREATE TABLE cart_details(
id_cart_details SERIAL primary key,
id_shopping_cart integer,
id_product integer,
quantity integer,
foreign key (id_shopping_cart) references shopping_cart(id_shopping_cart),
foreign key (id_product) references product(sku_product)
);

CREATE TABLE purchase_orders(
id_order serial primary key,
id_business integer,
id_administrator integer,
state_order VARCHAR(20),
payments_status varchar(20),
total integer,
payments_date DATE DEFAULT CURRENT_DATE,

FOREIGN KEY (id_business) references client(id_business),
FOREIGN KEY (id_administrator) references administrator(id_administrator)



);

CREATE TABLE order_details(
id_detail_order SERIAL PRIMARY KEY,
id_purchase_orders integer,
sku_product integer,
quantity integer,
unit_price integer,
discount decimal(10,2),
sub_total integer,
foreign key (id_purchase_orders) references purchase_orders(id_order),
foreign key (sku_product) references product(sku_product)

);




