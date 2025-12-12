# MuniDigital API

API REST para gestión de trámites municipales con autenticación JWT.

**Stack:** Node.js + Express + PostgreSQL

## Características

- ✅ Autenticación JWT
- ✅ Soft delete en trámites
- ✅ Documentación Swagger
- ✅ Validación de datos
- ✅ Seguridad con Helmet y CORS

## Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@host:5432/database
JWT_SECRET=secreto_seguro_minimo_32_caracteres
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

## Instalación Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Crear base de datos y ejecutar migración
psql -U tu_usuario -d tu_database -f migrations/schema.sql

# Iniciar servidor
npm start
# o en modo desarrollo
npm run dev
```

## Deploy a Render

Ver instrucciones completas en [deploy/RENDER.md](deploy/RENDER.md)

## API Endpoints

- `GET /` - Health check
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Login
- `GET /tramites` - Listar trámites (requiere auth)
- `POST /tramites` - Crear trámite (requiere auth)
- `PUT /tramites/:id` - Actualizar trámite (requiere auth)
- `DELETE /tramites/:id` - Eliminar trámite - soft delete (requiere auth)
- `GET /docs` - Documentación Swagger

## Estructura del Proyecto

```
├── controllers/       # Controladores de rutas
├── middleware/        # Middleware de autenticación
├── migrations/        # Scripts SQL
├── models/           # Modelos de datos
├── routes/           # Definición de rutas
├── deploy/           # Documentación de deploy
├── db.js             # Configuración de PostgreSQL
├── index.js          # Punto de entrada
└── swagger.yaml      # Documentación API
```