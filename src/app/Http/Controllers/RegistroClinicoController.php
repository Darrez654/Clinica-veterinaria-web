<?php

namespace App\Http\Controllers;

use App\Models\RegistroClinico;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegistroClinicoController extends Controller
{
    /**
     * Listar registros clínicos de las mascotas del usuario.
     */
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

    /**
     * Mostrar un registro clínico específico.
     */
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
