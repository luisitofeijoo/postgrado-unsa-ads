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
        Schema::create('movimiento_bienes', function (Blueprint $table) {
            $table->id();
            $table->dateTime('fecha_movimiento');
            $table->enum('tipo_movimiento', ['salida', 'ingreso']);
            $table->foreignId('bien_id')->constrained('bienes');
            $table->foreignId('persona_id')->nullable()->constrained('personas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movimiento_bienes');
    }
};
