<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pregunta extends Model
{
    use HasFactory;

    protected $fillable = [
        'evaluacion_id',
        'tipo_pregunta_id',
        'enunciado',
        'puntaje',
        // 'fecha_crecion', 'fecha_actualizacion' are handled by timestamps()
    ];

    public function evaluacion()
    {
        return $this->belongsTo(Evaluacion::class);
    }

    public function tipoPregunta()
    {
        return $this->belongsTo(TipoPregunta::class);
    }

    public function opciones()
    {
        return $this->hasMany(OpcionRespuesta::class);
    }
}
