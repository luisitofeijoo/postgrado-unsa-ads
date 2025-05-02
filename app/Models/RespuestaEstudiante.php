<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RespuestaEstudiante extends Model
{
    use HasFactory;

    // Specify the table name if it's different from the plural of the model name (which it is in your schema)
    protected $table = 'respuestas_estudiantes';

    // Specify which attributes are mass assignable
    protected $fillable = [
        'evaluacion_estudiantes_id',
        'pregunta_id',
        'opcion_respuesta_id', // This should be fillable even though it's nullable
        'texto_respuesta',   // This should be fillable even though it's nullable
        'fecha_respuesta',
    ];

    // Cast attributes to native types
    protected $casts = [
        'fecha_respuesta' => 'datetime',
        // No need to cast option_respuesta_id or texto_respuesta, as their type is handled by nullable/null
    ];

    // Define the relationships

    /**
     * Get the evaluation attempt that this response belongs to.
     */
//    public function evaluacionEstudiante()
//    {
//        return $this->belongsTo(Evaluacion::class, 'evaluacion_estudiantes_id');
//    }

    /**
     * Get the question that this response is for.
     */
    public function pregunta()
    {
        return $this->belongsTo(Pregunta::class);
    }

    /**
     * Get the option that was selected for this response (if applicable).
     * This relationship will be null for text-based answers.
     */
    public function opcionRespuesta()
    {
        return $this->belongsTo(OpcionRespuesta::class, 'opcion_respuesta_id');
    }
}
