<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //reseteamos cache de roles y permisos
       /* app()[
            \Spatie\Permission\PermissionRegistrar::class
        ]->forgetCahedPermissions();*/

        $arrayOfPermissionNames = [
            //
        ];

        Role::create(["name" => "admin"]);
        Role::create(["name" => "docente"]);
        Role::create(["name" => "estudiante"]);

        User::find(1)->assignRole("admin");

    }
}
