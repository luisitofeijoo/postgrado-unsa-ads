<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoPregunta extends Model
{
    use HasFactory;

    protected $table = 'tipo_preguntas'; // Make sure table name is correct

    protected $fillable = [
        'nombre_tipo',
    ];
}
