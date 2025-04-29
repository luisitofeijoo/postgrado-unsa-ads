<?php

namespace App\Http\Controllers\servicios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SunatServer extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke($ruc)
    {
            $url = 'https://sistemas.devida.gob.pe/mesadepartesvirtual/sunat/consultaruc/'.$ruc;
            return Http::get($url)->json();

    }
}
