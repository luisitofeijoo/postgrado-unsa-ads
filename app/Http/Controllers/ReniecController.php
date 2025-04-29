<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\BrowserKit\HttpBrowser;

class ReniecController extends Controller
{
    private $posiblesClaves = [
        "dni" => ["dni", "NroDocumento", "numero_documento"],
        "nombres" => ["nombre", "nombres", "Nombres", "prenombres"],
        "apellido_paterno" => ["apellidoPaterno", "paterno", "ApellidoPaterno", "apPrimer", "apellido_paterno", "apeMaterno"],
        "apellido_materno" => ["apellidoMaterno", "materno", "ApellidoMaterno", "apSegundo", "apellido_materno", "apePaterno"],
        "fecha_nacimiento" => ["fecha_nacimiento", "fechaNacimiento"],
        "direccion" => ["direccion", "Direccion"],
        "domicilio_ubigeo" => ["ubigeo"],
        "sexo" => ["sexo_text", "genero"],
        "estado_civil" => ["estadoCivil"],
        "restriccion" => ["restricccion", "restriccion"],
        "ubigeo" => ["ubigeo"],
       // "codigo_ubigeo" => ["Ubigeo", "id_distrito"],
        "fecha_emision" => ["fecha_emision"],
        "foto" => ["foto"]
    ];

    public function show($dni)
    {
        /*$client = new HttpBrowser();
        $crawler = $client->request('GET', 'http://app1.dirislimacentro.gob.pe/std/mod_ext/?url=registrar_usuario');
        $cookieJar = $client->getCookieJar();
        $cookie = $cookieJar->get('PHPSESSID')->getValue();
        $token = $crawler->filter('[name=token]')->first()->attr("content");

        $result = Http::withHeaders([
            "Accept-Encoding" => "gzip, deflate",
            "Accept-Language" => "es-ES,es;q=0.9",
            "Connection" => "keep-alive",
            "Host" => 'app1.dirislimacentro.gob.pe',
            "Referer" => 'http://app1.dirislimacentro.gob.pe/std/mod_ext/?url=registrar_usuario',
            'Token' => "$token",
            'Cookie' => 'PHPSESSID=' . $cookie,
            'X-Requested-With' => 'XMLHttpRequest',
        ])
            ->get('http://app1.dirislimacentro.gob.pe/std/controller/ctrlMain.php?action=load_dni_new&nro_doc=' . $dni);
        return $result;*/

         $url = 'https://sistemas.devida.gob.pe/mesadepartesvirtual/reniec/consultadni/'.$dni;
         return Http::get($url)->json();
    }

    public function test($dni)
    {
       // $json = '{"error":"","poblacion":[],"row":{"nombres":"GLEN BRYAN","apellido_paterno":"MADRIGAL","apellido_materno":"P\u00c9REZ","domicilio_direccion_actual":"CARABAYA","domicilio_direccion":"SIN DATOS","fecha_nacimiento":"1993-09-19","sexo":"1","id_departamento":"20","id_provincia":"2003","id_distrito":"200308","foto":"","fecha_emision":"28\/09\/2023","nacimiento_departamento":"PUNO","nacimiento_provincia":"CARABAYA","nacimiento_distrito":"OLLACHEA","get_departamento_domicilio_nombre":"PUNO","get_provincia_domicilio_nombre":"SAN ROMAN","get_distrito_domicilio_nombre":"JULIACA","numero_documento":"70757713","sexo_text":"HOMBRE"}}';
         /*$response = Http::withoutVerifying()->post('https://pide.regionlima.gob.pe/reniec/consultaDni', [
                 'numero_dni' => $dni,
                 'code' => '10024',
             ]);*/

         //return $result = $response->json();
   /*    $data = Http::get("http://app1.dirislimacentro.gob.pe/std/controller/ctrlMain.php?action=load_dni_new&nro_doc=${dni}");

        $response = json_decode($data, true);*/
       // return $response->row;
       // return $json["row"];
       // $response = Http::get("https://app.minam.gob.pe/restceropapel/usuario/validacion/reniec/${dni}");
        //$response = Http::get("https://sistemas.oefa.gob.pe/mpv-backend/persona/N/${dni}");
        //$response = Http::post("http://appweb.ipd.gob.pe/sisweb/mesadepartes/web/buscar-numero/${dni}");
      //  return $response->json();

        $url = 'https://sicontigo.contigo.gob.pe/Home/ConsultaPersona?dni='.$dni;
        return $this->jsonTemplatePersona(Http::get($url)->json());
    }

    public function showing()
    {


//        $imageData = json_decode($cadena); // Decodificar el JSON a una matriz de bytes
//
//        $imageBytes = implode(array_map('chr', $imageData)); // Convertir la matriz de bytes a una cadena de caracteres
//        $image = base64_encode($imageBytes);
//
//        return $image;

        /*$client = Http::asForm()->post("http://app20.susalud.gob.pe:8080/registro-renipress-webapp/login.htm?action=buscarPersona", [
            'txt_numeroDocumentoIdentidad' => 70511999,
            'dat_fechaNacimiento' => '13/02/1994',
            'cmb_sexo' => 1,
            'cmb_tipoDocumentoIdentidad' => 1,
        ]);
        return $client->json();*/
    }

    public function jsonTemplatePersona($json)
    {
        foreach ($this->posiblesClaves as $atributo => $posibleCampoNombre) {
            $datafinal[$atributo] = $this->unifyFields($json, $posibleCampoNombre);
        }
        return $datafinal;
    }

    public function unifyFields($data, $possibleFieldNames)
    {
        foreach ($possibleFieldNames as $key) {
            if (isset($data[$key])) {
                return $data[$key];
            }
        }
        return null; // Retornar null si no se encuentra ningún campo

    }
}
