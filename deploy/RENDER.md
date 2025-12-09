1. Crear un repo en GitHub y pushear este proyecto.
2. Crear un servicio en Render: New -> Web Service -> Conectar GitHub repo.
- Build Command: npm install
- Start Command: npm start
3. Crear DB PostgreSQL en Render (New -> Database)
- Copiar el DATABASE_URL y pegar en las env vars del Service
4. Añadir variables de entorno en Render (JWT_SECRET, DATABASE_URL, NODE_ENV)
5. Ejecutar la migración: conectar a la DB (psql) y correr migrations/schema.sql
6. Acceder a https://<tu-servicio>.onrender.com/docs para ver Swagger.