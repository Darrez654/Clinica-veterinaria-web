DOCUMENTACIÓN: CONFIGURACIÓN DE SERVIDOR LARAVEL CON DOCKER
Proyecto: Sistema Veterinario (Backend API)
Tecnologías utilizadas
Docker (contenedores)

Laravel 11 (framework PHP)

MySQL 8.0 (base de datos)

Nginx (servidor web)

Composer (gestor de dependencias)

Sanctum (autenticación con tokens)

PARTE 1: INSTALACIÓN Y CONFIGURACIÓN DE DOCKER
1.1 Estructura de carpetas inicial
bash
# Crear carpeta principal del proyecto
mkdir mi-servidor-laravel
cd mi-servidor-laravel

# Crear estructura para Docker
mkdir docker/nginx
mkdir docker/php
mkdir src
1.2 Archivos de configuración de Docker
Archivo: docker-compose.yml
yaml
services:
  nginx:
    image: nginx:alpine
    container_name: laravel-nginx
    ports:
      - "8080:80"
    volumes:
      - ./src:/var/www/html
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - php
    networks:
      - laravel-network

  php:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
    container_name: laravel-php
    volumes:
      - ./src:/var/www/html
    ports:
      - "9000:9000"
    networks:
      - laravel-network

  mysql:
    image: mysql:8.0
    container_name: laravel-mysql
    environment:
      MYSQL_DATABASE: laravel_db
      MYSQL_ROOT_PASSWORD: root
      MYSQL_PASSWORD: secret
      MYSQL_USER: laravel_user
    ports:
      - "3307:3306"
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - laravel-network

networks:
  laravel-network:
    driver: bridge

volumes:
  db_data:
Archivo: docker/nginx/default.conf
nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php index.html;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass php:9000;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
Archivo: docker/php/Dockerfile
dockerfile
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN useradd -m -u 1000 laravel_user
USER laravel_user

WORKDIR /var/www/html
1.3 Construcción de los contenedores
bash
# Construir las imágenes
docker-compose build

# Levantar los contenedores en segundo plano
docker-compose up -d
1.4 Verificación del estado
bash
# Ver contenedores activos
docker-compose ps

# Debe mostrar 3 contenedores: laravel-nginx, laravel-php, laravel-mysql
PARTE 2: INSTALACIÓN DE LARAVEL
2.1 Instalar Laravel dentro del contenedor PHP
bash
# Instalar Laravel 11 (compatible con PHP 8.2)
docker-compose exec php composer create-project laravel/laravel:^11.0 .
2.2 Configurar conexión a base de datos
Editar el archivo src/.env:

env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel_db
DB_USERNAME=laravel_user
DB_PASSWORD=secret
2.3 Ejecutar migraciones iniciales
bash
docker-compose exec php php artisan migrate
2.4 Probar la instalación
Abrir navegador y visitar: http://localhost:8080

Debería verse la pantalla de bienvenida de Laravel.

PARTE 3: FLUJO DE TRABAJO DIARIO
3.1 Comandos básicos
bash
# Levantar los contenedores
docker-compose up -d

# Detener los contenedores
docker-compose down

# Ver logs en tiempo real
docker-compose logs -f

# Entrar al contenedor PHP (para ejecutar Artisan)
docker-compose exec php bash

# Ejecutar comandos Artisan desde afuera
docker-compose exec php php artisan make:controller MiController
docker-compose exec php php artisan migrate
3.2 Desarrollo local
Los archivos del proyecto están en la carpeta src/

Puedes editarlos con cualquier IDE

Los cambios se reflejan instantáneamente (sin reiniciar contenedores)

3.3 Estructura de carpetas dentro de src/
text
src/
├── app/
│   ├── Http/
│   │   ├── Controllers/    # Controladores (lógica de negocio)
│   │   └── Middleware/
│   └── Models/             # Modelos (base de datos)
├── bootstrap/
├── config/
├── database/
│   └── migrations/         # Migraciones (estructura de tablas)
├── public/                 # Punto de entrada
├── routes/
│   ├── web.php             # Rutas web
│   └── api.php             # Rutas API (¡importante!)
└── storage/
PARTE 4: CONFIGURACIÓN DE LA API (VETERINARIO)
4.1 Instalar Laravel Sanctum (autenticación)
bash
docker-compose exec php composer require laravel/sanctum
docker-compose exec php php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
docker-compose exec php php artisan migrate
4.2 Rutas de API (src/routes/api.php)
php
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MascotaController;
use App\Http\Controllers\RegistroClinicoController;

Route::prefix('v1')->group(function () {

    // Públicas
    Route::post('login', [AuthController::class, 'login']);
    Route::post('registro', [AuthController::class, 'registro']);

    // Protegidas (requieren token)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('perfil', [AuthController::class, 'perfil']);
        Route::post('logout', [AuthController::class, 'logout']);

        Route::apiResource('mascotas', MascotaController::class);
        Route::apiResource('registros-clinicos', RegistroClinicoController::class);
    });
});
4.3 Probar la API
bash
# Endpoints disponibles
http://localhost:8080/api/v1/login
http://localhost:8080/api/v1/registro
http://localhost:8080/api/v1/mascotas
http://localhost:8080/api/v1/registros-clinicos
PARTE 5: SOLUCIÓN DE PROBLEMAS COMUNES
Problema	Solución
Puerto 3306 ocupado	Cambiar a 3307 en docker-compose.yml
Dockerfile no encontrado	Renombrar Dockerfile.txt a Dockerfile
Laravel 13 no instala	Usar Laravel 11: create-project laravel/laravel:^11.0 .
Permisos en storage	Ejecutar: docker-compose exec php chmod -R 777 storage bootstrap/cache
RESUMEN DE COMANDOS ÚTILES
bash
# Inicio del entorno
docker-compose up -d

# Ver contenedores
docker-compose ps

# Ejecutar comandos Artisan
docker-compose exec php php artisan list

# Crear controlador
docker-compose exec php php artisan make:controller MiController

# Crear modelo con migración
docker-compose exec php php artisan make:model MiModelo -m

# Ejecutar migraciones
docker-compose exec php php artisan migrate

# Crear migración manual
docker-compose exec php php artisan make:migration nombre_de_la_tabla

# Limpiar caché
docker-compose exec php php artisan cache:clear

# Tinker (consola interactiva)
docker-compose exec php php artisan tinker

# Apagar todo
docker-compose down
CONCLUSIÓN
El entorno está completamente funcional. Se tiene:

✅ Servidor web Nginx

✅ PHP 8.2 con extensiones necesarias

✅ Laravel 11 instalado

✅ MySQL 8.0 conectado

✅ Docker configurado

✅ Rutas de API listas para usar

Próximo paso: Implementar los controladores con la lógica de negocio (AuthController, MascotaController, RegistroClinicoController) basados en los diagramas del sistema veterinario.