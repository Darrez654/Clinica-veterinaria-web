<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CitaController extends Controller
{
    /**
     * Listar citas del usuario autenticado.
     */
    public function index(Request $request): JsonResponse
    {
        $citas = Cita::where('usuario_id', $request->user()->id)
            ->with(['mascota', 'veterinario'])
            ->orderBy('fecha', 'desc')
            ->orderBy('hora', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $citas,
        ]);
    }

    /**
     * Agendar una nueva cita.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'mascota_id' => 'required|exists:mascotas,id',
            'fecha'      => 'required|date|after_or_equal:today',
            'hora'       => 'required|date_format:H:i',
            'motivo'     => 'required|string|max:255',
            'notas'      => 'nullable|string',
        ]);

        $cita = Cita::create([
            'mascota_id'  => $request->mascota_id,
            'usuario_id'  => $request->user()->id,
            'fecha'       => $request->fecha,
            'hora'        => $request->hora,
            'motivo'      => $request->motivo,
            'notas'       => $request->notas,
            'estado'      => 'programada',
        ]);

        return response()->json([
            'status'  => 'success',
            'mensaje' => 'Cita agendada exitosamente',
            'data'    => $cita->load(['mascota', 'veterinario']),
        ], 201);
    }

    /**
     * Cancelar una cita.
     */
    public function cancelar(Request $request, $id): JsonResponse
    {
        $cita = Cita::where('usuario_id', $request->user()->id)->findOrFail($id);

        if ($cita->estado !== 'programada') {
            return response()->json([
                'status'  => 'error',
                'mensaje' => 'Solo se pueden cancelar citas programadas',
            ], 400);
        }

        $cita->update(['estado' => 'cancelada']);

        return response()->json([
            'status'  => 'success',
            'mensaje' => 'Cita cancelada exitosamente',
            'data'    => $cita,
        ]);
    }
}
