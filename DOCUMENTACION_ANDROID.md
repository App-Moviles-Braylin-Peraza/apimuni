# 📱 **DOCUMENTACIÓN API PARA DESARROLLADOR ANDROID**
## MuniDigital API - Integración con Android

### **🌐 URL BASE DE LA API**
```
URL de Producción: https://apimunidigital.onrender.com
Documentación Swagger: https://apimunidigital.onrender.com/docs
```

---

## **🔐 1. AUTENTICACIÓN**

La API usa **JWT (JSON Web Tokens)** para autenticación. Todos los endpoints de trámites requieren token.

### **1.1 Registro de Usuario**
```
POST https://apimunidigital.onrender.com/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "usuario123",
  "password": "password123",
  "full_name": "Juan Pérez"
}
```

**Validaciones:**
- `username`: mínimo 4 caracteres, único
- `password`: mínimo 6 caracteres
- `full_name`: opcional

**Response (201 Created):**
```json
{
  "id": 1,
  "username": "usuario123",
  "full_name": "Juan Pérez",
  "created_at": "2025-12-12T10:30:00.000Z"
}
```

**Errores:**
- `400`: Usuario ya existe o validación fallida
```json
{
  "message": "El nombre de usuario ya existe"
}
```

---

### **1.2 Login**
```
POST https://apimunidigital.onrender.com/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "usuario123",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "usuario123",
    "full_name": "Juan Pérez"
  }
}
```

**⚠️ IMPORTANTE:** 
- El token expira en **7 días** por defecto
- Guardar el token en SharedPreferences/DataStore
- Incluir en todas las peticiones protegidas

**Errores:**
- `401`: Credenciales inválidas
```json
{
  "message": "Credenciales inválidas"
}
```

---

## **📋 2. ENDPOINTS DE TRÁMITES**

**⚠️ Todos estos endpoints requieren autenticación:**
```
Authorization: Bearer <token>
```

### **2.1 Listar Trámites del Usuario**
```
GET https://apimunidigital.onrender.com/tramites
Authorization: Bearer <token>
```

**Query Parameters (todos opcionales):**
- `page`: número de página (default: 1)
- `limit`: resultados por página (default: 20)
- `status`: filtrar por estado ("INICIADO", "EN_PROCESO", "FINALIZADO")
- `sort`: campo para ordenar (default: "last_update_date")
- `order`: "ASC" o "DESC" (default: "DESC")

**Ejemplo:**
```
GET https://apimunidigital.onrender.com/tramites?page=1&limit=10&status=EN_PROCESO&order=DESC
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Solicitud de Permiso de Construcción",
    "description": "Construcción de vivienda unifamiliar",
    "status": "EN_PROCESO",
    "user_id": 1,
    "creation_date": "2025-12-10T08:00:00.000Z",
    "last_update_date": "2025-12-12T10:30:00.000Z"
  },
  {
    "id": 2,
    "title": "Certificado de Residencia",
    "description": null,
    "status": "INICIADO",
    "user_id": 1,
    "creation_date": "2025-12-11T14:20:00.000Z",
    "last_update_date": "2025-12-11T14:20:00.000Z"
  }
]
```

---

### **2.2 Crear Nuevo Trámite**
```
POST https://apimunidigital.onrender.com/tramites
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Título del trámite",
  "description": "Descripción detallada (opcional)"
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "title": "Título del trámite",
  "description": "Descripción detallada",
  "status": "INICIADO",
  "user_id": 1,
  "creation_date": "2025-12-12T11:00:00.000Z",
  "last_update_date": "2025-12-12T11:00:00.000Z"
}
```

---

### **2.3 Obtener un Trámite Específico**
```
GET https://apimunidigital.onrender.com/tramites/:id
Authorization: Bearer <token>
```

**Ejemplo:**
```
GET https://apimunidigital.onrender.com/tramites/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Solicitud de Permiso",
  "description": "Detalle del trámite",
  "status": "EN_PROCESO",
  "user_id": 1,
  "creation_date": "2025-12-10T08:00:00.000Z",
  "last_update_date": "2025-12-12T10:30:00.000Z"
}
```

**Errores:**
- `404`: Trámite no encontrado
- `403`: No tienes permiso (no es tu trámite)

---

### **2.4 Actualizar Trámite**
```
PUT https://apimunidigital.onrender.com/tramites/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (todos los campos son opcionales):**
```json
{
  "title": "Nuevo título",
  "description": "Nueva descripción",
  "status": "FINALIZADO"
}
```

**Campos permitidos:**
- `title`
- `description`
- `status` (valores: "INICIADO", "EN_PROCESO", "FINALIZADO")

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Nuevo título",
  "description": "Nueva descripción",
  "status": "FINALIZADO",
  "user_id": 1,
  "creation_date": "2025-12-10T08:00:00.000Z",
  "last_update_date": "2025-12-12T11:30:00.000Z"
}
```

**Nota:** `last_update_date` se actualiza automáticamente.

---

### **2.5 Eliminar Trámite (Soft Delete)**
```
DELETE https://apimunidigital.onrender.com/tramites/:id
Authorization: Bearer <token>
```

**Response (204 No Content):** Sin cuerpo de respuesta

**⚠️ IMPORTANTE:** Es un **soft delete**, el registro se marca como eliminado pero no se borra físicamente.

**Errores:**
- `404`: Trámite no encontrado
- `403`: No tienes permiso

---

## **📊 3. ESTADOS DE TRÁMITES**

Los valores válidos para el campo `status`:
```kotlin
enum class TramiteStatus {
    INICIADO,
    EN_PROCESO,
    FINALIZADO
}
```

---

## **🔧 4. MODELOS DE DATOS PARA ANDROID**

### **User Model**
```kotlin
data class User(
    val id: Int,
    val username: String,
    val full_name: String?,
    val created_at: String
)
```

### **Login Response**
```kotlin
data class LoginResponse(
    val token: String,
    val user: User
)
```

### **Tramite Model**
```kotlin
data class Tramite(
    val id: Int,
    val title: String,
    val description: String?,
    val status: String, // "INICIADO", "EN_PROCESO", "FINALIZADO"
    val user_id: Int,
    val creation_date: String, // ISO 8601 format
    val last_update_date: String // ISO 8601 format
)
```

### **Request Models**
```kotlin
data class TramiteRequest(
    val title: String? = null,
    val description: String? = null,
    val status: String? = null
)

data class RegisterRequest(
    val username: String,
    val password: String,
    val full_name: String? = null
)

data class LoginRequest(
    val username: String,
    val password: String
)
```

---

## **🔒 5. MANEJO DE ERRORES**

### **Códigos de Estado HTTP**
- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado
- `204 No Content`: Eliminación exitosa
- `400 Bad Request`: Datos inválidos
- `401 Unauthorized`: No autenticado o token inválido
- `403 Forbidden`: Sin permisos
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

### **Formato de Error**
```json
{
  "message": "Descripción del error"
}
```

O con validaciones:
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "username",
      "location": "body"
    }
  ]
}
```

### **Manejo de Errores en Android**
```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String, val code: Int? = null) : Result<Nothing>()
}

suspend fun <T> safeApiCall(apiCall: suspend () -> T): Result<T> {
    return try {
        Result.Success(apiCall())
    } catch (e: HttpException) {
        val errorBody = e.response()?.errorBody()?.string()
        val message = parseErrorMessage(errorBody) ?: "Error en la petición"
        Result.Error(message, e.code())
    } catch (e: IOException) {
        Result.Error("Error de conexión. Verifica tu internet.")
    } catch (e: Exception) {
        Result.Error("Error inesperado: ${e.message}")
    }
}
```

---

## **📱 6. IMPLEMENTACIÓN EN ANDROID (RETROFIT)**

### **6.1 Dependencias Gradle**
```kotlin
dependencies {
    // Retrofit
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    
    // OkHttp para logging e interceptor
    implementation("com.squareup.okhttp3:okhttp:4.11.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.11.0")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // ViewModel y LiveData
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:2.6.2")
}
```

### **6.2 Interceptor para Token**
```kotlin
class AuthInterceptor(private val tokenProvider: () -> String?) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val token = tokenProvider()
        
        return if (token != null) {
            val authenticatedRequest = request.newBuilder()
                .header("Authorization", "Bearer $token")
                .build()
            chain.proceed(authenticatedRequest)
        } else {
            chain.proceed(request)
        }
    }
}
```

### **6.3 Configuración Retrofit**
```kotlin
object RetrofitClient {
    private const val BASE_URL = "https://apimunidigital.onrender.com/"
    
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = if (BuildConfig.DEBUG) {
            HttpLoggingInterceptor.Level.BODY
        } else {
            HttpLoggingInterceptor.Level.NONE
        }
    }
    
    private val authInterceptor = AuthInterceptor {
        // Obtener token desde SharedPreferences/DataStore
        TokenManager.getToken()
    }
    
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .addInterceptor(authInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    val api: MuniDigitalApi by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(MuniDigitalApi::class.java)
    }
}
```

### **6.4 Interface API**
```kotlin
interface MuniDigitalApi {
    // ============ AUTENTICACIÓN ============
    
    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): User
    
    @POST("auth/login")
    suspend fun login(@Body credentials: LoginRequest): LoginResponse
    
    // ============ TRÁMITES ============
    
    @GET("tramites")
    suspend fun getTramites(
        @Query("page") page: Int? = null,
        @Query("limit") limit: Int? = null,
        @Query("status") status: String? = null,
        @Query("sort") sort: String? = null,
        @Query("order") order: String? = null
    ): List<Tramite>
    
    @POST("tramites")
    suspend fun createTramite(@Body request: TramiteRequest): Tramite
    
    @GET("tramites/{id}")
    suspend fun getTramite(@Path("id") id: Int): Tramite
    
    @PUT("tramites/{id}")
    suspend fun updateTramite(
        @Path("id") id: Int,
        @Body request: TramiteRequest
    ): Tramite
    
    @DELETE("tramites/{id}")
    suspend fun deleteTramite(@Path("id") id: Int): Response<Unit>
}
```

### **6.5 Token Manager (SharedPreferences)**
```kotlin
object TokenManager {
    private const val PREFS_NAME = "muni_digital_prefs"
    private const val TOKEN_KEY = "jwt_token"
    private const val USER_ID_KEY = "user_id"
    private const val USERNAME_KEY = "username"
    
    private lateinit var prefs: SharedPreferences
    
    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }
    
    fun saveToken(token: String) {
        prefs.edit().putString(TOKEN_KEY, token).apply()
    }
    
    fun getToken(): String? {
        return prefs.getString(TOKEN_KEY, null)
    }
    
    fun saveUser(user: User) {
        prefs.edit().apply {
            putInt(USER_ID_KEY, user.id)
            putString(USERNAME_KEY, user.username)
            apply()
        }
    }
    
    fun clearSession() {
        prefs.edit().clear().apply()
    }
    
    fun isLoggedIn(): Boolean {
        return getToken() != null
    }
}
```

### **6.6 Ejemplo de ViewModel**
```kotlin
class AuthViewModel(private val api: MuniDigitalApi) : ViewModel() {
    
    private val _loginState = MutableLiveData<Result<LoginResponse>>()
    val loginState: LiveData<Result<LoginResponse>> = _loginState
    
    private val _registerState = MutableLiveData<Result<User>>()
    val registerState: LiveData<Result<User>> = _registerState
    
    fun login(username: String, password: String) {
        viewModelScope.launch {
            _loginState.value = safeApiCall {
                api.login(LoginRequest(username, password))
            }
        }
    }
    
    fun register(username: String, password: String, fullName: String?) {
        viewModelScope.launch {
            _registerState.value = safeApiCall {
                api.register(RegisterRequest(username, password, fullName))
            }
        }
    }
}

class TramitesViewModel(private val api: MuniDigitalApi) : ViewModel() {
    
    private val _tramites = MutableLiveData<Result<List<Tramite>>>()
    val tramites: LiveData<Result<List<Tramite>>> = _tramites
    
    fun loadTramites(status: String? = null) {
        viewModelScope.launch {
            _tramites.value = safeApiCall {
                api.getTramites(page = 1, limit = 20, status = status)
            }
        }
    }
    
    fun createTramite(title: String, description: String?) {
        viewModelScope.launch {
            val result = safeApiCall {
                api.createTramite(TramiteRequest(title = title, description = description))
            }
            if (result is Result.Success) {
                loadTramites() // Recargar lista
            }
        }
    }
    
    fun updateTramite(id: Int, title: String?, description: String?, status: String?) {
        viewModelScope.launch {
            val result = safeApiCall {
                api.updateTramite(id, TramiteRequest(title, description, status))
            }
            if (result is Result.Success) {
                loadTramites()
            }
        }
    }
    
    fun deleteTramite(id: Int) {
        viewModelScope.launch {
            val result = safeApiCall {
                api.deleteTramite(id)
            }
            if (result is Result.Success) {
                loadTramites()
            }
        }
    }
}
```

### **6.7 Ejemplo de Activity/Fragment**
```kotlin
class LoginActivity : AppCompatActivity() {
    
    private val viewModel: AuthViewModel by viewModels {
        AuthViewModelFactory(RetrofitClient.api)
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        
        TokenManager.init(applicationContext)
        
        viewModel.loginState.observe(this) { result ->
            when (result) {
                is Result.Success -> {
                    TokenManager.saveToken(result.data.token)
                    TokenManager.saveUser(result.data.user)
                    startActivity(Intent(this, MainActivity::class.java))
                    finish()
                }
                is Result.Error -> {
                    Toast.makeText(this, result.message, Toast.LENGTH_LONG).show()
                }
            }
        }
        
        btnLogin.setOnClickListener {
            val username = etUsername.text.toString()
            val password = etPassword.text.toString()
            
            if (username.length >= 4 && password.length >= 6) {
                viewModel.login(username, password)
            } else {
                Toast.makeText(this, "Credenciales inválidas", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
```

---

## **✅ 7. CHECKLIST DE IMPLEMENTACIÓN**

### **Configuración Inicial:**
- [ ] Agregar dependencias en build.gradle
- [ ] Configurar Retrofit con la URL base
- [ ] Implementar TokenManager para gestión de sesión
- [ ] Crear modelos de datos (User, Tramite, etc.)
- [ ] Crear interface API de Retrofit

### **Autenticación:**
- [ ] Implementar pantalla de registro
- [ ] Implementar pantalla de login
- [ ] Guardar token JWT en SharedPreferences/DataStore
- [ ] Implementar interceptor para añadir token a headers
- [ ] Manejar expiración de token (mostrar login nuevamente)
- [ ] Implementar logout (borrar token y navegar a login)
- [ ] Validar campos de formulario

### **Pantalla Principal - Lista de Trámites:**
- [ ] RecyclerView con adapter para trámites
- [ ] Implementar paginación (opcional)
- [ ] Pull-to-refresh (SwipeRefreshLayout)
- [ ] Filtro por estado (INICIADO, EN_PROCESO, FINALIZADO)
- [ ] Click en item para ver detalle
- [ ] FAB para crear nuevo trámite
- [ ] Manejo de lista vacía (EmptyState)
- [ ] Loading indicator

### **Crear/Editar Trámite:**
- [ ] Formulario con campos title y description
- [ ] Validación de campos requeridos
- [ ] Selector de estado (INICIADO, EN_PROCESO, FINALIZADO)
- [ ] Botón guardar
- [ ] Loading indicator durante creación/actualización
- [ ] Mensajes de éxito/error

### **Detalle de Trámite:**
- [ ] Mostrar toda la información del trámite
- [ ] Botón editar
- [ ] Botón eliminar con confirmación
- [ ] Formatear fechas correctamente
- [ ] Menú de opciones (editar/eliminar)

### **UX/UI:**
- [ ] Loading indicators en todas las peticiones
- [ ] Mensajes de error amigables y traducidos
- [ ] Confirmación antes de eliminar
- [ ] Manejo de errores de red
- [ ] Manejo de token expirado
- [ ] Diseño responsive
- [ ] Animaciones de transición

### **Características Adicionales (Opcional):**
- [ ] Búsqueda local de trámites
- [ ] Ordenamiento (por fecha, título, estado)
- [ ] Cache local con Room
- [ ] Modo offline
- [ ] Notificaciones push
- [ ] Exportar/compartir trámites

---

## **🐛 8. TESTING DE LA API**

### **8.1 Con cURL**

#### Health Check
```bash
curl https://apimunidigital.onrender.com/
```

#### Registro
```bash
curl -X POST https://apimunidigital.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "password": "test1234",
    "full_name": "Usuario de Prueba"
  }'
```

#### Login
```bash
curl -X POST https://apimunidigital.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "password": "test1234"
  }'
```

#### Listar Trámites (con token)
```bash
curl https://apimunidigital.onrender.com/tramites \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

#### Crear Trámite
```bash
curl -X POST https://apimunidigital.onrender.com/tramites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "Mi primer trámite",
    "description": "Descripción de prueba"
  }'
```

#### Actualizar Trámite
```bash
curl -X PUT https://apimunidigital.onrender.com/tramites/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "status": "EN_PROCESO"
  }'
```

#### Eliminar Trámite
```bash
curl -X DELETE https://apimunidigital.onrender.com/tramites/1 \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### **8.2 Colección Postman**

Puedes importar esta colección en Postman:

```json
{
  "info": {
    "name": "MuniDigital API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://apimunidigital.onrender.com"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"testuser\",\n  \"password\": \"test1234\",\n  \"full_name\": \"Test User\"\n}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"testuser\",\n  \"password\": \"test1234\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Tramites",
      "item": [
        {
          "name": "List Tramites",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/tramites",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ]
          }
        },
        {
          "name": "Create Tramite",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/tramites",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Nuevo Trámite\",\n  \"description\": \"Descripción del trámite\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## **⚠️ 9. NOTAS IMPORTANTES**

### **9.1 Formato de Fechas**
Todas las fechas están en formato **ISO 8601 (UTC)**:
```
Ejemplo: "2025-12-12T10:30:00.000Z"
```

Para parsear en Android:
```kotlin
import java.time.Instant
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

fun parseDate(dateString: String): ZonedDateTime {
    return ZonedDateTime.parse(dateString)
}

fun formatDate(dateString: String): String {
    val date = ZonedDateTime.parse(dateString)
    val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
    return date.format(formatter)
}
```

### **9.2 Token JWT**
- **Expiración:** 7 días
- **Header requerido:** `Authorization: Bearer <token>`
- **Almacenamiento:** SharedPreferences o DataStore (encriptado recomendado)
- **Renovación:** No implementada, el usuario debe hacer login nuevamente

### **9.3 Seguridad**
- Usar **HTTPS** siempre (ya implementado en producción)
- **No** guardar contraseñas en el dispositivo
- Considerar encriptar el token con EncryptedSharedPreferences
- Limpiar sesión en logout

### **9.4 Rendimiento**
- **Primera petición:** Render puede tardar 30-60 segundos en despertar si está inactivo
- **Paginación:** Usar `page` y `limit` para listas grandes
- **Cache:** Considerar implementar cache local con Room

### **9.5 Manejo de Estados**
Estados válidos del trámite:
- `INICIADO` - Estado inicial
- `EN_PROCESO` - Trámite en progreso
- `FINALIZADO` - Trámite completado

### **9.6 Soft Delete**
Los trámites eliminados:
- NO aparecen en las listas (GET /tramites)
- Permanecen en la base de datos con `is_deleted = true`
- NO se pueden recuperar desde la app (requiere acceso a BD)

---

## **🎯 10. RESUMEN RÁPIDO**

```
✅ URL Base: https://apimunidigital.onrender.com
✅ Docs: https://apimunidigital.onrender.com/docs

🔑 Autenticación:
   POST /auth/register → Registro (username min 4, password min 6)
   POST /auth/login → Login (devuelve token JWT válido 7 días)

📋 Trámites (requieren Authorization: Bearer <token>):
   GET    /tramites → Listar (con paginación y filtros)
   POST   /tramites → Crear (title required, description optional)
   GET    /tramites/:id → Obtener uno
   PUT    /tramites/:id → Actualizar (parcial)
   DELETE /tramites/:id → Eliminar (soft delete)

📊 Estados: INICIADO, EN_PROCESO, FINALIZADO

⚠️  Importante:
   - Token expira en 7 días
   - Render puede tardar en despertar (primera petición)
   - Todas las fechas en UTC (ISO 8601)
   - CORS habilitado para todos los orígenes
```

---

## **📞 11. RECURSOS Y CONTACTO**

- **Documentación Swagger:** https://apimunidigital.onrender.com/docs
- **Health Check:** https://apimunidigital.onrender.com/
- **Base URL:** `https://apimunidigital.onrender.com`

### **Stack Tecnológico de la API**
- Node.js + Express
- PostgreSQL
- JWT para autenticación
- Helmet + CORS para seguridad
- Swagger para documentación

---

## **📝 CHANGELOG**

### v1.0.0 (2025-12-12)
- ✅ Autenticación con JWT
- ✅ CRUD completo de trámites
- ✅ Soft delete
- ✅ Paginación y filtros
- ✅ Documentación Swagger
- ✅ Deploy en Render

---

**Última actualización:** 12 de diciembre de 2025
