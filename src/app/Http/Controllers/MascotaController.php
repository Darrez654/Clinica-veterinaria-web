<?php

namespace App\Http\Controllers;

use App\Models\Mascota;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MascotaController extends Controller
{
    /**
     * Listar mascotas del usuario autenticado.
     */
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

    /**
     * Mostrar una mascota específica.
     */
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

    /**
     * Registrar una nueva mascota.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nombre'  => 'required|string|max:100',
            'especie' => 'required|string|max:50',
            'raza'    => 'nullable|string|max:100',
            'edad'    => 'nullable|integer|min:0|max:50',
            'peso'    => 'nullable|numeric|min:0|max:999.99',
            'color'   => 'nullable|string|max:50',
            'foto'    => 'nullable|string',
        ]);

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

        return response()->json([
            'status'  => 'success',
            'mensaje' => 'Mascota registrada exitosamente',
            'data'    => $mascota,
        ], 201);
    }

    /**
     * Actualizar datos de una mascota.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $mascota = Mascota::where('usuario_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'nombre'  => 'sometimes|string|max:100',
            'especie' => 'sometimes|string|max:50',
            'raza'    => 'nullable|string|max:100',
            'edad'    => 'nullable|integer|min:0|max:50',
            'peso'    => 'nullable|numeric|min:0|max:999.99',
            'color'   => 'nullable|string|max:50',
            'foto'    => 'nullable|string',
        ]);

        $mascota->update($request->only([
            'nombre', 'especie', 'raza', 'edad', 'peso', 'color', 'foto'
        ]));

        return response()->json([
            'status'  => 'success',
            'mensaje' => 'Mascota actualizada exitosamente',
            'data'    => $mascota,
        ]);
    }

    /**
     * Eliminar una mascota.
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $mascota = Mascota::where('usuario_id', $request->user()->id)->findOrFail($id);
        $mascota->delete();

        return response()->json([
            'status'  => 'success',
            'mensaje' => 'Mascota eliminada exitosamente',
        ]);
    }
}
