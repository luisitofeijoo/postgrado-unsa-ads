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
<table>
    <thead>
    <tr>
        <th>N°</th>
        <th>Código patrimonial</th>
        <th>Código interno</th>
        <th>Descripción</th>
        <th>Modelo</th>
        <th>Serie</th>
        <th>Color</th>
        <th>Situación</th>
        <th>Estado</th>
        <th>Observaciones</th>
        <th>Ubicación</th>
    </tr>
    </thead>
    <tbody>
    @foreach($bienes as $index => $bien)
        <tr>
            <td>{{ ++$index }}</td>
            <td>{{ $bien->codigo_patrimonial }}</td>
            <td>{{ $bien->codigo_interno }}</td>
            <td>{{ $bien->nombre }}</td>
            <td>{{ $bien->modelo }}</td>
            <td>{{ $bien->serie }}</td>
            <td>{{ $bien->color }}</td>
            <td>{{ $bien->situacion }}</td>
            <td>{{ $bien->estado }}</td>
            <td>{{ $bien->observacion }}</td>
            <td>-.-</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
