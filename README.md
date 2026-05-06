🛒 Laboratorio-1-TBD

Este repositorio contiene un sistema de e-commerce enfocado en el modelo Business-to-Business (B2B).
Permite realizar transacciones comerciales entre empresas, como la compra, venta y gestión de inventario.

El sistema facilita la comunicación entre empresas, permitiendo:

Comprar y vender productos
Gestionar inventario
Filtrar productos por categorías
Tecnologías utilizadas
***Backend***
- Java 25 
- Spring Boot
- PostgreSQL
- JWT (autenticación)
- Frontend
- React
- Vite
- Axios

Requisitos previos

Tener instalado:

Java 
Maven
PostgreSQL
Node.js y npm
Variables de entorno

Configurar las siguientes variables para la conexión a la base de datos:

- DB_HOST=localhost
- DB_PORT=5432
- DB_NAME=nombre_db
- DB_USER=postgres
- DB_PASSWORD=tu_password

Ejecución del Backend
**1** Clonar el repositorio
**2** Entrar al proyecto:
```bash
bash:

cd tu-repo
cd backend/api/api
```
Ejecutar:
```
mvn spring-boot:run
```
Ejecución del Frontend
Ir al frontend:
```bash
bash:
cd frontend
```
Instalar dependencias: **IMPORTANTE**
```bash
bash:
npm install
```
Ejecutar:
```bash
bash:
npm start
```
ya tienes la aplicacion corriendo.



*** Endpoints ***

//Auth
POST http://localhost:8090/api/auth/register
{
    "username": "jean.rojas",
    "password": "12345678",
    "confirmPassword": "12345678",
    "email": "jean.rojas@mail.com",
    "name_user": "Jean Rojas",
    "rut": "12345678-9",
    "address": "Avenida Siempre Viva 742",
    "phone": "+56912345678"
}
Ruta para registrar a un usuario, siempre registrara a un usuario como user, el administrador viene registrado desde que se levanta la pagina

POST http://localhost:8090/api/auth/login
{
    "identifier": "jean.rojas" o "jean.rojas@mail.com",
    "password": "12345678"
}
Ruta para loguear a un usuario a traves de su username o correo registrado, devuelve el access token que servira para usar las diferentes rutas

//Users
GET http://localhost:8090/api/users/me
Endpoint que funciona con Bearer Token donde se envia el token del usuario para recibir sus datos de perfil
Ruta ADMIN o USER

GET http://localhost:8090/api/users/profiles
Endpoint que funciona con Bearer Token donde se envia el token del usuario para recibir los perfiles de cada usuario
Ruta solo para rol ADMIN

//Products
GET http://localhost:8090/api/products/search?keyword=texto_a_buscar
Endpoint para buscar productos por coincidencias parciales en su nombre o descripción.
Ruta pública/USER

//Cart
GET http://localhost:8090/api/cart/my-cart
Endpoint que funciona con Bearer Token donde se envia el token del usuario para recibir el contenido de su carrito


//Sales
GET http://localhost:8090/api/sales/my-orders
Endpoint que funciona con Bearer Token donde se envia el token del usuario para recibir sus compras
Ruta solo para rol USER

POST http://localhost:8090/api/sales/checkout?paymentMethod={CARD o TRANSFER}
Endpoint que funciona con bearer Token donde se envia el token del usuario y ademas se manda como param el medio de pago que realiza en caso de ser card se guarda como pago aprobado en otro caso pendiente
Ruta solo para rol USER

GET http://localhost:8090/api/sales/pending
Endpoint que funciona con bearer Token donde se envia el token del usuario.
Ruta solo para rol ADMIN

PATCH http://localhost:8090/api/sales/{id_payment}/approve
Endpoint que funciona con bearer Token donde se envia el token del usuario
Ruta solo para rol ADMIN

PATCH http://localhost:8090/api/sales/{id_payment}/cancel
Endpoint que funciona con bearer Token donde se envia el token del usuario, puede un usuario cancelar su propia compra o un administrador cancelar una compra aprobada o pendiente.
Ruta ADMIN o USER

GET http://localhost:8090/api/sales/{id_payment}/purchase
Endpoint que reconstruye el detalle histórico de una factura cruzando la información de pagos, detalles y productos.
Ruta ADMIN o USER

GET http://localhost:8090/api/sales/my-sales
Endpoint que calcula y almacena un reporte mensual de ventas agrupados por categotia de productos, ademas devuelve la cantidad total de articulos vendidos, cuenta solamente los que tenga pagos aparobados

GET http://localhost:8090/api/sales//apply-discount
Edpoint que calcula  almacena un descuento masivo a todos los productos de una categoria por ID.
