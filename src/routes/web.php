<?php

use Illuminate\Support\Facades\Route;

// Ruta web - solo para probar que el servidor funciona
Route::get('/', function () {
    return response()->json([
        'status' => 'online',
        'mensaje' => 'API funcionando correctamente'
    ]);
});

// Ruta web - Login
Route::get('/login', function () {
    return view('login');
});

// Ruta web - Dashboard (protegido por token en frontend)
Route::get('/dashboard', function () {
    return view('dashboard');
});

//Recordar colocar esto en los diagramas, esta es la ruta principal para la solicitud de conexion de las APIS
//Te amo Minerva <3 jajajajajaja.s