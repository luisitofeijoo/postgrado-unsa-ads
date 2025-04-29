<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as FakerFactory;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Postulante>
 */
class PostulanteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = FakerFactory::create('es_ES');

        // Generar un aula aleatorio
        /*        $aula = $faker->randomElement([101, 102, 103, 104, 105, 106]);

                $pabellonesPorAula = [
                    101 => 'A',
                    102 => 'A', // O el pabellón que desees asignar aula 102
                    103 => 'B',
                    104 => 'B',
                    105 => 'C', // O el pabellón que desees asignar aula 105
                    106 => 'D'
                ];*/

        // $pabellon = $pabellonesPorAula[$aula];

        return [
            'dni' => $faker->unique()->numerify('########'),
            'nombres' => $faker->firstName,
            'apellidos' => $faker->lastName.' '.$this->faker->lastName,
            'aula' => 'S/A',
            'pabellon' => 'S/P',
        ];
    }
}
