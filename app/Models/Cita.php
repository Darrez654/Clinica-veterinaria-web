<?php

namespace App\Models;

// ============================================================
// DEPENDENCIAS
// ============================================================
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// ============================================================
// MODELO: Cita
// ============================================================
// Tabla    : citas
// Relaciones: BelongsTo → Mascota
//             BelongsTo → Usuario (cliente)
//             BelongsTo → Usuario (veterinario)
// ============================================================
class Cita extends Model
{

    // ============================================================
    // TRAITS
    // ============================================================
    use HasFactory;

    // ============================================================
    // TABLA
    // ============================================================
    protected $table = 'citas';

    // ============================================================
    // ASIGNACIÓN MASIVA
    // ============================================================
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

    // ============================================================
    // RELACIONES
    // ============================================================

    // --- Cita → Mascota ---
    public function mascota(): BelongsTo
    {
        return $this->belongsTo(Mascota::class);
    }

    // --- Cita → Usuario (cliente dueño) ---
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }

    // --- Cita → Usuario (veterinario asignado) ---
    public function veterinario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'veterinario_id');
    }

}
