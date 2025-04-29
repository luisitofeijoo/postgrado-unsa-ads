<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Bien;

class MovimientoBien extends Model
{
    use HasFactory;
    protected $table = 'movimiento_bienes'; // Especifica el nombre de la tabla si es diferente al nombre del modelo


    public function bien()
    {
        return $this->belongsTo(Bien::class);
    }

    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }
}
