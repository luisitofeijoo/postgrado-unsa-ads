<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('personas', function (Blueprint $table) {
            $table->id();
            $table->string('nro_documento');
            $table->string('nombres',90);
            $table->string('apellido_paterno', 90);
            $table->string('apellido_materno', 90);
            $table->date('fecha_nacimiento')->nullable();
            $table->string('avatar', 500)->nullable();
            $table->boolean("activo_comida")->default(true);
            $table->string('celular')->nullable();
            $table->binary('huella')->nullable();
            $table->string("direccion")->nullable();
            $table->string('lugar_nacimiento')->nullable();
            $table->string('lugar_domicilio')->nullable();
            $table->enum('sexo', ['M', 'F', '-'])->default('-');
            $table->enum('estado_civil', ['soltero/a', 'casado/a', 'viudo/a', 'divorciado/a','conviviente', '-'])->default('-');
            $table->string('info_pareja')->nullable()->default('');
            $table->timestamps();
        });
        // Modificar la columna huella a LONGBLOB después de la creación
        //DB::statement('ALTER TABLE personas MODIFY huella LONGBLOB;');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personas');
    }
};
