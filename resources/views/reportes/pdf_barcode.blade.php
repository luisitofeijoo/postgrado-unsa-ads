<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style type="text/css">
        body {
            font-family: Arial, sans-serif;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 6px 10px;
        }
        th {
            background-color: #f2f2f2;
            text-transform: uppercase;
        }
        .code {
            font-size: 14px;
            font-weight: bold;
            display: block;
            text-align: right;
        }

        .barcode-cell {
            width: 33%; /* Para mostrar 3 columnas por fila */
            /* Si quieres mostrar 4 columnas, cambia el width a 25% */
        }
    </style>
</head>
<body>
<table class="table">
    <tbody>
    @php
        $rowCount = 0;
        $j = 0;
    @endphp
    @for($i=241100; $i<=241396;$i++)

        @if($j % 3 == 0)
            <tr>
                @endif
                <td class="barcode-cell">
                    <p style="font-weight: bold;margin-bottom:0px;"> COMPUTADORA PERSONAL PORTATIL</p>
                    <table style="width: 100%;margin-top:8px;padding: 0px;border: none;border-collapse: collapse;">
                        <tr>
                            <td style="border:none;padding: 0px;font-family: 'Arial Narrow';">CÓDIGO N°.</td>
                            <td style="border: none;text-align: right;padding: 0px;"><img src="data:image/png;base64,{{ DNS1D::getBarcodePNG(strval($i), 'C128') }}" style="text-align: right;"/></td>
                        </tr>
                    </table>
                    <strong class="code">* {{ $i  }} *</strong>
                </td>
                @php
                    $rowCount++;
                    if ($rowCount % 3 == 0)
                        echo '</tr>';
                @endphp
                @php $j++; @endphp
                @endfor
                @if($rowCount % 3 != 0)
            </tr> <!-- Cerrar la última fila si no está completa -->
        @endif
    </tbody>
</table>
</body>
</html>
