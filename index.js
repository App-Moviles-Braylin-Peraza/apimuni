require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/auth.routes.js');
const tramitesRoutes = require('./routes/tramite.routes.js');
const adjuntosRoutes = require('./routes/adjunto.routes.js');

const swaggerPath = path.join(__dirname, 'swagger.yaml');
let swaggerDocument = {};
try {
    swaggerDocument = YAML.load(swaggerPath);
} catch (err) {
    console.warn("⚠️ No se pudo cargar swagger.yaml (opcional).", err.message);
}

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/auth', authRoutes);
app.use('/tramites', tramitesRoutes);
app.use('/tramites', adjuntosRoutes);
app.use('/adjuntos', adjuntosRoutes);

// Swagger Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Endpoint raíz
app.get('/', (req, res) => {
    res.json({ ok: true, msg: 'MuniDigital API Working' });
});

// Puerto controlado por Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});
