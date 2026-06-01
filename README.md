# Backend Concesionario: NestJS + MongoDB + JWT + Swagger

API REST para una practica de Angular: gestion de concesionario con autenticacion, roles, catalogo de vehiculos, subida de imagenes a bucket S3-compatible y checkout de carrito.

## Arquitectura Railway

```txt
Railway Project
├── backend-nestjs
├── mongodb
└── bucket
```

MongoDB guarda usuarios, vehiculos y ventas. El bucket guarda las imagenes reales; MongoDB solo guarda las keys de esas imagenes.

## Roles

- `ADMINISTRADOR`: gestiona inventario, sube imagenes y consulta ventas.
- `CLIENTE`: consulta catalogo y procesa compras.

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

Backend:

```env
PORT=3000
MONGO_URI=${{Mongo.MONGO_URL}}
JWT_SECRET=<valor-seguro>
JWT_EXPIRES_IN=1d
FRONTEND_URL=<url-del-frontend>
```

Bucket S3-compatible:

```env
S3_ENDPOINT=<endpoint-del-bucket>
S3_BUCKET=<nombre-del-bucket>
S3_ACCESS_KEY_ID=<access-key>
S3_SECRET_ACCESS_KEY=<secret-key>
S3_REGION=auto
S3_FORCE_PATH_STYLE=true
```

Opcionalmente, si el bucket expone URLs publicas directas:

```env
S3_PUBLIC_URL=<url-publica-del-bucket>
```

Si no defines `S3_PUBLIC_URL`, el backend devuelve URLs firmadas temporales para que Angular pueda mostrar las imagenes.

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
- `POST /vehicles/:id/images`: solo `ADMINISTRADOR`, multipart/form-data con campo `images`
- `DELETE /vehicles/:id`: solo `ADMINISTRADOR`

Crear vehiculo:

```json
{
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2022,
  "price": 18990,
  "stock": 4,
  "description": "Compacto hibrido con garantia oficial."
}
```

Subir una o varias imagenes:

```txt
POST /vehicles/<id>/images
Content-Type: multipart/form-data
Field: images
```

Respuesta de catalogo:

```json
{
  "_id": "665f1f77c7f0b2b4b6741b91",
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2022,
  "price": 18990,
  "stock": 4,
  "images": [
    "https://signed-or-public-url/image-1.jpg"
  ],
  "imageKeys": [
    "vehicles/uuid.jpg"
  ]
}
```

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

## Deploy Railway

1. Deploy del backend desde GitHub.
2. Crear servicio MongoDB.
3. Crear servicio Bucket.
4. En el backend, referenciar las variables de Mongo y Bucket.
5. Redeploy del backend.

`docker-compose.yml` queda solo para desarrollo local.
