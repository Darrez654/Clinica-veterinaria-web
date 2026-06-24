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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // --- DATOS DE SESIÓN ---
            $table->unsignedBigInteger('usuario_id')->nullable();
            $table->string('ip', 45)->nullable();
            $table->string('metodo', 10);           // GET, POST, PUT, DELETE
            $table->string('ruta', 500);             // URL visitada
            $table->text('user_agent')->nullable();   // Navegador / cliente

            // --- DETECCIÓN DE ANOMALÍAS ---
            $table->string('tipo', 50)->default('normal');  // normal | sqli | xss | sospechoso
            $table->enum('severidad', ['BAJA', 'MEDIA', 'ALTA'])->default('BAJA');
            $table->text('payload')->nullable();            // Datos que activaron la alerta
            $table->text('detalle')->nullable();            // Descripción del evento

            $table->timestamps();

            // --- ÍNDICES ---
            $table->index('usuario_id');
            $table->index('severidad');
            $table->index('tipo');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
