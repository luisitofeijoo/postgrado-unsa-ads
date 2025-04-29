<!DOCTYPE html>
<html>
<head>
    <style type="text/css">
        html, body {
            margin-top: 40px;
            font-family: Arial, sans-serif;
        }

        .has-text-centered {
            text-align: center;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            font-size: 10px;
        }

        table, th, td {
            border: 1px solid black;
        }

        th, td {
            padding: 5px;
            text-align: left;
        }

        .page-break {
            page-break-after: always;
        }

        header {
            position: fixed;
            top: -10px;
            left: 0;
            right: 0;
            text-align: center;
            /* Ajusta el color de fondo según tu preferencia */
        }

        #myCheckbox {
            appearance: none; /* Esto quita el estilo predeterminado del checkbox */
        }
    </style>
</head>
<body>
<header>
    <strong>REGISTRO DE RECURSOS TECNOLÓGICOS Y MUSICALES - {{ date('Y') }} - COAR AREQUIPA</strong>
    <p style="text-align: right !important;font-size:10px;">Fecha de reporte:
        {{ \Carbon\Carbon::parse($date_start)->format('d/m/Y') }} al {{ \Carbon\Carbon::parse($date_end)->format('d/m/Y') }}
    </p>
</header>
<div>
    <table>
        <thead>
        <tr>
            <th>N°</th>
            <th>G/S</th>
            <th>ESTUDIANTE (Apellidos y Nombres)</th>
            <th>Bienes</th>
        </tr>
        </thead>
        <tbody>
        @php $numerador = 0; $seccion = ""; @endphp
        @foreach($registros as $key => $registro)
            @php
                if($key === 0) {
                    $seccion = $registro['seccion'];
                }
            @endphp
            @if($registro['seccion'] != $seccion)
                @php $numerador = 0; $seccion = $registro['seccion'] @endphp
                <tr class="page-break" style="border:none;">
                    <td colspan="4" style="border:none;"></td>
                </tr> <!-- Salto de página -->>
            @endif
            <tr>
                <td style="width: 15px;">{{ str_pad(++$numerador, 3, '0', STR_PAD_LEFT) }}</td>
                <td style="width: 20px;">{{ $registro['grado'] }}  {{ $registro['seccion'] }}</td>
                <td>{{ $registro['apellidos'] }}, {{ $registro['nombres']  }}</td>
                <td style="font-size: 8px; !important;">
                    @foreach($registro['movimientos'] as $movimiento)
                        <strong>[{{ $movimiento['tipo_movimiento']}}] {{ \Carbon\Carbon::parse($movimiento['fecha_movimiento'])->format('d/m/Y H:i:s') }}</strong>
                        {{ $movimiento['nombre_bien'] }} | {{ $movimiento['marca_bien'] }} |
                        {{ $movimiento['serie_bien'] }} <br/>
                    @endforeach
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
</div>
</body>
</html>
