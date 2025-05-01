<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpcionRespuesta extends Model
{
    use HasFactory;

    protected $table = 'opciones_respuesta';

    protected $fillable = [
        'pregunta_id',
        'texto_opcion',
        'es_correcto', // This is a boolean
        // 'fecha_crecion', 'fecha_actualizacion' are handled by timestamps()
    ];

    protected $casts = [
        'es_correcto' => 'boolean', // Cast to boolean
    ];

    public function pregunta()
    {
        return $this->belongsTo(Pregunta::class);
    }
}
