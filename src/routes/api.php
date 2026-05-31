<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\MascotaController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\RegistroClinicoController;

// Versión 1 de la API
Route::prefix('v1')->group(function () {

    // ==========================================
    // RUTAS PÚBLICAS (no requieren autenticación)
    // ==========================================
    Route::post('registro', [UsuarioController::class, 'registro']);
    Route::post('login', [UsuarioController::class, 'login']);

    // ==========================================
    // RUTAS PROTEGIDAS (requieren token)
    // ==========================================
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('perfil', [UsuarioController::class, 'perfil']);
        Route::post('logout', [UsuarioController::class, 'logout']);

        // Mascotas
        Route::get('mascotas', [MascotaController::class, 'index']);
        Route::post('mascotas', [MascotaController::class, 'store']);
        Route::get('mascotas/{id}', [MascotaController::class, 'show']);
        Route::put('mascotas/{id}', [MascotaController::class, 'update']);
        Route::delete('mascotas/{id}', [MascotaController::class, 'destroy']);

        // Citas
        Route::get('citas', [CitaController::class, 'index']);
        Route::post('citas', [CitaController::class, 'store']);
        Route::put('citas/{id}/cancelar', [CitaController::class, 'cancelar']);

        // Registros Clínicos
        Route::get('registros-clinicos', [RegistroClinicoController::class, 'index']);
        Route::get('registros-clinicos/{id}', [RegistroClinicoController::class, 'show']);
    });

});