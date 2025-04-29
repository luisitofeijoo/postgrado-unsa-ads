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
        Schema::create('bienes', function (Blueprint $table) {
            $table->id();
            $table->char('codigo_patrimonial')->nullable();
            $table->char('codigo_interno')->nullable();
            $table->string('nombre');
            $table->boolean('disponible')->default(true);
            $table->string('marca')->nullable();
            $table->string('modelo')->nullable();
            $table->string("color")->nullable();
            $table->string('serie')->nullable();
            $table->string('pecosa')->nullable();
            $table->text('observacion')->nullable();
            $table->string('detalle')->nullable();
            $table->string('comentario')->nullable();
            $table->enum('situacion', ['U', 'D'])->default('D');
            $table->enum('estado', ['BUENO', 'REGULAR', 'MALO', 'RAEE', 'CHATARRA'])->nullable();
            $table->enum('propiedad', ['INSTITUCION', 'PERSONAL'])->default('INSTITUCION');
            $table->unsignedBigInteger('ubicacion_id')->nullable();
            $table->unsignedBigInteger('grupo_id')->nullable();
            $table->foreign('ubicacion_id')->references('id')->on('ubicaciones');
            $table->foreign('grupo_id')->references('id')->on('grupos');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
