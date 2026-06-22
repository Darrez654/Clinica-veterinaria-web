<?php

namespace App\Http\Controllers;

// ============================================================
// DEPENDENCIAS
// ============================================================
use App\Models\RegistroClinico;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// ============================================================
// CONTROLADOR: RegistroClinicoController
// ============================================================
// Gestiona: Listar | Ver detalle (solo lectura para dueños)
// ============================================================
class RegistroClinicoController extends Controller
{

    // ============================================================
    // OPERACIÓN: LISTAR REGISTROS CLÍNICOS
    // ============================================================
    // GET /api/v1/registros-clinicos
    // Devuelve todos los registros de las mascotas del dueño
    // ============================================================
    public function index(Request $request): JsonResponse
    {
        $registros = RegistroClinico::whereHas('mascota', function ($query) use ($request) {
            $query->where('usuario_id', $request->user()->id);
        })
            ->with(['mascota', 'veterinario'])
            ->orderBy('fecha', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $registros,
        ]);
    }

    // ============================================================
    // OPERACIÓN: VER REGISTRO CLÍNICO
    // ============================================================
    // GET /api/v1/registros-clinicos/{id}
    // ============================================================
    public function show(Request $request, $id): JsonResponse
    {
        $registro = RegistroClinico::whereHas('mascota', function ($query) use ($request) {
            $query->where('usuario_id', $request->user()->id);
        })
            ->with(['mascota', 'veterinario'])
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $registro,
        ]);
    }

}
