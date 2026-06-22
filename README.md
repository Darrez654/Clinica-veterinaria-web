# 🐾 VetClinic — Sistema de Gestión Veterinaria

**VetClinic** es un sistema web monolito construido con **Laravel 11** y **Docker** para la gestión integral de una clínica veterinaria. Permite registrar mascotas, agendar citas, gestionar historiales clínicos, subir documentos PDF y administrar roles de usuario (cliente, veterinario, asistente, admin).

---

## 📋 Tabla de Contenidos

1. [Stack Tecnológico](#-stack-tecnológico)
2. [Dependencias PHP (Composer)](#-dependencias-php-composer)
3. [Dependencias Frontend (Node)](#-dependencias-frontend-node)
4. [Características](#-características)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Modelos (10 tablas)](#-modelos-10-tablas)
7. [Migraciones](#-migraciones)
8. [Seeders](#-seeders)
9. [Instalación Local](#-instalación-local)
10. [Usuarios de Prueba](#-usuarios-de-prueba)
11. [Rutas del Sistema](#-rutas-del-sistema)
12. [Modelo de Datos](#-modelo-de-datos)
13. [Roles y Permisos](#-roles-y-permisos)
14. [Despliegue en Producción](#-despliegue-en-producción)
15. [Arquitectura de Contenedores](#-arquitectura-de-contenedores)
16. [Licencia](#-licencia)

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Versión |
|------------|-----------|---------|
| **Backend Framework** | Laravel | 11.31+ |
| **Lenguaje** | PHP | ^8.2 |
| **Frontend** | Blade (Template Engine) + CSS vanilla | — |
| **Base de datos** | MySQL | 8.0 |
| **Contenedores** | Docker + Docker Compose | — |
| **Servidor web** | Nginx (Alpine) | — |
| **Autenticación web** | Sesiones nativas Laravel (`Auth` / `auth` middleware) | — |
| **Autenticación API** | Laravel Sanctum (tokens personales) | ^4.3 |
| **Middleware personalizado** | `RoleMiddleware` | — |
| **Build frontend** | Vite + Laravel Vite Plugin | ^6.0 / ^1.2 |
| **CSS Framework** | Tailwind CSS | ^3.4.13 |

---

## 📦 Dependencias PHP (Composer)

### Producción (`require`)

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `php` | ^8.2 | Lenguaje base |
| `laravel/framework` | ^11.31 | Framework principal (Routing, Eloquent, Blade, Auth, Validation, Mail, Cache, etc.) |
| `laravel/sanctum` | ^4.3 | Autenticación API con tokens (SPA y mobile) |
| `laravel/tinker` | ^2.9 | REPL interactivo para Artisan (`php artisan tinker`) |

### Desarrollo (`require-dev`)

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `fakerphp/faker` | ^1.23 | Generación de datos falsos para seeders y factories |
| `laravel/pail` | ^1.1 | Logging en tiempo real desde la terminal |
| `laravel/pint` | ^1.13 | Code style fixer (PSR-12) |
| `laravel/sail` | ^1.26 | Entorno Docker nativo de Laravel |
| `mockery/mockery` | ^1.6 | Mocking para tests unitarios |
| `nunomaduro/collision` | ^8.1 | Mejora la salida de errores en consola |
| `phpunit/phpunit` | ^11.0.1 | Testing framework |

### Frameworks y librerías internas incluidos en `laravel/framework`:

| Componente | Propósito |
|------------|-----------|
| **Illuminate/Routing** | Sistema de rutas (web + API) |
| **Illuminate/Database** (Eloquent ORM) | Modelos, relaciones, migraciones, seeders |
| **Illuminate/View** (Blade) | Template engine con herencia, secciones, componentes |
| **Illuminate/Auth** | Autenticación con sesiones, guards, providers |
| **Illuminate/Validation** | Validación de formularios y requests |
| **Illuminate/Hashing** | Bcrypt password hashing (`Hash::make`, `Hash::check`) |
| **Illuminate/Session** | Manejo de sesiones (archivo, base de datos, redis) |
| **Illuminate/Mail** | Envío de correos (SMTP, Log, Mailgun, etc.) |
| **Illuminate/Notifications** | Sistema de notificaciones (correo, base de datos) |
| **Illuminate/Filesystem** | Almacenamiento local y en la nube |
| **Illuminate/Http** | Request, Response, Middleware |
| **Illuminate/Cache** | Sistema de caché (archivo, redis, memcached) |
| **Illuminate/Encryption** | Encriptación AES-256-CBC |
| **Carbon** | Manejo de fechas (`\Carbon\Carbon`) |
| **League/Flysystem** | Abstracción de sistemas de archivos |
| **Monolog** | Logging (archivos, syslog, etc.) |
| **Symfony Console** | Artisan CLI |
| **Symfony Process** | Ejecución de procesos del sistema |
| **Guzzle HTTP** | Cliente HTTP para APIs externas |
| **PHPUnit** | Testing |

---

## 📦 Dependencias Frontend (Node.js / npm)

### DevDependencies

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `vite` | ^6.0.11 | Build tool y dev server moderno |
| `laravel-vite-plugin` | ^1.2.0 | Integración Vite + Laravel |
| `tailwindcss` | ^3.4.13 | Framework CSS utilitario |
| `postcss` | ^8.4.47 | Procesador de CSS |
| `autoprefixer` | ^10.4.20 | Prefixes CSS automáticos |
| `axios` | ^1.7.4 | Cliente HTTP para peticiones AJAX |
| `concurrently` | ^9.0.1 | Ejecutar múltiples procesos simultáneos |

---

## ✨ Características

### 👤 Cliente / Dueño de mascota
- ✅ Registro e inicio de sesión con sesiones web
- ✅ Recuperación de contraseña por correo (Password Reset nativo)
- ✅ Dashboard con tarjetas de sus mascotas
- ✅ Registrar nuevas mascotas (nombre, especie, raza, edad, peso)
- ✅ Agendar citas veterinarias (seleccionando mascota, fecha, hora, motivo)
- ✅ Cancelar citas programadas
- ✅ Ver historial clínico completo de sus mascotas (línea de tiempo)
- ✅ Subir, ver y descargar documentos PDF por mascota

### 🩺 Veterinario / Admin
- ✅ Panel exclusivo con citas pendientes del sistema
- ✅ Atender citas: formulario modal para registrar diagnóstico, tratamiento y observaciones
- ✅ Al atender una cita, se crea automáticamente el registro clínico y la cita pasa a estado "completada"
- ✅ Acceso al historial clínico y PDFs de todas las mascotas

### 🔐 Seguridad
- ✅ Middleware `role` para proteger rutas por rol (`admin`, `veterinario`, `asistente`, `cliente`)
- ✅ CSRF protection en todos los formularios
- ✅ Validación de pertenencia (solo el dueño puede ver/modificar sus mascotas, citas y documentos)
- ✅ Contraseñas hasheadas con Bcrypt (`Hash::make`)
- ✅ Sanctum tokens para autenticación API
- ✅ Middleware `auth` protege todas las rutas internas
- ✅ Middleware `guest` para rutas de login/registro

---

## 📁 Estructura del Proyecto

```
mi-servidor-laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── CitaController.php
│   │   │   ├── MascotaController.php
│   │   │   ├── RegistroClinicoController.php
│   │   │   └── UsuarioController.php
│   │   └── Middleware/
│   │       └── RoleMiddleware.php
│   ├── Models/
│   │   ├── Cita.php
│   │   ├── Documento.php
│   │   ├── Mascota.php
│   │   ├── RegistroClinico.php
│   │   ├── Rol.php
│   │   ├── User.php
│   │   └── Usuario.php
│   └── Providers/
│       └── AppServiceProvider.php
├── bootstrap/
│   ├── app.php
│   └── providers.php
├── config/
│   ├── app.php
│   ├── auth.php
│   ├── cache.php
│   ├── database.php
│   ├── filesystems.php
│   ├── logging.php
│   ├── mail.php
│   ├── queue.php
│   ├── sanctum.php
│   ├── services.php
│   └── session.php
├── database/
│   ├── factories/
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   ├── 2026_05_12_200504_create_roles_table.php
│   │   ├── 2026_05_12_200511_create_usuarios_table.php
│   │   ├── 2026_05_12_200519_create_mascotas_table.php
│   │   ├── 2026_05_12_200527_create_registros_clinicos_table.php
│   │   ├── 2026_05_12_201402_create_documentos_table.php
│   │   ├── 2026_05_31_194838_create_personal_access_tokens_table.php
│   │   ├── 2026_05_31_200016_create_citas_table.php
│   │   └── 2026_06_22_220439_add_columns_to_documentos_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       └── RolSeeder.php
├── public/
│   ├── .htaccess
│   ├── index.php
│   └── storage/  →  storage/app/public  (symlink)
├── resources/
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php
│       ├── auth/
│       │   ├── forgot-password.blade.php
│       │   └── reset-password.blade.php
│       ├── citas/
│       │   └── index.blade.php
│       ├── historial/
│       │   └── index.blade.php
│       ├── mascotas/
│       │   └── create.blade.php
│       ├── veterinario/
│       │   └── dashboard.blade.php
│       ├── dashboard.blade.php
│       ├── login.blade.php
│       ├── registro.blade.php
│       └── welcome.blade.php
├── routes/
│   ├── web.php                # 19 rutas web
│   ├── api.php                # 19 rutas API REST
│   └── console.php
├── storage/
│   └── app/public/documentos/  # PDFs subidos
├── .env.example
├── artisan
├── composer.json
├── Dockerfile
├── docker-compose.yml
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🧩 Modelos (10 tablas)

| Modelo | Tabla | Relaciones |
|--------|-------|------------|
| `User` | `users` | Default Laravel (no usado en producción) |
| `Usuario` | `usuarios` | `belongsTo Rol` · `hasMany Mascota` · `hasMany Cita` |
| `Rol` | `roles` | `hasMany Usuario` · Valores: admin, veterinario, asistente, cliente |
| `Mascota` | `mascotas` | `belongsTo Usuario` (dueño) · `hasMany RegistroClinico` · `hasMany Cita` · `hasMany Documento` |
| `Cita` | `citas` | `belongsTo Mascota` · `belongsTo Usuario` (cliente) · `belongsTo Usuario` (veterinario) |
| `RegistroClinico` | `registros_clinicos` | `belongsTo Mascota` · `belongsTo Usuario` (veterinario) |
| `Documento` | `documentos` | `belongsTo Mascota` · `belongsTo RegistroClinico` · `belongsTo Usuario` |

---

## 🗄️ Migraciones

| # | Archivo | Tabla creada |
|---|---------|-------------|
| 1 | `0001_01_01_000000_create_users_table` | `users`, `password_reset_tokens`, `personal_access_tokens` |
| 2 | `0001_01_01_000001_create_cache_table` | `cache`, `cache_locks` |
| 3 | `0001_01_01_000002_create_jobs_table` | `jobs`, `job_batches`, `failed_jobs` |
| 4 | `2026_05_12_200504_create_roles_table` | `roles` |
| 5 | `2026_05_12_200511_create_usuarios_table` | `usuarios` |
| 6 | `2026_05_12_200519_create_mascotas_table` | `mascotas` |
| 7 | `2026_05_12_200527_create_registros_clinicos_table` | `registros_clinicos` |
| 8 | `2026_05_12_201402_create_documentos_table` | `documentos` (columnas base) |
| 9 | `2026_05_31_194838_create_personal_access_tokens_table` | `personal_access_tokens` (Sanctum) |
| 10 | `2026_05_31_200016_create_citas_table` | `citas` |
| 11 | `2026_06_22_220439_add_columns_to_documentos_table` | Agrega columnas a `documentos` |

---

## 🌱 Seeders

### `RolSeeder`
Siembra los 4 roles base:

```php
['nombre' => 'admin',        'descripcion' => 'Acceso total al sistema']
['nombre' => 'veterinario',  'descripcion' => 'Atención de citas y expedientes']
['nombre' => 'asistente',    'descripcion' => 'Apoyo administrativo']
['nombre' => 'cliente',      'descripcion' => 'Dueño de mascotas']
```

### `DatabaseSeeder`
Crea usuarios de prueba + mascotas + citas + registros clínicos.

---

## 🚀 Instalación Local

### Prerrequisitos
- Docker Desktop (Windows/Mac) o Docker Engine (Linux)
- Git
- 4 GB de RAM libre para los contenedores

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Darrez654/Clinica-veterinaria-web.git
cd Clinica-veterinaria-web

# 2. Copiar entorno
copy .env.example .env

# 3. Levantar contenedores
docker-compose up -d --build

# 4. Instalar dependencias PHP
docker-compose exec php composer install

# 5. Generar APP_KEY
docker-compose exec php php artisan key:generate

# 6. Ejecutar migraciones y seeders
docker-compose exec php php artisan migrate --seed

# 7. Crear enlace de almacenamiento (para PDFs)
docker-compose exec php php artisan storage:link

# 8. Acceder
http://localhost:8080
```

> ⚠️ Si usas **PowerShell**, separa los comandos con `;` en vez de `&&`.

### Variables de entorno (`.env`)

```ini
APP_NAME=VetClinic
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel_db
DB_USERNAME=laravel_user
DB_PASSWORD=secret

MAIL_MAILER=log         # Desarrollo: guarda correos en storage/logs/laravel.log
# MAIL_MAILER=smtp      # Producción: configurar SMTP real

SESSION_DRIVER=file
```

---

## 👥 Usuarios de Prueba

> Se crean al ejecutar `php artisan migrate --seed`.

| Rol | Nombre | Email | Contraseña |
|-----|--------|-------|------------|
| 🛡️ Admin | Admin VetClinic | `admin@vetclinic.com` | `admin123` |
| 🩺 Veterinario | Dr. Carlos Mendoza | `vet@vetclinic.com` | `vet123` |
| 🐾 Cliente | Pedro Rodríguez | `pedro@email.com` | `123456` |
| 🐾 Cliente | Ana Martínez | `ana@email.com` | `123456` |

---

## 🛣️ Rutas del Sistema

### 🌐 Rutas Web (Blade) — 19 rutas

| Método | URL | Middleware | Descripción |
|--------|-----|------------|-------------|
| GET | `/` | `guest` | Redirige al login |
| GET | `/login` | `guest` | Formulario de inicio de sesión |
| POST | `/login` | `guest` | Procesar inicio de sesión + redirige según rol |
| GET | `/registro` | `guest` | Formulario de registro con selector de rol |
| POST | `/registro` | `guest` | Crear cuenta + login automático + redirige según rol |
| GET | `/olvide-contrasena` | `guest` | Solicitar enlace de recuperación |
| POST | `/olvide-contrasena` | `guest` | Enviar enlace via `Password::sendResetLink()` |
| GET | `/restablecer-contrasena/{token}` | `guest` | Formulario nueva contraseña |
| POST | `/restablecer-contrasena` | `guest` | Procesar reset via `Password::reset()` |
| GET | `/dashboard` | `auth` | Dashboard cliente / redirige a vet si admin/vet |
| GET | `/veterinario/dashboard` | `role:veterinario,admin` | Panel vet: citas pendientes |
| GET | `/mascotas/registrar` | `auth` | Formulario nueva mascota |
| POST | `/mascotas/registrar` | `auth` | Guardar mascota |
| GET | `/citas` | `auth` | Listado + formulario agendar cita |
| POST | `/citas` | `auth` | Crear nueva cita |
| POST | `/citas/{id}/cancelar` | `auth` | Cancelar cita (solo dueño) |
| POST | `/citas/{id}/atender` | `role:veterinario,admin` | Atender cita + crear registro clínico |
| GET | `/historial` | `auth` | Historial + documentos PDF del usuario |
| GET | `/expedientes` | `auth` | Redirige a `/historial` (compatibilidad) |
| POST | `/documentos/subir` | `auth` | Subir PDF (solo `.pdf`, máx 10MB) |
| GET | `/documentos/{id}/descargar` | `auth` | Ver/descargar PDF |

### 🔌 Rutas API REST (Sanctum) — 19 rutas

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/api/v1/login` | Pública | Login con email+password → token |
| POST | `/api/v1/registro` | Pública | Crear cuenta + token |
| POST | `/api/v1/logout` | Sanctum | Revocar token actual |
| GET | `/api/v1/perfil` | Sanctum | Perfil del usuario |
| PUT | `/api/v1/perfil` | Sanctum | Actualizar perfil |
| GET | `/api/v1/mascotas` | Sanctum | Listar mascotas del usuario |
| POST | `/api/v1/mascotas` | Sanctum | Crear mascota |
| GET | `/api/v1/mascotas/{id}` | Sanctum | Ver mascota |
| PUT | `/api/v1/mascotas/{id}` | Sanctum | Actualizar mascota |
| DELETE | `/api/v1/mascotas/{id}` | Sanctum | Eliminar mascota |
| GET | `/api/v1/citas` | Sanctum | Listar citas del usuario |
| POST | `/api/v1/citas` | Sanctum | Crear cita |
| GET | `/api/v1/citas/{id}` | Sanctum | Ver cita |
| PUT | `/api/v1/citas/{id}` | Sanctum | Actualizar cita |
| DELETE | `/api/v1/citas/{id}` | Sanctum | Cancelar cita |
| GET | `/api/v1/registros-clinicos` | Sanctum | Registros clínicos del usuario |
| GET | `/api/v1/mascotas/{id}/historial` | Sanctum | Historial de una mascota |
| GET | `/api/v1/roles` | Pública | Listar roles disponibles |
| GET | `/api/v1/usuarios` | Sanctum | Listar usuarios (solo admin) |

---

## 📊 Modelo de Datos (ERD)

```
roles
├── id (PK)
├── nombre        (admin | veterinario | asistente | cliente)
└── descripcion
  │
  └── usuarios
      ├── id (PK)
      ├── rol_id (FK → roles.id)
      ├── nombre
      ├── email (UNIQUE)
      ├── password (Bcrypt)
      ├── telefono
      ├── direccion
      ├── remember_token
      └── email_verified_at
        │
        ├── mascotas
        │   ├── id (PK)
        │   ├── usuario_id (FK → usuarios.id)
        │   ├── nombre
        │   ├── especie
        │   ├── raza
        │   ├── edad
        │   ├── peso
        │   ├── color
        │   └── foto
        │     │
        │     ├── registros_clinicos
        │     │   ├── id (PK)
        │     │   ├── mascota_id (FK → mascotas.id)
        │     │   ├── veterinario_id (FK → usuarios.id)
        │     │   ├── fecha
        │     │   ├── tipo
        │     │   ├── descripcion
        │     │   ├── diagnostico
        │     │   ├── tratamiento
        │     │   └── observaciones
        │     │
        │     ├── citas
        │     │   ├── id (PK)
        │     │   ├── mascota_id (FK → mascotas.id)
        │     │   ├── usuario_id (FK → usuarios.id)
        │     │   ├── veterinario_id (FK → usuarios.id, nullable)
        │     │   ├── fecha
        │     │   ├── hora
        │     │   ├── motivo
        │     │   ├── estado (programada | completada | cancelada)
        │     │   └── notas
        │     │
        │     └── documentos
        │         ├── id (PK)
        │         ├── mascota_id (FK → mascotas.id)
        │         ├── registro_clinico_id (FK → registros_clinicos.id, nullable)
        │         ├── usuario_id (FK → usuarios.id)
        │         ├── nombre_original
        │         ├── nombre_archivo
        │         ├── ruta
        │         ├── tipo
        │         └── tamaño (KB)
        │
        └── citas (como cliente/usuario_id)
```

---

## 🎭 Roles y Permisos

| Rol | Acceso web | Acceso API |
|-----|-----------|------------|
| **admin** 🛡️ | Panel veterinario + todas las vistas + CRUD completo | Todos los endpoints |
| **veterinario** 🩺 | Panel veterinario (atender citas, ver PDFs) | Citas + registros clínicos |
| **asistente** 🤝 | Panel cliente + tareas básicas | Lectura de citas y mascotas |
| **cliente** 🐾 | Solo sus mascotas, citas, historial y PDFs | Solo sus propios recursos |

### Middleware personalizado `RoleMiddleware`

```php
// Registrar en bootstrap/app.php:
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => \App\Http\Middleware\RoleMiddleware::class
    ]);
})

// Usar en rutas:
Route::get('/veterinario/dashboard', function () {
    // ...
})->middleware('role:veterinario,admin');

// Lógica del middleware:
$roles = explode(',', $role);
if (!Auth::user()->rol || !in_array(Auth::user()->rol->nombre, $roles)) {
    abort(403, 'No tienes permiso para acceder.');
}
```

---

## 🐳 Arquitectura de Contenedores

### `docker-compose.yml`

```yaml
services:
  nginx:        # Servidor web
    image: nginx:alpine
    ports: ["8080:80"]
    volumes: [./src:/var/www/html]
    depends_on: [php]

  php:          # PHP-FPM + Laravel
    build: .
    volumes: [./src:/var/www/html]
    depends_on: [mysql]

  mysql:        # Base de datos
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: laravel_db
      MYSQL_USER: laravel_user
      MYSQL_PASSWORD: secret
    volumes: [mysql_data:/var/lib/mysql]
```

---

## ☁️ Despliegue en Producción (VPS)

### En el servidor (DigitalOcean, AWS EC2, Linode):

```bash
# 1. Conectar por SSH
ssh root@tudominio.com

# 2. Clonar
git clone https://github.com/Darrez654/Clinica-veterinaria-web.git
cd Clinica-veterinaria-web

# 3. Configurar .env para producción
nano .env
```

```ini
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tudominio.com

DB_CONNECTION=mysql
DB_HOST=mysql
DB_DATABASE=laravel_db
DB_USERNAME=laravel_user
DB_PASSWORD=contraseña_segura

MAIL_MAILER=smtp
MAIL_HOST=smtp.tudominio.com
MAIL_PORT=587
MAIL_USERNAME=no-reply@tudominio.com
MAIL_PASSWORD=contraseña_mail
MAIL_ENCRYPTION=tls

SESSION_DRIVER=file
SESSION_SECURE_COOKIE=true
```

```bash
# 4. Construir y levantar
docker-compose up -d --build

# 5. Migrar y sembrar
docker-compose exec php php artisan migrate --seed

# 6. Crear enlace de storage
docker-compose exec php php artisan storage:link

# 7. Optimizar Laravel
docker-compose exec php php artisan optimize

# 8. Cachear rutas y config
docker-compose exec php php artisan route:cache
docker-compose exec php php artisan view:cache

# 9. Permisos
docker-compose exec php chmod -R 775 storage bootstrap/cache
```

### Comandos de mantenimiento

```bash
# Ver logs de Laravel
docker-compose exec php tail -f storage/logs/laravel.log

# Ver logs de contenedores
docker-compose logs -f php

# Reiniciar servicios
docker-compose restart

# Acceder a Tinker
docker-compose exec php php artisan tinker
```

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

<p align="center">Desarrollado con ❤️ para la gestión veterinaria moderna 🐾</p>
<p align="center">Laravel is a Trademark of Taylor Otwell. Copyright © 2011-2025 Laravel LLC.</p>
