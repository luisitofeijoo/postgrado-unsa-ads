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
        Schema::create('evaluaciones', function (Blueprint $table) {
            $table->id();
            // Assuming curso_id links to a 'cursos' table. Make nullable or adjust if mandatory/different.
            $table->foreignId('curso_id')->nullable()->constrained('cursos')->onDelete('set null');
            $table->string('titulo');
            $table->text('descripcion')->nullable(); // Description can be optional?
            $table->integer('tiempo')->comment('Tiempo limite en minutos');
            $table->timestamps(); // Handles fecha_crecion and fecha_actualizacion
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluaciones');
    }
};
