# Deploy a Render

## Requisitos Previos

- Cuenta en [Render.com](https://render.com)
- Cuenta en GitHub
- Proyecto subido a GitHub

## Paso 1: Preparar el Repositorio

```bash
# Asegúrate de tener .gitignore para no subir archivos sensibles
git add .
git commit -m "Preparar para deploy"
git push origin main
```

## Paso 2: Crear Base de Datos PostgreSQL

1. En Render Dashboard: **New** → **PostgreSQL**
2. Configurar:
   - Name: `munidigital-db` (o el nombre que prefieras)
   - Database: `munidigital`
   - User: (se genera automático)
   - Region: Elige la más cercana
   - Plan: Free (o el que necesites)
3. Click en **Create Database**
4. Espera a que se cree (2-3 minutos)
5. **IMPORTANTE**: Copia el `External Database URL` (la usarás después)

## Paso 3: Ejecutar Migraciones

1. En la página de tu base de datos en Render, ve a la pestaña **Shell**
2. Se abrirá una terminal conectada a tu base de datos
3. Copia y pega el contenido completo de `migrations/schema.sql`
4. Presiona Enter para ejecutar
5. Verifica que las tablas se crearon correctamente:
   ```sql
   \dt
   ```
   Deberías ver las tablas: `users` y `tramites`

## Paso 4: Crear Web Service

1. En Render Dashboard: **New** → **Web Service**
2. Conecta tu repositorio de GitHub
3. Configurar:
   - **Name**: `munidigital-api` (o el que prefieras)
   - **Region**: La misma que elegiste para la DB
   - **Branch**: `main` (o la rama que uses)
   - **Root Directory**: (dejar vacío)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (o el que necesites)

## Paso 5: Variables de Entorno

En la sección **Environment Variables** del Web Service, añade:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | El External Database URL que copiaste en el Paso 2 |
| `JWT_SECRET` | Un string aleatorio largo y seguro (mínimo 32 caracteres) |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `PORT` | (No es necesario, Render lo asigna automáticamente) |

**Generar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Paso 6: Deploy

1. Click en **Create Web Service**
2. Render automáticamente:
   - Clonará tu repositorio
   - Ejecutará `npm install`
   - Iniciará tu aplicación con `npm start`
3. Espera 2-5 minutos a que termine el deploy
4. Verás el estado "Live" cuando esté listo

## Paso 7: Probar la API

Tu API estará disponible en: `https://tu-servicio.onrender.com`

Endpoints para probar:
- `GET https://tu-servicio.onrender.com/` - Health check
- `GET https://tu-servicio.onrender.com/docs` - Documentación Swagger

## Paso 8: Crear Usuario de Prueba (Opcional)

Usa Postman, Thunder Client, o curl:

```bash
curl -X POST https://tu-servicio.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123!",
    "full_name": "Administrador"
  }'
```

## Troubleshooting

### Error de conexión a base de datos
- Verifica que el `DATABASE_URL` en variables de entorno sea correcto
- Asegúrate de usar el **External Database URL** (no el Internal)

### Error 503 o aplicación no responde
- Revisa los logs en Render: Service → Logs
- Verifica que `npm start` esté configurado correctamente en package.json

### Migraciones no aplicadas
- Vuelve a ejecutar el schema.sql en la Shell de la base de datos
- Verifica que las tablas existan: `\dt` en la Shell

### Variables de entorno no se aplican
- Después de cambiar variables de entorno, debes hacer un **Manual Deploy**
- Service → Manual Deploy → Deploy latest commit

## Siguiente Deploy (Updates)

Cada vez que hagas push a GitHub:
```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

Render automáticamente detectará el cambio y hará redeploy.

## Notas Importantes

- ⚠️ El plan Free de Render se "duerme" después de 15 minutos de inactividad
- ⚠️ La primera request después de dormir puede tardar 30-60 segundos
- ⚠️ Nunca subas archivos .env al repositorio
- ⚠️ Usa siempre JWT_SECRET seguros en producción