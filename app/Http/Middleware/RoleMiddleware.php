<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->rol->nombre, $roles)) {
            return response()->json([
                'status'  => 'error',
                'mensaje' => 'No tienes permisos para acceder a esta ruta.',
            ], 403);
        }

        return $next($request);
    }
}
