<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Grupo;
use App\Models\Oficina;
use App\Models\Persona;
use App\Models\Programacion;
use App\Models\TipoComida;
use App\Models\TipoPersona;
use App\Models\TipoPregunta;
use App\Models\Ubicacion;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'nombres' => 'Admin',
            'apellidos' => 'General',
            'email' => 'admin@gmail.com',
            'username' => 'admin',
            'password' => Hash::make('admin@2025'),
        ]);



        Ubicacion::create(['nombre' => 'TERCER GRADO A']);
        Ubicacion::create(['nombre' => 'TERCER GRADO B']);
        Ubicacion::create(['nombre' => 'TERCER GRADO C']);
        Ubicacion::create(['nombre' => 'TERCER GRADO D']);
        Ubicacion::create(['nombre' => 'CUARTO GRADO A']);
        Ubicacion::create(['nombre' => 'CUARTO GRADO B']);
        Ubicacion::create(['nombre' => 'CUARTO GRADO C']);
        Ubicacion::create(['nombre' => 'CUARTO GRADO D']);
        Ubicacion::create(['nombre' => 'QUINTO GRADO A']);
        Ubicacion::create(['nombre' => 'QUINTO GRADO B']);
        Ubicacion::create(['nombre' => 'QUINTO GRADO C']);
        Ubicacion::create(['nombre' => 'QUINTO GRADO D']);
        Ubicacion::create(['nombre' => 'CENTRO DE COMUNICACIONES']);
        Ubicacion::create(['nombre' => 'DIRECCIÓN GENERAL']);
        Ubicacion::create(['nombre' => 'DIRECCIÓN ACADÉMICA']);
        Ubicacion::create(['nombre' => 'BIBLIOTECA']);
        Ubicacion::create(['nombre' => 'LABORATORIO FISICA']);
        Ubicacion::create(['nombre' => 'LABORATORIO QUIMICA']);
        Ubicacion::create(['nombre' => 'EDUCACIÓN FISICA']);
        Ubicacion::create(['nombre' => 'BYDE']);

        Oficina::create(['descripcion' => 'SECRETARIA']);
        Oficina::create(['descripcion' => 'DIREECION GENERAL']);
        Oficina::create(['descripcion' => 'SUBDIRECCIONA ACADEMICA']);
        Oficina::create(['descripcion' => 'SUBDIRECCION BYDE']);

        Grupo::insert([
            ['descripcion' => 'COMPUTADORA PERSONAL PORTÁTIL'],
            ['descripcion' => 'AURICULARES'],
            ['descripcion' => 'USB'],
            ['descripcion' => 'CALCULADORAS']
        ]);



        $this->call([
            PermissionsSeeder::class,
            TipoDocumentoSeeder::class,
            //TipoPersona::class,
            PersonaSeeder::class,
            BienesSeeder::class,
        ]);
        // \App\Models\User::factory(10)->create();

        $sedes = [
            'IE LIBERTADOR CASTILLA',
            'IE FRANCISCO GARCIA CALDERÓN',
            'IE ALMIRANTE MIGUEL GRAU',
            'UNIVERSIDAD CATÓLICA SAN PABLO'
        ];

        foreach ($sedes as $sede) {
            Programacion::firstOrCreate([
                'turno' => 'MAÑANA',
                'fecha' => now(),
                'estado' => 'UNIVERSIDAD CATÓLICA SAN PABLO' === $sede ? 1: 0,
                'sede' => $sede
            ]);
        }

        $FILE = public_path('pua2025.csv');
        if (file_exists($FILE)) {
            $datos = array_map(function ($linea) {
                return str_getcsv($linea, ';');
            }, file($FILE));

            foreach ($datos as $dato) {
                $programacion = Programacion::where('sede', 'LIKE', '%' . $dato[7] . '%')->first();

                if ($programacion) {
                    \App\Models\Postulante::factory()->create([
                        'ubigeo_detalle' => $dato[10].' / '.$dato[11].' / '.$dato[12],
                        'dni' => $dato[1],
                        'nombres' => $dato[4],
                        'apellidos' => $dato[2].' '.$dato[3],
                        'aula' => $dato[6],
                        'piso' => $dato[8],
                        'pabellon' => $dato[9],
                        'programacion_id' => $programacion->id,
                    ]);
                }
            }
        }

        TipoComida::insert([
            ['nombre' => 'DESAYUNO'],
            ['nombre' => 'REFRIGERIO MAÑANA'],
            ['nombre' => 'ALMUERZO'],
            ['nombre' => 'REGRIGERIO TARDE'],
            ['nombre' => 'CENA']
        ]);

        TipoPregunta::create(['nombre_tipo' => 'radio']);
        TipoPregunta::create(['nombre_tipo' => 'checbok']);
        TipoPregunta::create(['nombre_tipo' => 'texto']);
    }
}
