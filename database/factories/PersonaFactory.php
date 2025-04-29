<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Persona>
 */
class PersonaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [

            'nro_documento' =>fake()->dni(),
            'nombres' => strtoupper(fake()->firstName),
            'apellido_paterno' => strtoupper(fake()->lastName),
            'apellido_materno' => strtoupper(fake()->lastName),
            'fecha_nacimiento' => fake()->dateTimeBetween('1950-01-01', '2004-12-31'),
            'celular' => fake()->phoneNumber,
            'direccion' => fake()->address,
            'lugar_nacimiento' => strtoupper('Ollachea/carabaya/puno'),
        ];
    }
}
