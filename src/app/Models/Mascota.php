<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mascota extends Model
{
    /** @use HasFactory<\Database\Factories\MascotaFactory> */
    use HasFactory;

    protected $table = 'mascotas';

    protected $fillable = [
        'nombre',
        'especie',
        'raza',
        'edad',
        'peso',
        'color',
        'foto',
        'usuario_id',
    ];

    /**
     * Relación: La mascota pertenece a un usuario (dueño).
     */
    public function dueno(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    /**
     * Relación: La mascota tiene muchos registros clínicos.
     */
    public function registrosClinicos(): HasMany
    {
        return $this->hasMany(RegistroClinico::class);
    }

    /**
     * Relación: La mascota tiene muchas citas.
     */
    public function citas(): HasMany
    {
        return $this->hasMany(Cita::class);
    }
}
