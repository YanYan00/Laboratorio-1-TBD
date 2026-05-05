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
npm run dev
```
ya tienes la aplicacion corriendo.
