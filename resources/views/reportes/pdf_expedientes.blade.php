<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style type="text/css">
        body {
            font-family: Arial, sans-serif;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 6px 2px;
            text-align: center;
        }
        th {
            background-color: #f2f2f2;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
<div style="text-align: center; width: 100%;">
    <p><strong>COAR AREQUIPA - 2024</strong><br/>DOCUMENTOS RECIBIDOS</p>
</div>
<table>
    <thead>
    <tr>
        <th>N° REG.</th>
        <th>FECHA</th>
        <th>TIPO DOCUMENTO</th>
        <th>N°</th>
        <th>REMITENTE</th>
        <th>ASUNTO</th>
        <th>TRÁMITE</th>
        <th>PASE A</th>
        <th>FECHA</th>
    </tr>
    </thead>
    <tbody>
    @foreach($expedientes as $index => $expediente)
        <tr>
            <td>{{ $expediente->codigo }}</td>
            <td>{{ \Carbon\Carbon::parse($expediente->created_at)->format('d/m/Y') }}</td>
            <td>{{ strtoupper($expediente->tipo_documento->descripcion) }}</td>
            <td style="text-align: left;">{{ strtoupper($expediente->nro_expediente) }}</td>
            <td style="text-align: left;">{{ strtoupper($expediente->nombre_razonsocial) }}</td>
            <td style="text-align: left;">{{ strtoupper($expediente->asunto) }}</td>
            <td style="text-align: left;">{{ strtoupper($expediente->detalle_derivado) }}</td>
            <td style="text-align: left;">{{ strtoupper($expediente->oficina->descripcion) }}</td>
            <td>{{ \Carbon\Carbon::parse($expediente->fecha_derivado)->format('d/m/Y') }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
