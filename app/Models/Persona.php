<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    use HasFactory;

    protected $hidden = [
        'huella',
    ];
    public function estudiantes() {
        return $this->hasMany(Estudiante::class);
    }

    public function estudiante() {
        return $this->hasOne(Estudiante::class);
    }

    public function movimientos()
    {
        return $this->hasMany(MovimientoBien::class, 'persona_id');
    }
    public function getAvatarAttribute($value) {
        return empty($value) ?  asset('/img/personas/default.jpg') : asset('/img/personas/'.$value);
    }
}
