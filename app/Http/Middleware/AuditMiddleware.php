<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuditMiddleware
{
    // ============================================================
    // RUTAS QUE NO SE AUDITAN (para evitar bucles)
    // ============================================================
    private array $excluir = [
        'audit-logs*',
        'telescope*',
        '_debugbar*',
        'livewire*',
    ];

    // ============================================================
    // HANDLE
    // ============================================================
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // --- No auditar si está en la lista de exclusión ---
        foreach ($this->excluir as $patron) {
            if ($request->is($patron)) {
                return $response;
            }
        }

        // --- Registrar en segundo plano (no bloqueante) ---
        try {
            $this->registrarVisita($request);
        } catch (\Throwable $e) {
            // No interrumpir la app si falla el log
            report($e);
        }

        return $response;
    }

    // ============================================================
    // REGISTRAR VISITA
    // ============================================================
    private function registrarVisita(Request $request): void
    {
        // Solo registrar rutas que nos interesen (web y api)
        if ($request->is('_debugbar*', 'telescope*', 'livewire*')) {
            return;
        }

        AuditLog::registrar([
            'usuario_id' => auth()->id(),
            'ip'         => $request->ip(),
            'metodo'     => $request->method(),
            'ruta'       => $request->fullUrl(),
            'user_agent' => $request->userAgent(),
            'tipo'       => 'normal',
            'severidad'  => 'BAJA',
        ]);
    }
}
