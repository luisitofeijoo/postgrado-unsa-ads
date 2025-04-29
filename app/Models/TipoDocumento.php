<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoDocumento extends Model
{
    use HasFactory;

    public function expedientes()
    {
        return $this->hasMany(Expediente::class, 'tipo_documento_id');
    }
}
