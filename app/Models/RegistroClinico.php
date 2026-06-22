<?php

namespace App\Models;

// ============================================================
// DEPENDENCIAS
// ============================================================
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// ============================================================
// MODELO: RegistroClinico
// ============================================================
// Tabla    : registros_clinicos
// Relaciones: BelongsTo → Mascota
//             BelongsTo → Usuario (veterinario)
// ============================================================
class RegistroClinico extends Model
{

    // ============================================================
    // TRAITS
    // ============================================================
    use HasFactory;

    // ============================================================
    // TABLA
    // ============================================================
    protected $table = 'registros_clinicos';

    // ============================================================
    // ASIGNACIÓN MASIVA
    // ============================================================
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

    // ============================================================
    // RELACIONES
    // ============================================================

    // --- Registro → Mascota ---
    public function mascota(): BelongsTo
    {
        return $this->belongsTo(Mascota::class);
    }

    // --- Registro → Veterinario ---
    public function veterinario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'veterinario_id');
    }

}
