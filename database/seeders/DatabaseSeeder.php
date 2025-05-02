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


        $this->call([
            PermissionsSeeder::class,
        ]);



        TipoPregunta::create(['nombre_tipo' => 'radio']);
        TipoPregunta::create(['nombre_tipo' => 'checbok']);
        TipoPregunta::create(['nombre_tipo' => 'texto']);
    }
}
