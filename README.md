# 🐾 VetClinic — Sistema de Gestión Veterinaria

**VetClinic** es un sistema web monolito construido con **Laravel 11** y **Docker** para la gestión integral de una clínica veterinaria. Permite registrar mascotas, agendar citas, gestionar historiales clínicos y administrar roles de usuario (cliente, veterinario, asistente, admin).

---

## 📋 Tabla de Contenidos

1. [Stack Tecnológico](#-stack-tecnológico)
2. [Características](#-características)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Instalación Local](#-instalación-local)
5. [Usuarios de Prueba](#-usuarios-de-prueba)
6. [Rutas del Sistema](#-rutas-del-sistema)
7. [Modelo de Datos](#-modelo-de-datos)
8. [Roles y Permisos](#-roles-y-permisos)
9. [Despliegue en Producción](#-despliegue-en-producción)
10. [API REST](#-api-rest)

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
|------------|-----------|
| **Backend** | Laravel 11 (PHP 8.3) |
| **Frontend** | Blade + CSS vanilla (sin framework JS) |
| **Base de datos** | MySQL 8.0 / SQLite (desarrollo) |
| **Contenedores** | Docker + Docker Compose |
| **Servidor web** | Nginx (Alpine) |
| **Autenticación web** | Sesiones nativas de Laravel (`Auth`) |
| **Autenticación API** | Laravel Sanctum (tokens) |
| **Middleware personalizado** | `RoleMiddleware` (protección por rol) |

---

## ✨ Características

### 👤 Cliente / Dueño de mascota
- ✅ Registro e inicio de sesión con sesiones web
- ✅ Recuperación de contraseña por correo
- ✅ Dashboard con tarjetas de sus mascotas
- ✅ Registrar nuevas mascotas (nombre, especie, raza, edad, peso)
- ✅ Agendar citas veterinarias (seleccionando mascota, fecha, hora, motivo)
- ✅ Cancelar citas programadas
- ✅ Ver historial clínico completo de sus mascotas (línea de tiempo)

### 🩺 Veterinario / Admin
- ✅ Panel exclusivo con citas pendientes del sistema
- ✅ Atender citas: formulario para registrar diagnóstico, tratamiento y observaciones
- ✅ Al atender una cita, se crea automáticamente el registro clínico y la cita pasa a estado "completada"
- ✅ Acceso al historial clínico global

### 🔐 Seguridad
- ✅ Middleware `role` para proteger rutas por rol (`admin`, `veterinario`, `asistente`, `cliente`)
- ✅ CSRF protection en todos los formularios
- ✅ Validación de pertenencia (solo el dueño puede ver/modificar sus mascotas y citas)
- ✅ Contraseñas hasheadas con Bcrypt

---

## 📁 Estructura del Proyecto

```
mi-servidor-laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/       # Controladores API REST
│   │   └── Middleware/
│   │       └── RoleMiddleware.php  # Protección por roles
│   ├── Models/
│   │   ├── Usuario.php        # Modelo personalizado (tabla: usuarios)
│   │   ├── Mascota.php
│   │   ├── Cita.php
│   │   ├── Rol.php
│   │   └── RegistroClinico.php
├── bootstrap/
│   └── app.php                # Registro del middleware 'role'
├── config/
│   └── auth.php               # Configuración de autenticación (modelo Usuario)
├── database/
│   ├── migrations/            # 10 migraciones (tablas del sistema)
│   └── seeders/
│       ├── DatabaseSeeder.php
│       └── RolSeeder.php      # 4 roles: admin, veterinario, asistente, cliente
├── resources/views/
│   ├── layouts/
│   │   └── app.blade.php      # Layout base (sidebar, header, footer)
│   ├── auth/
│   │   ├── forgot-password.blade.php
│   │   └── reset-password.blade.php
│   ├── citas/index.blade.php
│   ├── historial/index.blade.php
│   ├── mascotas/create.blade.php
│   ├── veterinario/dashboard.blade.php
│   ├── dashboard.blade.php
│   ├── login.blade.php
│   └── registro.blade.php
├── routes/
│   ├── web.php                # 14 rutas web (monolito)
│   └── api.php                # 19 rutas API REST
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## 🚀 Instalación Local

### Prerrequisitos
- Docker Desktop
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Darrez654/Clinica-veterinaria-web.git
cd Clinica-veterinaria-web

# 2. Copiar entorno
copy .env.example .env

# 3. Levantar contenedores
docker-compose up -d --build

# 4. Instalar dependencias
docker-compose exec php composer install

# 5. Generar APP_KEY
docker-compose exec php php artisan key:generate

# 6. Ejecutar migraciones y seeders
docker-compose exec php php artisan migrate --seed

# 7. Acceder
http://localhost:8080
```

> ⚠️ Si usas **PowerShell**, separa los comandos con `;` en vez de `&&`.

### Variables de entorno (`.env`)

```ini
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel_db
DB_USERNAME=laravel_user
DB_PASSWORD=secret

MAIL_MAILER=log         # Para desarrollo: guarda correos en storage/logs/laravel.log
```

---

## 👥 Usuarios de Prueba

> Los siguientes usuarios se crean al ejecutar `php artisan migrate --seed`.

| Rol | Nombre | Email | Contraseña |
|-----|--------|-------|------------|
| 🛡️ Admin | Admin VetClinic | `admin@vetclinic.com` | `admin123` |
| 🩺 Veterinario | Dr. Carlos Mendoza | `vet@vetclinic.com` | `vet123` |
| 🐾 Cliente | Pedro Rodríguez | `pedro@email.com` | `123456` |
| 🐾 Cliente | Ana Martínez | `ana@email.com` | `123456` |

---

## 🛣️ Rutas del Sistema

### 🌐 Rutas Web (Monolito Blade)

| Método | URL | Middleware | Descripción |
|--------|-----|------------|-------------|
| GET | `/` o `/login` | `guest` | Formulario de inicio de sesión |
| POST | `/login` | `guest` | Procesar inicio de sesión |
| GET | `/registro` | `guest` | Formulario de registro |
| POST | `/registro` | `guest` | Crear cuenta nueva (rol: cliente) |
| GET | `/olvide-contrasena` | `guest` | Solicitar recuperación de contraseña |
| POST | `/olvide-contrasena` | `guest` | Enviar enlace de recuperación |
| GET | `/restablecer-contrasena/{token}` | `guest` | Formulario para nueva contraseña |
| POST | `/restablecer-contrasena` | `guest` | Procesar restablecimiento |
| GET | `/dashboard` | `auth` | Dashboard del cliente (o redirige a vet si es admin/vet) |
| GET | `/veterinario/dashboard` | `role:veterinario,admin` | Panel del veterinario (citas pendientes) |
| GET | `/mascotas/registrar` | `auth` | Formulario de registro de mascota |
| POST | `/mascotas/registrar` | `auth` | Guardar nueva mascota |
| GET | `/citas` | `auth` | Listado de citas + formulario nueva cita |
| POST | `/citas` | `auth` | Agendar nueva cita |
| POST | `/citas/{id}/cancelar` | `auth` | Cancelar cita (solo el dueño) |
| POST | `/citas/{id}/atender` | `role:veterinario,admin` | Atender cita + crear registro clínico |
| GET | `/historial` | `auth` | Historial clínico del usuario (cliente) |

### 🔌 Rutas API REST

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/api/v1/login` | Pública | Inicio de sesión (token) |
| POST | `/api/v1/registro` | Pública | Registro de usuario |
| GET | `/api/v1/perfil` | Sanctum | Perfil del usuario autenticado |
| GET/POST | `/api/v1/mascotas` | Sanctum | Listar / Crear mascotas |
| GET/PUT/DELETE | `/api/v1/mascotas/{id}` | Sanctum | CRUD de mascota individual |
| GET/POST | `/api/v1/citas` | Sanctum | Listar / Crear citas |
| PUT/DELETE | `/api/v1/citas/{id}` | Sanctum | Actualizar / Cancelar cita |
| GET | `/api/v1/registros-clinicos` | Sanctum | Listar registros clínicos del usuario |
| GET | `/api/v1/mascotas/{id}/historial` | Sanctum | Historial de una mascota específica |

---

## 📊 Modelo de Datos

```
roles (id, nombre, descripcion)
  │
  └── usuarios (id, nombre, email, password, rol_id, telefono, direccion)
         │
         ├── mascotas (id, nombre, especie, raza, edad, peso, color, usuario_id)
         │     ├── registros_clinicos (id, mascota_id, veterinario_id, fecha, tipo, diagnostico, tratamiento, observaciones)
         │     └── citas (id, mascota_id, usuario_id, veterinario_id, fecha, hora, motivo, estado, notas)
         │
         └── citas (como dueño)
```

---

## 🎭 Roles y Permisos

| Rol | Acceso |
|-----|--------|
| **admin** 🛡️ | Panel veterinario + todas las vistas + API completa |
| **veterinario** 🩺 | Panel veterinario (atender citas, registrar historial) + API |
| **asistente** 🤝 | Panel de cliente + tareas administrativas básicas |
| **cliente** 🐾 | Solo sus mascotas, citas e historial clínico |

El middleware `role` se usa así en las rutas:

```php
Route::get('/veterinario/dashboard', function () {
    // ...
})->middleware('role:veterinario,admin');
```

---

## ☁️ Despliegue en Producción (VPS)

### En el servidor (DigitalOcean, AWS, etc.):

```bash
# 1. Clonar
git clone https://github.com/Darrez654/Clinica-veterinaria-web.git
cd Clinica-veterinaria-web

# 2. Configurar .env
nano .env
# APP_ENV=production
# APP_DEBUG=false
# APP_URL=https://tudominio.com

# 3. Construir y levantar
docker-compose up -d --build

# 4. Migrar
docker-compose exec php php artisan migrate --seed

# 5. Optimizar Laravel
docker-compose exec php php artisan optimize

# 6. Permisos
docker-compose exec php chmod -R 775 storage bootstrap/cache
```

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

<p align="center">Desarrollado con ❤️ para la gestión veterinaria moderna 🐾</p>
