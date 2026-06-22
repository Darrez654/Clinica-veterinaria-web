<?php

namespace Database\Seeders;

// ============================================================
// DEPENDENCIAS
// ============================================================
use App\Models\Rol;
use Illuminate\Database\Seeder;

// ============================================================
// SEEDER: Roles
// ============================================================
// Crea los 4 roles del sistema:
// admin | veterinario | asistente | cliente
// ============================================================
class RolSeeder extends Seeder
{

    public function run(): void
    {
        $roles = [
            ['nombre' => 'admin',        'descripcion' => 'Administrador del sistema'],
            ['nombre' => 'veterinario',  'descripcion' => 'Veterinario encargado de consultas'],
            ['nombre' => 'asistente',    'descripcion' => 'Asistente de veterinaria'],
            ['nombre' => 'cliente',      'descripcion' => 'Dueño de mascotas'],
        ];

        foreach ($roles as $rol) {
            Rol::create($rol);
        }
    }

}
