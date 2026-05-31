<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cita extends Model
{
    /** @use HasFactory<\Database\Factories\CitaFactory> */
    use HasFactory;

    protected $table = 'citas';

    protected $fillable = [
        'mascota_id',
        'usuario_id',
        'veterinario_id',
        'fecha',
        'hora',
        'motivo',
        'estado',
        'notas',
    ];

    /**
     * Relación: La cita pertenece a una mascota.
     */
    public function mascota(): BelongsTo
    {
        return $this->belongsTo(Mascota::class);
    }

    /**
     * Relación: La cita pertenece a un usuario (cliente).
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }

    /**
     * Relación: La cita tiene un veterinario asignado.
     */
    public function veterinario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'veterinario_id');
    }
}
