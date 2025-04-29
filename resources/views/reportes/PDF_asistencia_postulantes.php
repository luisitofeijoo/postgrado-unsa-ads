<html>
<head>
    <style type="text/css">
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { border-bottom: 2px solid #2c3e50; margin-bottom: 15px; }
        .titulo-principal { color: #2c3e50; margin-bottom: 5px; }
        .tabla-principal {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .tabla-principal th {
            background-color: #3498db;
            color: white;
            padding: 8px;
            font-size: 12px;
            border: 1px solid #2980b9;
        }
        .tabla-principal td {
            padding: 6px;
            font-size: 12px;
            border: 1px solid #ecf0f1;
        }
        .total-row {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        .subtitulo {
            color: #7f8c8d;
            font-size: 11px;
        }
        .texto-resaltado {
            color: #27ae60;
            font-weight: bold;
        }
    </style>
</head>
<body>
<div class="header">
    <h3 class="titulo-principal" style="text-align: center; margin: 0;">COAR AREQUIPA</h3>
    <p style="text-align: center; margin: 5px 0;"><strong>SEDE {{ $programacion->sede }}</strong></p>
    <p class="subtitulo" style="text-align: center; margin: 5px 0;">
        RESUMEN GENERAL DE ASISTENCIA DE POSTULANTES - ADMISIÓN {{ date('Y') }}
    </p>
</div>

<table class="tabla-principal">
    <thead>
    <tr>
        <th style="width: 20%;">AULA</th>
        <th style="width: 20%;">PROGRAMADO</th>
        <th style="width: 20%;">ASISTENTES [DNI]</th>
        <th style="width: 20%;">ASISTENTES [DJ]</th>
        <th style="width: 20%;">FALTANTES</th>
    </tr>
    </thead>
    <tbody>
    @php
        $totales = [
            'total_habilitados' => 0,
            'total_asistentes' => 0,
            'total_dj' => 0,
            'total_faltantes' => 0
        ];
    @endphp

    @foreach ($asistencias as $item)
        <tr>
            <td>AULA {{ $item->aula }}</td>
            <td class="texto-resaltado">{{ $item->total_postulantes_habilitados }}</td>
            <td>{{ $item->total_postulantes_con_asistencia-$item->total_dj }}</td>
            <td>{{ $item->total_dj }}</td>
            <td style="color: #e74c3c;">{{ $item->total_postulantes_faltantes }}</td>
        </tr>
        @php
            $totales['total_habilitados'] += $item->total_postulantes_habilitados;
            $totales['total_asistentes'] += $item->total_postulantes_con_asistencia;
            $totales['total_dj'] += $item->total_dj;
            $totales['total_faltantes'] += $item->total_postulantes_faltantes;
        @endphp
    @endforeach

    <tr class="total-row">
        <td>TOTALES</td>
        <td><span class="subtitulo">[Postulantes]</span><br>{{ $totales['total_habilitados'] }}</td>
        <td><span class="subtitulo">[Con DNI]</span><br>{{ $totales['total_asistentes']-$totales['total_dj'] }}</td>
        <td><span class="subtitulo">[Con DJ]</span><br>{{ $totales['total_dj'] }}</td>
        <td><span class="subtitulo">[Faltantes]</span><br>{{ $totales['total_faltantes'] }}</td>
    </tr>
    </tbody>
</table>

<div style="margin-top: 15px; text-align: right; font-size: 10px; color: #95a5a6;">
    Generado el: {{ date('d/m/Y H:i') }}
</div>
</body>
</html>
