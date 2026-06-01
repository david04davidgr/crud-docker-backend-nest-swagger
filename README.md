# Backend Concesionario: NestJS + MongoDB + JWT + Swagger

API REST preparada para una practica de Angular: sistema de gestion de concesionario con autenticacion, roles, catalogo de vehiculos y checkout de carrito.

## Roles

- `ADMINISTRADOR`: gestiona inventario y consulta historial de ventas.
- `CLIENTE`: consulta catalogo y procesa compras desde el carrito.

Al registrar usuario puedes indicar el rol:

```json
{
  "email": "admin@example.com",
  "password": "123456",
  "name": "Admin",
  "role": "ADMINISTRADOR"
}
```

Si no se envia `role`, se crea como `CLIENTE`.

## Variables de entorno

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/concesionario
JWT_SECRET=change-me
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:4200
```

En Railway usa el MongoDB service del mismo proyecto:

```env
MONGO_URI=${{Mongo.MONGO_URL}}
JWT_SECRET=<valor-seguro>
JWT_EXPIRES_IN=1d
FRONTEND_URL=<url-del-frontend>
```

## Ejecutar en local

```bash
npm install
npm run start:dev
```

Swagger:

```txt
http://localhost:3000/api
```

Healthcheck:

```txt
http://localhost:3000/health
```

## Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`

El login devuelve `access_token` y los datos del usuario, incluido `role`.

### Vehiculos

Requieren Bearer Token.

- `GET /vehicles`: `ADMINISTRADOR` y `CLIENTE`
- `GET /vehicles/:id`: `ADMINISTRADOR` y `CLIENTE`
- `POST /vehicles`: solo `ADMINISTRADOR`
- `PATCH /vehicles/:id`: solo `ADMINISTRADOR`
- `POST /vehicles/:id/image`: solo `ADMINISTRADOR`, multipart/form-data con campo `image`
- `DELETE /vehicles/:id`: solo `ADMINISTRADOR`

Modelo principal:

```json
{
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2022,
  "price": 18990,
  "stock": 4,
  "description": "Compacto hibrido con garantia oficial.",
  "imageUrl": "https://example.com/corolla.jpg"
}
```

Para subir imagenes al bucket, configura estas variables opcionales:

```env
MINIO_BUCKET=vehicles-images
MINIO_PUBLIC_URL=https://url-publica-del-bucket
MINIO_INTERNAL_URL=https://url-interna-o-publica-del-bucket
```

Si no estan configuradas, la API arranca igualmente y solo fallara el endpoint `POST /vehicles/:id/image`.

### Carrito y ventas

- `POST /checkout`: solo `CLIENTE`
- `GET /sales`: solo `ADMINISTRADOR`

Ejemplo de checkout:

```json
{
  "items": [
    {
      "vehicleId": "665f1f77c7f0b2b4b6741b91",
      "quantity": 1
    }
  ]
}
```

El backend valida stock, descuenta unidades y crea una venta con total y desglose.

## Railway

El proyecto esta preparado para desplegarse sin `docker-compose` en produccion:

```txt
Railway Project
├── backend-nestjs
└── mongodb
```

`docker-compose.yml` queda solo para desarrollo local. En Railway solo necesitas el backend desplegado desde GitHub y un servicio MongoDB con `MONGO_URI` configurada.
