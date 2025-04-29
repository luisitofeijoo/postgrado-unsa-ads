<?php

namespace App\Http\Controllers\servicios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\BrowserKit\HttpBrowser;

class ApiReniecController extends Controller
{
    public function service($dni, $server)
    {
        $response = Http::post("https://mpv.mtc.gob.pe/Parametro/BuscarDNI", [
            'numeroDNI' => $dni,
        ]);

        $response_adicional = Http::get("https://apiperu.dev/api/dni/${dni}?api_token=cead8aaca89d237f5f2c0dc3c844b0df13146051e15fbb2fc883fcc79069290f");

        $objeto = json_decode($response);
        $objeto_adicional = json_decode($response_adicional);

        return $this->data(
            $objeto->Contenido->prenombres,
            $objeto->Contenido->apPrimer,
            $objeto->Contenido->apSegundo,
            $this->convertToBase64($objeto->Contenido->DatosAdicionales->foto),
            $objeto->Contenido->direccion,
            $objeto->Contenido->DatosAdicionales->ubigeo,
            $objeto_adicional->data->fecha_nacimiento,
            $objeto_adicional->data->sexo,
        );
    }

    public function data($nombres, $paterno, $materno, $foto, $direccion, $lugar_domicilio, $fecha_nacimiento, $sexo): array
    {
        return [
            'nombres' => $nombres,
            'apellido_paterno' => $paterno,
            'apellido_materno' => $materno,
            'avatar' => $foto,
            'direccion' => $direccion,
            'lugar_domicilio' => $lugar_domicilio,
            'fecha_nacimiento' => $fecha_nacimiento,
            'sexo' => $sexo,
        ];
    }

    public function convertToBase64($data)
    {
        return 'data:image/jpeg;base64,' . base64_encode(implode(array_map('chr', $data)));
    }
}
