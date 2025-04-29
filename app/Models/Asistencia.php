<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Asistencia extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['postulante_id', 'user_id' ,'fecha_asistencia', 'dj'];
    protected $dates = ['deleted_at'];

    public function postulante()
    {
        return $this->belongsTo(Postulante::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Getter para modificar el valor antes de devolverlo
    public function getFechaAsistenciaAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('d/m/Y H:i:s');
    }
    public function getDeletedAtAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('d/m/Y H:i:s');
    }
}
