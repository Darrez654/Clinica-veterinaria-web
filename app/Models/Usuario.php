<?php

namespace App\Models;

// ============================================================
// DEPENDENCIAS
// ============================================================
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

// ============================================================
// MODELO: Usuario
// ============================================================
// Tabla  : usuarios
// Autenticación con Sanctum (tokens)
// Relaciones: BelongsTo → Rol
// ============================================================
class Usuario extends Authenticatable
{
    // ============================================================
    // TRAITS
    // ============================================================
    use HasFactory, HasApiTokens, Notifiable, CanResetPassword;

    // ============================================================
    // TABLA
    // ============================================================
    protected $table = 'usuarios';

    // ============================================================
    // ASIGNACIÓN MASIVA (fillable)
    // ============================================================
    protected $fillable = [
        'nombre',
        'email',
        'password',
        'telefono',
        'direccion',
        'rol_id',
    ];

    // ============================================================
    // OCULTAR EN JSON
    // ============================================================
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // ============================================================
    // CASTS (conversión automática de tipos)
    // ============================================================
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // ============================================================
    // RELACIONES
    // ============================================================

    // --- Usuario → Rol ---
    // Un usuario pertenece a un rol (admin, veterinario, etc.)
    public function rol(): BelongsTo
    {
        return $this->belongsTo(Rol::class);
    }

}
