<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AnomaliaMiddleware
{
    // ============================================================
    // PATRONES DE ATAQUE (SQLi y XSS)
    // ============================================================
    private array $patronesSQLi = [
        '/\b(\'\s*OR\s*[\d\s]*=)/i',          // ' OR 1=1
        '/\b(\'\s*OR\s*\'[\d\s]*\'\s*=\s*\')/i', // ' OR '1'='1
        '/\b(\'\s*OR\s*[\w]+\s*--)/i',         // ' OR 1 --
        '/\b(\'\s*OR\s*[\w]+\s*#)/i',          // ' OR 1 #
        '/\b(\bUNION\b.*\bSELECT\b)/i',         // UNION SELECT
        '/\b(\bDROP\b\s+\bTABLE\b)/i',           // DROP TABLE
        '/\b(\bDELETE\b\s+\bFROM\b)/i',          // DELETE FROM
        '/\b(\bALTER\b\s+\bTABLE\b)/i',          // ALTER TABLE
        '/\b(\bSELECT\b.*\bFROM\b.*\bWHERE\b)/i', // SELECT ... FROM ... WHERE
        '/\b(\bINTO\s+\bOUTFILE\b)/i',          // INTO OUTFILE
        '/\b(\bLOAD_FILE\s*\()/i',               // LOAD_FILE(
        '/\b(\'\s*;\s*\bDROP\b)/i',              // '; DROP
        '/\b(\b1\s*=\s*1\b)/i',                  // 1=1 (suena a bypass)
        '/\b(\badmin\'\s*--)/i',                  // admin' --
    ];

    private array $patronesXSS = [
        '/<script[^>]*>/i',                        // <script>
        '/<\/script>/i',                           // </script>
        '/javascript\s*:/i',                       // javascript:
        '/onload\s*=/i',                           // onload=
        '/onerror\s*=/i',                          // onerror=
        '/onclick\s*=/i',                          // onclick=
        '/onmouseover\s*=/i',                      // onmouseover=
        '/onfocus\s*=/i',                          // onfocus=
        '/alert\s*\([^)]*\)/i',                  // alert(...)
        '/<iframe[^>]*>/i',                        // <iframe>
        '/document\.cookie/i',                     // document.cookie
        '/<img[^>]*onerror[^>]*>/i',               // <img onerror>
        '/<svg[^>]*onload[^>]*>/i',                // <svg onload>
        '/\beval\s*\(/i',                        // eval(
        '/\bfromcharcode\b/i',                    // fromCharCode
    ];

    // ============================================================
    // HANDLE
    // ============================================================
    public function handle(Request $request, Closure $next): Response
    {
        // Solo analizar peticiones con datos (POST, PUT, DELETE, PATCH)
        if ($request->isMethod('GET') || $request->isMethod('HEAD')) {
            return $next($request);
        }

        // --- Analizar todos los datos entrantes ---
        $datos = $this->recogerDatos($request);

        foreach ($datos as $campo => $valor) {
            if (!is_string($valor)) {
                continue;
            }

            // --- Detectar SQLi ---
            $resultadoSQLi = $this->detectarSQLi($valor);
            if ($resultadoSQLi) {
                AuditLog::anomalia(
                    'sqli',
                    "Posible inyección SQL en el campo '{$campo}': {$resultadoSQLi}",
                    "Campo: {$campo} | Valor: {$valor}"
                );

                // Bloquear la petición (seguridad máxima)
                return response()->json([
                    'status'  => 'error',
                    'mensaje' => 'Petición bloqueada por seguridad (SQLi detectado).',
                ], 403);
            }

            // --- Detectar XSS ---
            $resultadoXSS = $this->detectarXSS($valor);
            if ($resultadoXSS) {
                AuditLog::anomalia(
                    'xss',
                    "Posible XSS en el campo '{$campo}': {$resultadoXSS}",
                    "Campo: {$campo} | Valor: {$valor}"
                );

                return response()->json([
                    'status'  => 'error',
                    'mensaje' => 'Petición bloqueada por seguridad (XSS detectado).',
                ], 403);
            }
        }

        return $next($request);
    }

    // ============================================================
    // RECOLECTAR DATOS ENTRANTES
    // ============================================================
    private function recogerDatos(Request $request): array
    {
        $datos = [];

        // Body de la petición
        foreach ($request->all() as $key => $value) {
            $datos['body_' . $key] = $value;
        }

        // Query string (URL parameters)
        foreach ($request->query() as $key => $value) {
            $datos['query_' . $key] = $value;
        }

        return $datos;
    }

    // ============================================================
    // DETECTORES
    // ============================================================
    private function detectarSQLi(string $valor): ?string
    {
        foreach ($this->patronesSQLi as $patron) {
            if (preg_match($patron, $valor)) {
                return "Patrón SQLi activado: {$patron}";
            }
        }
        return null;
    }

    private function detectarXSS(string $valor): ?string
    {
        foreach ($this->patronesXSS as $patron) {
            if (preg_match($patron, $valor)) {
                return "Patrón XSS activado: {$patron}";
            }
        }
        return null;
    }
}
