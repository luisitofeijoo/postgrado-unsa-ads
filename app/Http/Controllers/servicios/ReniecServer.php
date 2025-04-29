<?php

namespace App\Http\Controllers\servicios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ReniecServer extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke($dni)
    {
        $url = 'https://sistemas.devida.gob.pe/mesadepartesvirtual/reniec/consultadni/'.$dni;
        return Http::get($url)->json();
    }
}
