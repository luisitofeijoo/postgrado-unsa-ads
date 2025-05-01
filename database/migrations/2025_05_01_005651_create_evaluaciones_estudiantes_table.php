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
        Schema::create('evaluaciones_estudiantes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluacion_id')->constrained('evaluaciones')->onDelete('cascade');
            $table->foreignId('estudiante_id')->constrained('estudiantes')->onDelete('cascade');
            $table->timestamp('fecha_inicio')->nullable();
            $table->timestamp('fecha_fin')->nullable();
            $table->decimal('puntaje', 5, 2)->nullable()->comment('Puntaje obtenido por el estudiante'); // Using decimal for score
            $table->timestamps(); // For tracking creation/update of this record

            $table->unique(['evaluacion_id', 'estudiante_id'], 'evaluacion_estudiante_unique'); // Prevent a student from taking the same eval multiple times (adjust if multiple attempts are allowed)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluaciones_estudiantes');
    }
};
