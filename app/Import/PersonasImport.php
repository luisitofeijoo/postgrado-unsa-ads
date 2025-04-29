<?php

namespace App\Import;
use App\Models\Persona;
use Maatwebsite\Excel\Concerns\ToModel;

class PersonasImport implements ToModel
{

    /**
     * @inheritDoc
     */
    public function model(array $row)
    {
        return new Persona([
            'dni' => $row[0],
            'nombres' => '',
            'apellido_paterno' => '',
            'apellido_materno' => ''
        ]);
    }
}
