<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// ============================================================
// MODELO: Notificacion
// ============================================================
// Tabla    : notificaciones
// Relaciones: BelongsTo → Usuario (destinatario)
// ============================================================
class Notificacion extends Model
{
    use HasFactory;

    protected $table = 'notificaciones';

    protected $fillable = [
        'usuario_id',
        'tipo',
        'titulo',
        'mensaje',
        'url',
        'leido',
    ];

    protected $casts = [
        'leido' => 'boolean',
    ];

    // ============================================================
    // RELACIONES
    // ============================================================

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }

    // ============================================================
    // HELPERS
    // ============================================================

    public static function noLeidas(int $usuarioId): int
    {
        return self::where('usuario_id', $usuarioId)
            ->where('leido', false)
            ->count();
    }

    public static function crear(
        int $usuarioId,
        string $tipo,
        string $titulo,
        ?string $mensaje = null,
        ?string $url = null
    ): self {
        return self::create([
            'usuario_id' => $usuarioId,
            'tipo'       => $tipo,
            'titulo'     => $titulo,
            'mensaje'    => $mensaje,
            'url'        => $url,
            'leido'      => false,
        ]);
    }
}
