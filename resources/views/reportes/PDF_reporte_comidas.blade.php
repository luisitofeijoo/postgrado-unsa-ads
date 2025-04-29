<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Consumo de Comidas</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
        }
        .container {
            width: 100%;
            margin: 0 auto;
            text-align: center;
        }
        h2 {
            margin-bottom: 5px;
            font-size: 18px;
            text-transform: uppercase;
        }
        p {
            margin: 0;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }
        th {
            background-color: #4CAF50;
            color: white;
            text-transform: uppercase;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .footer {
            margin-top: 20px;
            font-size: 10px;
            color: #777;
            text-align: right;
        }
    </style>
</head>
<body>
<div class="container">
    <h2>Reporte de Consumo de Comidas</h2>
    <p><strong>Fecha de Generación:</strong> {{ \Carbon\Carbon::now()->format('d/m/Y') }}</p>

    <table>
        <thead>
        <tr>
            <th>Día</th>
            <th>Fecha</th>
            <th>Desayuno</th>
            <th>Refrigerio 01</th>
            <th>Almuerzo</th>
            <th>Refrigerio 02</th>
            <th>Cena</th>
            <th>Total</th>
        </tr>
        </thead>
        <tbody>
        @foreach ($datos as $fila)
            <tr>
                <td>{{ \Carbon\Carbon::createFromFormat('d/m/Y', $fila->fecha)->translatedFormat('l') }}</td>

                <td>{{ $fila->fecha }}</td>
                <td>{{ $fila->desayuno }}</td>
                <td>{{ $fila->ref1 }}</td>
                <td>{{ $fila->almuerzo }}</td>
                <td>{{ $fila->ref2 }}</td>
                <td>{{ $fila->cena }}</td>
                <td><strong>{{ $fila->total }}</strong></td>
            </tr>
        @endforeach
        </tbody>
        <tfoot>
        <tr>
            <th colspan="2">Total General</th>
            <th>{{ $datos->sum('desayuno') }}</th>
            <th>{{ $datos->sum('ref1') }}</th>
            <th>{{ $datos->sum('almuerzo') }}</th>
            <th>{{ $datos->sum('ref2') }}</th>
            <th>{{ $datos->sum('cena') }}</th>
            <th>{{ $datos->sum('total') }}</th>
        </tr>
        </tfoot>
    </table>

    <div class="footer">
        <p>Reporte generado automáticamente por el sistema.</p>
    </div>
</div>
</body>
</html>
