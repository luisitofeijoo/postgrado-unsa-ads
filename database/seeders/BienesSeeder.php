<?php

namespace Database\Seeders;

use App\Models\Persona;
use App\Models\Bien;
use App\Models\Prestamo;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BienesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $archivo = public_path('laptop_5to.csv');

        if (file_exists($archivo)) {
            $datos = array_map('str_getcsv', file($archivo), array_fill(0, count(file($archivo)), ';'));

            /*foreach ($datos as $dato) {
                Bien::create([
                    'codigo_patrimonial' => strtoupper($dato[0]),
                    'nombre' => strtoupper($dato[1]),
                    'marca' => strtoupper($dato[2]),
                    'modelo' => strtoupper($dato[3]),
                    'serie' => strtoupper($dato[4]),
                    'estado' => $dato[5] === 'R'? 'REGULAR': 'MALO',
                    'observacion' => strtoupper($dato[6]),
                ]);
            }*/

            foreach ($datos as $dato) {
                $bien = Bien::create([
                    'codigo_patrimonial' => time(),
                    'nombre' => 'COMPUTADORA PERSONAL PORTATIL',
                    'marca' => strtoupper($dato[1]),
                    'serie' => strtoupper($dato[2]),
                    'disponible' => false,
                    'estado' => 'REGULAR',
                ]);

                $persona = Persona::where('nro_documento', $dato[0])->first();

                $prestamo = new Prestamo();
                $prestamo->persona_id = $persona->id;
                $prestamo->bien_id = $bien->id;
                $prestamo->fecha_prestamo = now();
                $prestamo->activo = true;
                $prestamo->motivo = 'USO PERSONAL ACADEMICO';
                $prestamo->save();
            }
        }
    }
}
