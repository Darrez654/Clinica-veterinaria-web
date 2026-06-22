<?php

namespace App\Http\Controllers;

// ============================================================
// DEPENDENCIAS
// ============================================================
use App\Models\Mascota;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// ============================================================
// CONTROLADOR: MascotaController
// ============================================================
// Gestiona: Listar | Crear | Ver | Actualizar | Eliminar
// ============================================================
class MascotaController extends Controller
{

    // ============================================================
    // OPERACIÓN: LISTAR MASCOTAS
    // ============================================================
    // GET  /api/v1/mascotas
    // GET  /api/v1/mascotas?especie=Perro  (filtro opcional)
    // ============================================================
    public function index(Request $request): JsonResponse
    {
        $mascotas = Mascota::where('usuario_id', $request->user()->id)
            ->with('registrosClinicos')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $mascotas,
        ]);
    }

    // ============================================================
    // OPERACIÓN: VER MASCOTA
    // ============================================================
    // GET  /api/v1/mascotas/{id}
    // Incluye registros clínicos + citas de la mascota
    // ============================================================
    public function show(Request $request, $id): JsonResponse
    {
        $mascota = Mascota::where('usuario_id', $request->user()->id)
            ->with(['registrosClinicos.veterinario', 'citas'])
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $mascota,
        ]);
    }

    // ============================================================
    // OPERACIÓN: CREAR MASCOTA
    // ============================================================
    // POST /api/v1/mascotas
    // ============================================================
    public function store(Request $request): JsonResponse
    {
        // --- 1. Validar datos ---
        $request->validate([
            'nombre'  => 'required|string|max:100',
            'especie' => 'required|string|max:50',
            'raza'    => 'nullable|string|max:100',
            'edad'    => 'nullable|integer|min:0|max:50',
            'peso'    => 'nullable|numeric|min:0|max:999.99',
            'color'   => 'nullable|string|max:50',
            'foto'    => 'nullable|string',
        ]);

        // --- 2. Crear en BD ---
        $mascota = Mascota::create([
            'nombre'     => $request->nombre,
            'especie'    => $request->especie,
            'raza'       => $request->raza,
            'edad'       => $request->edad,
            'peso'       => $request->peso,
            'color'      => $request->color,
            'foto'       => $request->foto,
            'usuario_id' => $request->user()->id,
        ]);

        // --- 3. Responder ---
        return response()->json([
            'status'  => 'success',
            'mensaje' => 'Mascota registrada exitosamente',
            'data'    => $mascota,
        ], 201);
    }

    // ============================================================
    // OPERACIÓN: ACTUALIZAR MASCOTA
    // ============================================================
    // PUT /api/v1/mascotas/{id}
    // Solo actualiza los campos enviados
    // ============================================================
    public function update(Request $request, $id): JsonResponse
    {
        // --- 1. Buscar mascota (solo del dueño) ---
        $mascota = Mascota::where('usuario_id', $request->user()->id)->findOrFail($id);

        // --- 2. Validar datos ---
        $request->validate([
            'nombre'  => 'sometimes|string|max:100',
            'especie' => 'sometimes|string|max:50',
            'raza'    => 'nullable|string|max:100',
            'edad'    => 'nullable|integer|min:0|max:50',
            'peso'    => 'nullable|numeric|min:0|max:999.99',
            'color'   => 'nullable|string|max:50',
            'foto'    => 'nullable|string',
        ]);

        // --- 3. Actualizar ---
        $mascota->update($request->only([
            'nombre', 'especie', 'raza', 'edad', 'peso', 'color', 'foto'
        ]));

        // --- 4. Responder ---
        return response()->json([
            'status'  => 'success',
            'mensaje' => 'Mascota actualizada exitosamente',
            'data'    => $mascota,
        ]);
    }

    // ============================================================
    // OPERACIÓN: ELIMINAR MASCOTA
    // ============================================================
    // DELETE /api/v1/mascotas/{id}
    // ============================================================
    public function destroy(Request $request, $id): JsonResponse
    {
        // --- 1. Buscar y eliminar ---
        $mascota = Mascota::where('usuario_id', $request->user()->id)->findOrFail($id);
        $mascota->delete();

        // --- 2. Responder ---
        return response()->json([
            'status'  => 'success',
            'mensaje' => 'Mascota eliminada exitosamente',
        ]);
    }

}
