<?php

namespace App\Models;

// ============================================================
// DEPENDENCIAS
// ============================================================
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

// ============================================================
// MODELO: Mascota
// ============================================================
// Tabla    : mascotas
// Relaciones: BelongsTo → Usuario (dueño)
//             HasMany   → RegistroClinico
//             HasMany   → Cita
// ============================================================
class Mascota extends Model
{

    // ============================================================
    // TRAITS
    // ============================================================
    use HasFactory;

    // ============================================================
    // TABLA
    // ============================================================
    protected $table = 'mascotas';

    // ============================================================
    // ASIGNACIÓN MASIVA
    // ============================================================
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

    // ============================================================
    // RELACIONES
    // ============================================================

    // --- Mascota → Usuario (dueño) ---
    public function dueno(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    // --- Mascota → Registros Clínicos ---
    public function registrosClinicos(): HasMany
    {
        return $this->hasMany(RegistroClinico::class);
    }

    // --- Mascota → Citas ---
    public function citas(): HasMany
    {
        return $this->hasMany(Cita::class);
    }

}
