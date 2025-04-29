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
        Schema::create('registro_comidas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('persona_id');
            $table->unsignedBigInteger('tipo_comida_id');
            $table->date('fecha');
            $table->timestamp('hora_registro')->nullable();
            $table->unique(['persona_id', 'tipo_comida_id', 'fecha']);
            $table->foreign('persona_id')->references('id')->on('personas')->onDelete('cascade');
            $table->foreign('tipo_comida_id')->references('id')->on('tipo_comidas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registro_comidas');
    }
};
