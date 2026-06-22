<?php

namespace App\Http\Controllers;

// ============================================================
// DEPENDENCIAS
// ============================================================
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

// ============================================================
// CONTROLADOR: UsuarioController
// ============================================================
// Gestiona: Registro | Login | Perfil | Logout
// ============================================================
class UsuarioController extends Controller
{

    // ============================================================
    // OPERACIÓN: REGISTRO
    // ============================================================
    // POST /api/v1/registro
    // Crea un nuevo usuario y devuelve token de acceso
    // ============================================================
    public function registro(Request $request): JsonResponse
    {
        // --- 1. Validar datos de entrada ---
        $request->validate([
            'nombre'    => 'required|string|max:255',
            'email'     => 'required|string|email|max:255|unique:usuarios,email',
            'password'  => 'required|string|min:8|confirmed',
            'telefono'  => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:255',
            'rol_id'    => 'required|exists:roles,id',
        ]);

        // --- 2. Crear usuario en BD ---
        $usuario = Usuario::create([
            'nombre'    => $request->nombre,
            'email'     => $request->email,
            'password'  => $request->password,
            'telefono'  => $request->telefono,
            'direccion' => $request->direccion,
            'rol_id'    => $request->rol_id,
        ]);

        // --- 3. Generar token ---
        $token = $usuario->createToken('auth-token')->plainTextToken;

        // --- 4. Responder ---
        return response()->json([
            'status'  => 'success',
            'mensaje' => 'Usuario registrado exitosamente',
            'data'    => [
                'usuario' => $usuario,
                'token'   => $token,
            ],
        ], 201);
    }

    // ============================================================
    // OPERACIÓN: LOGIN
    // ============================================================
    // POST /api/v1/login
    // Autentica credenciales y devuelve token
    // ============================================================
    public function login(Request $request): JsonResponse
    {
        // --- 1. Validar datos de entrada ---
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        // --- 2. Buscar usuario por email ---
        $usuario = Usuario::where('email', $request->email)->first();

        // --- 3. Verificar contraseña ---
        if (! $usuario || ! Hash::check($request->password, $usuario->password)) {
            return response()->json([
                'status'  => 'error',
                'mensaje' => 'Credenciales inválidas',
            ], 401);
        }

        // --- 4. Revocar tokens anteriores y crear nuevo ---
        $usuario->tokens()->delete();
        $token = $usuario->createToken('auth-token')->plainTextToken;

        // --- 5. Responder con datos del usuario + token ---
        return response()->json([
            'status'  => 'success',
            'mensaje' => 'Inicio de sesión exitoso',
            'data'    => [
                'usuario' => $usuario->load('rol'),
                'token'   => $token,
            ],
        ]);
    }

    // ============================================================
    // OPERACIÓN: PERFIL
    // ============================================================
    // GET /api/v1/perfil
    // Devuelve datos del usuario autenticado (requiere token)
    // ============================================================
    public function perfil(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data'   => [
                'usuario' => $request->user()->load('rol'),
            ],
        ]);
    }

    // ============================================================
    // OPERACIÓN: LOGOUT
    // ============================================================
    // POST /api/v1/logout
    // Revoca el token actual (requiere token)
    // ============================================================
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'  => 'success',
            'mensaje' => 'Sesión cerrada exitosamente',
        ]);
    }

}
