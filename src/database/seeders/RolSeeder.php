<?php

namespace Database\Seeders;

use App\Models\Rol;
use Illuminate\Database\Seeder;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['nombre' => 'admin', 'descripcion' => 'Administrador del sistema'],
            ['nombre' => 'veterinario', 'descripcion' => 'Veterinario encargado de consultas'],
            ['nombre' => 'asistente', 'descripcion' => 'Asistente de veterinaria'],
            ['nombre' => 'cliente', 'descripcion' => 'Dueño de mascotas'],
        ];

        foreach ($roles as $rol) {
            Rol::create($rol);
        }
    }
}
