<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('documentos', function (Blueprint $table) {
            $table->foreignId('mascota_id')->constrained('mascotas')->onDelete('cascade');
            $table->foreignId('registro_clinico_id')->nullable()->constrained('registros_clinicos')->onDelete('set null');
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->string('nombre_original', 255);
            $table->string('nombre_archivo', 255);
            $table->string('ruta', 500);
            $table->string('tipo', 50)->default('pdf');
            $table->integer('tamaño')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documentos', function (Blueprint $table) {
            $table->dropForeign(['mascota_id']);
            $table->dropForeign(['registro_clinico_id']);
            $table->dropForeign(['usuario_id']);
            $table->dropColumn([
                'mascota_id',
                'registro_clinico_id',
                'usuario_id',
                'nombre_original',
                'nombre_archivo',
                'ruta',
                'tipo',
                'tamaño',
            ]);
        });
    }
};
