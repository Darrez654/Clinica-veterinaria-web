<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UsuarioController extends Controller
{
    /**
     * Registrar un nuevo usuario.
     */
    public function registro(Request $request): JsonResponse
    {
        $request->validate([
            'nombre'    => 'required|string|max:255',
            'email'     => 'required|string|email|max:255|unique:usuarios,email',
            'password'  => 'required|string|min:8|confirmed',
            'telefono'  => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:255',
            'rol_id'    => 'required|exists:roles,id',
        ]);

        $usuario = Usuario::create([
            'nombre'    => $request->nombre,
            'email'     => $request->email,
            'password'  => $request->password,
            'telefono'  => $request->telefono,
            'direccion' => $request->direccion,
            'rol_id'    => $request->rol_id,
        ]);

        $token = $usuario->createToken('auth-token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'mensaje' => 'Usuario registrado exitosamente',
            'data'    => [
                'usuario' => $usuario,
                'token'   => $token,
            ],
        ], 201);
    }

    /**
     * Iniciar sesión.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        $usuario = Usuario::where('email', $request->email)->first();

        if (! $usuario || ! Hash::check($request->password, $usuario->password)) {
            return response()->json([
                'status'  => 'error',
                'mensaje' => 'Credenciales inválidas',
            ], 401);
        }

        // Revocar tokens anteriores (opcional: mantener solo el último)
        $usuario->tokens()->delete();

        $token = $usuario->createToken('auth-token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'mensaje' => 'Inicio de sesión exitoso',
            'data'    => [
                'usuario' => $usuario->load('rol'),
                'token'   => $token,
            ],
        ]);
    }

    /**
     * Obtener perfil del usuario autenticado.
     */
    public function perfil(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data'   => [
                'usuario' => $request->user()->load('rol'),
            ],
        ]);
    }

    /**
     * Cerrar sesión (revocar token actual).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'  => 'success',
            'mensaje' => 'Sesión cerrada exitosamente',
        ]);
    }
}
