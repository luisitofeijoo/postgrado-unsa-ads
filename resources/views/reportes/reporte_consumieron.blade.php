<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Estudiantes que No Consumieron Comida</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 5px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
<div class="titulo">REPORTE DE ESTUDIANTES CON CONSUMO - COAR AREQUIPA</div><br/>
<table style="width: 100%; margin-bottom: 10px;">
    <tr>
        <td style="text-align: left;">
            <strong>SERVICIO:</strong>
            @switch($tipoComida)
                @case(1) DESAYUNO @break
                @case(2) REFRIGERIO MAÑANA @break
                @case(3) ALMUERZO @break
                @case(4) REFRIGERIO TARDE @break
                @case(5) CENA @break
            @endswitch
        </td>
        <td style="text-align: right;">
            <strong>Fecha:</strong> {{ \Carbon\Carbon::parse($fecha)->format('d/m/Y') }}
        </td>
    </tr>
</table>


<table>
    <thead>
    <tr>
        <th>Item</th>
        <th>Documento</th>
        <th>Apellidos y Nombres</th>
        <th>Fecha y Hora</th>
        <th>Grado\Sec</th>
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
                @endif</td>

            <td>{{ \Carbon\Carbon::parse($estudiante->hora_registro)->format('d/m/Y H:i') }}</td>
            <td>{{ $estudiante->grado }} {{ $estudiante->seccion }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
