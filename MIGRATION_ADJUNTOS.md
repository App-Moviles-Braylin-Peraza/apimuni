# Migración de Adjuntos a Tabla Tramites

## Cambios Realizados

### 1. Base de Datos
- ✅ Agregada columna `adjuntos JSONB DEFAULT '[]'` a la tabla `tramites`
- ✅ Migrados datos de `tramite_adjuntos` a `tramites.adjuntos`
- ⚠️ La tabla `tramite_adjuntos` aún existe (por si necesitas rollback)

### 2. Estructura de Datos
Los adjuntos ahora se almacenan como un array JSON en la columna `adjuntos`:
```json
[
  {
    "file_url": "https://res.cloudinary.com/.../foto.jpg",
    "file_type": "image/jpeg",
    "file_size": 105474,
    "uploaded_at": "2025-12-13T06:18:21.221Z"
  }
]
```

### 3. API Endpoints (sin cambios)
- `POST /tramites/:tramite_id/adjuntos` - Subir foto
- `GET /tramites/:tramite_id/adjuntos` - Listar adjuntos
- `DELETE /tramites/:tramite_id/adjuntos` - Eliminar adjunto (enviar `file_url` en body)

### 4. Archivos Modificados

#### Schema SQL
- [migrations/schema.sql](migrations/schema.sql) - Agregada columna `adjuntos JSONB`

#### Modelos
- [models/tramite.model.js](models/tramite.model.js)
  - Agregado campo `adjuntos` a las consultas
  - Nueva función: `addAdjunto(tramite_id, adjuntoData)`
  - Nueva función: `removeAdjunto(tramite_id, file_url)`

#### Controladores
- [controllers/adjunto.controller.js](controllers/adjunto.controller.js)
  - `uploadAdjunto`: Usa `tramiteModel.addAdjunto()` en lugar de `adjuntoModel.createAdjunto()`
  - `getAdjuntos`: Retorna `tramite.adjuntos` directamente
  - `deleteAdjunto`: Modificado para recibir `file_url` en body y usar `tramiteModel.removeAdjunto()`

#### Rutas
- [routes/adjunto.routes.js](routes/adjunto.routes.js)
  - Cambio en DELETE: `/:tramite_id/adjuntos` (antes era `/adjuntos/:id`)

## Ventajas del Nuevo Diseño

1. **Simplicidad**: Un solo query para obtener trámite con adjuntos
2. **Performance**: No necesitas JOIN para obtener adjuntos
3. **Atomicidad**: Los adjuntos se actualizan junto con el trámite
4. **Flexibilidad**: JSONB permite queries complejas si lo necesitas

## Migración Manual (si es necesario)

Para aplicar estos cambios en otra base de datos:

```bash
# 1. Ejecutar migración
node migrations/migrate_adjuntos_to_tramites.js

# 2. (Opcional) Eliminar tabla antigua después de verificar
# DROP TABLE tramite_adjuntos CASCADE;
```

## Testing

Ejecutar pruebas:
```bash
node test_new_adjunto_flow.js
node verify_migration.js
```

## Rollback (si es necesario)

Si necesitas volver atrás:
```sql
-- Eliminar columna adjuntos
ALTER TABLE tramites DROP COLUMN adjuntos;

-- La tabla tramite_adjuntos sigue existiendo con los datos originales
```
