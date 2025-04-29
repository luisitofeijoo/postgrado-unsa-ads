<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroComida extends Model
{
    use HasFactory;
    public $table = 'registro_comidas';
    protected $guarded = [];
    public $timestamps = false;

    public function getFechaAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('d/m/Y');
    }
}
