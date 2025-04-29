<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expediente extends Model
{
    use HasFactory;

    protected $fillable = [
        'tipo_persona',
        'codigo',
        'nombre_razonsocial',
        'nro_documento',
        'nombre_razonsocial',
        'nro_expediente',
        'direccion',
        'celular',
        'email',
        'asunto',
        'descripcion',
        'url_drive',
        'folio',
        'archivo',
        'tipo_documento_id',
        'created_at'
    ];

    public function tipo_documento()
    {
        return $this->belongsTo(TipoDocumento::class, 'tipo_documento_id');
    }

    public function oficina()
    {
        return $this->belongsTo(Oficina::class, 'oficina_id');
    }

    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->setTimezone(config('app.timezone'))->toDateTimeString();
    }
}
