<?php

use App\Http\Controllers\CitaController;
use App\Http\Controllers\MascotaController;
use App\Http\Controllers\RegistroClinicoController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Support\Facades\Route;


// ============================================================
// API v1 — VetClinic
// ============================================================

Route::prefix('v1')->group(function () {

    // ============================================================
    // RUTAS PÚBLICAS (sin autenticación)
    // ============================================================
    Route::post('login',    [UsuarioController::class, 'login']);
    Route::post('registro', [UsuarioController::class, 'registro']);

    // ============================================================
    // RUTAS PROTEGIDAS (requieren token Sanctum)
    // ============================================================
    Route::middleware('auth:sanctum')->group(function () {

        // --- Usuario / Perfil ---
        Route::get('perfil',  [UsuarioController::class, 'perfil']);
        Route::post('logout', [UsuarioController::class, 'logout']);

        // --- Mascotas (CRUD completo) ---
        Route::apiResource('mascotas', MascotaController::class);

        // --- Citas ---
        Route::get('citas',                [CitaController::class, 'index']);
        Route::post('citas',               [CitaController::class, 'store']);
        Route::post('citas/{id}/cancelar', [CitaController::class, 'cancelar']);

        // --- Registros Clínicos (solo lectura para el dueño) ---
        Route::get('registros-clinicos',       [RegistroClinicoController::class, 'index']);
        Route::get('registros-clinicos/{id}',  [RegistroClinicoController::class, 'show']);
    });
});