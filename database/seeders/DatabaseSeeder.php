<?php

namespace Database\Seeders;

// ============================================================
// DEPENDENCIAS
// ============================================================
use Illuminate\Database\Seeder;

// ============================================================
// SEEDER PRINCIPAL
// ============================================================
// Aquí se registran todos los seeders que se ejecutan con:
// php artisan db:seed
// ============================================================
class DatabaseSeeder extends Seeder
{

    public function run(): void
    {
        $this->call([
            RolSeeder::class,
        ]);
    }

}
