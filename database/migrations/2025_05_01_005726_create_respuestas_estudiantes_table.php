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
        Schema::create('respuestas_estudiantes', function (Blueprint $table) {
            $table->id();
            // Link to the specific instance of a student taking an evaluation
            $table->foreignId('evaluacion_estudiantes_id')->constrained('evaluaciones_estudiantes')->onDelete('cascade');
            $table->foreignId('pregunta_id')->constrained('preguntas')->onDelete('cascade');
            // opcion_respuesta_id is nullable because 'texto' type questions won't have a selected option ID
            $table->foreignId('opcion_respuesta_id')->nullable()->constrained('opciones_respuesta')->onDelete('set null');
            $table->timestamp('fecha_respuesta')->useCurrent(); // Capture the timestamp when the answer is recorded

            // Optionally, add a column for text answers for 'texto' type questions
            $table->text('texto_respuesta')->nullable();

            $table->timestamps(); // For tracking creation/update of this record

            // Add a unique constraint to ensure a student answers a specific question only once per evaluation attempt
            $table->unique(['evaluacion_estudiantes_id', 'pregunta_id'], 'respuesta_unica_por_pregunta_intento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('respuestas_estudiantes');Schema::dropIfExists('respuestas_estudiantes');
    }
};
