<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluacion extends Model
{
    use HasFactory;
    protected $table = 'evaluaciones'; // Make sure table name is correct
    protected $fillable = [
        'curso_id', // You might need to handle curso_id creation/assignment
        'titulo',
        'descripcion',
        'tiempo', // Store in minutes, as per frontend
        // 'fecha_crecion', 'fecha_actualizacion' are handled by timestamps()
    ];

    public function preguntas()
    {
        return $this->hasMany(Pregunta::class);
    }
    public function respuestasEstudiantes() { return $this->hasMany(RespuestaEstudiante::class); }
}
