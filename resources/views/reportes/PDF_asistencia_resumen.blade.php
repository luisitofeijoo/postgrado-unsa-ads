<html>
<head>
    <style type="text/css">
        @page {
            margin: 0px 50px 50px 50px; /* top, right, bottom, left */
        }

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
            font-size: 10px;
            border: 1px solid #2980b9;
        }
        .tabla-principal td {
            padding: 6px;
            font-size: 10px;
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
        .text-centered{
            text-align: center;
        }

    </style>
</head>
<body>
<div class="header">
  {{--  <h3 class="titulo-principal" style="text-align: center; margin: 0;">COAR AREQUIPA</h3>--}}
    <p style="text-align: center; margin: 5px 0;"><strong>COLEGIO DE ALTO RENDIMIENTO DE AREQUIPA</strong></p>


</div>
<table class="tabla-principal text-centered">
    <thead>
    <tr>
        <td colspan="8" style="border:0px solid white;">RESUMEN GENERAL DE CONSUMO DE ESTUDIANTES -
            {{ \Carbon\Carbon::parse( $fecha)->format('d/m/Y') }}</td>
    </tr>

    <tr>
        <th style="width: 20%;">GRADO</th>
        <th style="width: 20%;">APELLIDOS Y NOMBRES</th>
        <th style="width: 20%;">GENERO</th>
        <th style="width: 20%;">DESY.</th>
        <th style="width: 20%;">REF. M</th>
        <th style="width: 20%;">ALMZO</th>
        <th style="width: 20%;">REF. T</th>
        <th style="width: 20%;">CENA</th>
    </tr>
    </thead>
    <tbody>

        @php
            $totald = 0;
            $totalr1 = 0;
            $totala = 0;
            $totalr2 = 0;
            $totalc = 0;

        @endphp
    @foreach($estudiantes as $grupo => $lista)
        @php
            $totalDesayuno = $lista->sum('desayuno');
            $totalRef1 = $lista->sum('ref1');
            $totalAlmuerzo = $lista->sum('almuerzo');
            $totalRef2 = $lista->sum('ref2');
            $totalCena = $lista->sum('cena');
        @endphp

        @foreach($lista as $estudiante)
            <tr>
                <td>{{ $estudiante->grado }} {{ $estudiante->seccion }}</td>
                <td width="260px" style="text-align: left;">{{ $estudiante->apellido_paterno }} {{ $estudiante->apellido_materno }}, {{ $estudiante->nombres }}
                    @if(!$estudiante->activo_comida)
                        <strong> [ RETIRADO ]<strong>
                    @endif
                </td>
                <td>{{ $estudiante->sexo }}</td>
                <td>{{ $estudiante->desayuno }}</td>
                <td>{{ $estudiante->ref1 }}</td>
                <td>{{ $estudiante->almuerzo }}</td>
                <td>{{ $estudiante->ref2 }}</td>
                <td>{{ $estudiante->cena }}</td>
            </tr>
        @endforeach

        <!-- Fila de Totales -->
        <tr class="total-row">
            <td colspan="3">TOTAL PARA {{ explode('-', $grupo)[0] }}° {{ explode('-', $grupo)[1] }}</td>
            <td>{{ $totalDesayuno }}</td>
            <td>{{ $totalRef1 }}</td>
            <td>{{ $totalAlmuerzo }}</td>
            <td>{{ $totalRef2 }}</td>
            <td>{{ $totalCena }}</td>
            @php
                $totald += $totalDesayuno;
                $totalr1 += $totalRef1;
                $totala += $totalAlmuerzo;
                $totalr2 += $totalRef2;
                $totalc += $totalCena;
            @endphp
        </tr>
    @endforeach
        <tr>
            <td  colspan="3"><strong>SUMATORIAL GENERAL</strong></td>
            <td>{{ $totald }}</td>
            <td>{{ $totalr1 }}</td>
            <td>{{ $totala }}</td>
            <td>{{ $totalr2 }}</td>
            <td>{{ $totalc }}</td>
        </tr>
    </tbody>
</table>
</body>
</html>
