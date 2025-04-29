<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovimientoExpediente extends Model
{
    use HasFactory;

    public $table = "movimiento_expedientes";

    public function getFechaMovimientoAttribute($value)
    {
        return Carbon::parse($value)->setTimezone(config('app.timezone'))->toDateTimeString();
    }
}
