<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $table = 'audit_logs';

    protected $fillable = [
        'usuario_id',
        'ip',
        'metodo',
        'ruta',
        'user_agent',
        'tipo',
        'severidad',
        'payload',
        'detalle',
    ];

    // ============================================================
    // RELACIONES
    // ============================================================
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    // ============================================================
    // SCOPES
    // ============================================================

    // Solo anomalías (severidad ALTA)
    public function scopeAnomalias($query)
    {
        return $query->where('severidad', 'ALTA');
    }

    // Solo logs normales
    public function scopeNormales($query)
    {
        return $query->where('severidad', 'BAJA');
    }

    // Por tipo de amenaza
    public function scopeTipo($query, string $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    // ============================================================
    // MÉTODOS ESTÁTICOS (helpers)
    // ============================================================

    // Registrar un log normal
    public static function registrar(array $data): self
    {
        return self::create([
            'usuario_id' => $data['usuario_id'] ?? null,
            'ip'         => $data['ip'] ?? request()->ip(),
            'metodo'     => $data['metodo'] ?? request()->method(),
            'ruta'       => $data['ruta'] ?? request()->fullUrl(),
            'user_agent' => $data['user_agent'] ?? request()->userAgent(),
            'tipo'       => $data['tipo'] ?? 'normal',
            'severidad'  => $data['severidad'] ?? 'BAJA',
            'payload'    => $data['payload'] ?? null,
            'detalle'    => $data['detalle'] ?? null,
        ]);
    }

    // Registrar una anomalía (SQLi, XSS, etc.)
    public static function anomalia(string $tipo, string $detalle, ?string $payload = null): self
    {
        return self::create([
            'usuario_id' => auth()->id(),
            'ip'         => request()->ip(),
            'metodo'     => request()->method(),
            'ruta'       => request()->fullUrl(),
            'user_agent' => request()->userAgent(),
            'tipo'       => $tipo,
            'severidad'  => 'ALTA',
            'payload'    => $payload,
            'detalle'    => $detalle,
        ]);
    }
}
