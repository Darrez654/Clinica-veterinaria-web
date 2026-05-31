<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegistroClinico extends Model
{
    /** @use HasFactory<\Database\Factories\RegistroClinicoFactory> */
    use HasFactory;

    protected $table = 'registros_clinicos';

    protected $fillable = [
        'mascota_id',
        'veterinario_id',
        'fecha',
        'tipo',
        'descripcion',
        'diagnostico',
        'tratamiento',
        'observaciones',
    ];

    /**
     * Relación: El registro pertenece a una mascota.
     */
    public function mascota(): BelongsTo
    {
        return $this->belongsTo(Mascota::class);
    }

    /**
     * Relación: El registro fue hecho por un veterinario.
     */
    public function veterinario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'veterinario_id');
    }
}
