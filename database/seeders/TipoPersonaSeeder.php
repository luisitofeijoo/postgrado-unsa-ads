<?php

namespace Database\Seeders;

use App\Models\TipoPersona;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TipoPersonaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TipoPersona::insert([
            ['descripcion' => 'Estudiante'],
            ['descripcion' => 'Docente'],
            ['descripcion' => 'Coordinador'],
            ['descripcion' => 'Administrativo'],
            ['descripcion' => 'Padre de familia'],
        ]);
    }
}
