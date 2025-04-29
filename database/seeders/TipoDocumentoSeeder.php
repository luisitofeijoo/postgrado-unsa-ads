<?php

namespace Database\Seeders;

use App\Models\TipoDocumento;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoDocumentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $documentos = ["Oficio", "Oficio Múltiple", "Oficio Circular", "Carta", "Solicitud", 'Resolución', 'Informe',"Otro"];
        foreach ($documentos as $doc) {
            DB::table('tipo_documentos')->insert(['descripcion' => $doc]);
        }
    }
}
