# Backend NestJS: CRUD Productos + JWT + MongoDB + Swagger

API NestJS con autenticacion JWT, usuarios, CRUD de productos, healthcheck y documentacion Swagger. El proyecto esta preparado para desplegarse en Railway con el backend separado de la base de datos MongoDB.

## Arquitectura Railway

```txt
Railway Project
├── backend-nestjs
└── mongodb (Railway database service)
```

MongoDB no se ejecuta dentro del contenedor del backend en produccion. Railway debe proveer la conexion mediante variables de entorno.

## Variables de entorno

Copia `.env.example` a `.env` para desarrollo local y configura:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/products_exam
JWT_SECRET=change-me
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
```

En Railway configura:

```env
MONGO_URI=${{Mongo.MONGO_URL}}
JWT_SECRET=<valor-seguro>
JWT_EXPIRES_IN=1d
FRONTEND_URL=<url-del-frontend>
```

## Desarrollo local

Con Node.js:

```bash
npm install
npm run start:dev
```

Con Docker Compose, solo para servicios locales de desarrollo:

```bash
docker compose up --build
```

API: `http://localhost:3000`

Swagger: `http://localhost:3000/api`

Healthcheck: `http://localhost:3000/health`

## Deploy en Railway

1. Crea un proyecto en Railway con `Deploy from GitHub`.
2. Anade un servicio MongoDB desde Railway.
3. En el servicio del backend configura `MONGO_URI=${{Mongo.MONGO_URL}}`.
4. Configura `JWT_SECRET` con un valor seguro.
5. Railway construira el backend con el `Dockerfile` multi-stage y ejecutara `node dist/main`.

El archivo `railway.json` fuerza el builder Dockerfile y define reinicios en caso de fallo.

## Endpoints principales

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Products

Requieren Bearer Token:

- `POST /products`
- `GET /products`
- `GET /products/:id`
- `PATCH /products/:id`
- `POST /products/:id/images`
- `DELETE /products/:id`

La subida de imagenes requiere configurar las variables opcionales `MINIO_BUCKET`, `MINIO_PUBLIC_URL` y `MINIO_INTERNAL_URL`. Si no estan configuradas, el backend sigue arrancando y el endpoint de imagenes responde con error de storage no configurado.
