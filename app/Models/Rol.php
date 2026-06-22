<?php

namespace App\Models;

// ============================================================
// DEPENDENCIAS
// ============================================================
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

// ============================================================
// MODELO: Rol
// ============================================================
// Tabla    : roles
// Relaciones: HasMany → Usuario
// Valores  : admin | veterinario | asistente | cliente
// ============================================================
class Rol extends Model
{

    // ============================================================
    // TRAITS
    // ============================================================
    use HasFactory;

    // ============================================================
    // TABLA
    // ============================================================
    protected $table = 'roles';

    // ============================================================
    // ASIGNACIÓN MASIVA
    // ============================================================
    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    // ============================================================
    // RELACIONES
    // ============================================================

    // --- Rol → Usuarios ---
    public function usuarios(): HasMany
    {
        return $this->hasMany(Usuario::class);
    }

}
