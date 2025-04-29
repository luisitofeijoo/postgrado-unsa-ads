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
        Schema::create('postulantes', function (Blueprint $table) {
                $table->id();
                $table->char('dni', 20)->unique();
                $table->string('nombres',500)->nullable();
                $table->string('apellidos',500)->nullable();
                $table->char('aula')->nullable();
                $table->char('piso')->nullable();
                $table->char('pabellon')->nullable();
                $table->string('ubigeo_detalle')->nullable();
                $table->foreignId('programacion_id')->constrained();
                $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('postulantes');
    }
};
