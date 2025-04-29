<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Estudiantes que No Consumieron Comida</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .titulo { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 5px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
<div class="titulo">Reporte de Estudiantes - No consumo
    @switch($tipoComida)
        @case(1)
            DESAYUNO
            @break

        @case(2)
            REFRIGERIO MAÑANA
            @break
        @case(3)
            ALMUERZO
            @break
        @case(4)
            REFRIGERIO TARDE
            @break
        @case(5)
            CENA
            @break
    @endswitch
</div>
<p><strong>Fecha:</strong> {{ $fecha }}</p>

<table>
    <thead>
    <tr>
        <th>#</th>
        <th>Documento</th>
        <th>Apellidos y Nombres</th>
        <th>Grado</th>
        <th>Sección</th>
    </tr>
    </thead>
    <tbody>
    @foreach ($estudiantes as $index => $estudiante)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $estudiante->nro_documento }}</td>
            <td>{{ $estudiante->apellido_paterno }} {{ $estudiante->apellido_materno }}, {{ $estudiante->nombres }}
                @if(!$estudiante->activo_comida)
                    <strong> [ RETIRADO ]<strong>
                @endif
            </td>
            <td>{{ $estudiante->grado }}</td>
            <td>{{ $estudiante->seccion }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
