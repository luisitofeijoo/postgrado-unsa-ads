<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ficha de Asignación de Uso de Bienes Patrimoniales</title>
    <style>
        body, html {
            font-family: Arial, sans-serif;
            margin: 4px;
            padding: 20px;
        }
        h4, h3, p {
            margin: 10px 0;
        }
        table {
            width: 100%;
            font-size: 10px;
            border-collapse: collapse;
            margin: 0 auto;
        }
        th, td {
            border: 1px solid #000;
            padding: 2px;
        }
        .signatory p, .note {
            margin: 0;
            font-size: 10px;
        }
        .signatory p {
            border-top: 1px dashed #000;
            padding: 5px;
            text-align: center;
        }
        .signature {
            border-top: 1px solid #000;
            width: 100%;
            position: relative;
            bottom: 0;
            text-align: center;
        }
        .note {
            border: 1px solid black;
            padding: 5px;
            bottom: 15px;
            page-break-inside: avoid; /* Evita el salto de página dentro de este div */
        }
        .note strong {
            font-weight: bold;
        }
        .note ol {
            margin: 0;
            padding-left: 20px;
        }
        .text-center {
            text-align: center;
        }

        h6 {
            margin: 10px 0px;
        }

        .firma {
            margin-bottom: 5px;
            page-break-inside: avoid; /* Evita el salto de página dentro de este div */
            .container{
                text-align: center;
            }
        }

    </style>
</head>
<body>
<h4 class="text-center">FICHA DE ASIGNACIÓN EN USO DE BIENES TECNOLÓGICOS<br>.: COAR AREQUIPA :.</h4>
<h6>I. PERSONA RESPONSABLE DEL BIEN</h6>
<table>
    <thead>
    <tr>
        <td><strong>APELLIDOS Y NOMBRES : </strong></td><td>{{ $persona->apellido_paterno }} {{ $persona->apellido_materno }}, {{ $persona->nombres }}</td>
        <td><strong>DNI : </strong></td><td>{{ $persona->nro_documento }}</td>
    </tr>
    <tr>
        <td><strong>DIRECCIÓN : </strong></td><td>{{ $persona->direccion }}</td>
        <td><strong>EMAIL : </strong></td><td>{{ $persona->email }}</td>
    </tr>
    <tr>
        <td><strong>UBIGEO : </strong></td><td>{{ $persona->lugar_domicilio }}</td>
        <td><strong>CELULAR : </strong></td><td>{{ $persona->celular }}</td>
    </tr>
    <tr>
        <td><strong>CARGO : </strong></td><td colspan="3">DOCENTE</td>
    </tr>
    </thead>
</table>

<h6>II. RELACIÓN DE BIENES ASIGNADOS</h6>
<table style="font-size: 9px;">
    <thead>
    <tr>
        <th>N°</th>
        <th>CÓD. PATRIMONIAL</th>
        <th style="width: 200px;">NOMBRE</th>
        <th>MARCA</th>
        <th>MODELO</th>
        <th>SERIE</th>
        <th>COLOR</th>
        <th>ESTADO<sup>(1)</sup></th>
        <th>OBS.</th>
    </tr>
    </thead>
    <tbody>
    @foreach($prestamos as $index => $prestamo)
        <tr>
            <td>{{ ++$index }}</td>
            <td>{{ $prestamo->codigo_patrimonial }}</td>
            <td>{{ $prestamo->nombre }}</td>
            <td>{{ $prestamo->marca }}</td>
            <td>{{ $prestamo->modelo }}</td>
            <td>{{ $prestamo->serie }}</td>
            <td>{{ $prestamo->color }}</td>
            <td style="text-align: center">{{ $prestamo->estado }}</td>
            <td>{{ $prestamo->comentario }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
<small style="font-size: 9px;">* (1) El estado es consignado en base a la siguiente escala: Bueno, Regular, Malo, Chatarra y RAEE.</small>

<div class="firma">
    <h6>IV. FIRMA Y SELLOS</h6>
    <div class="container">
        <table>
            <tr>
                <td class="signatory">
                    <div style="height:100px;"></div>
                    <p>CARLOS A. LLERANA TALAVERA<br>DNI. 30427629</p>
                    <div class="signature">V°B° Dirección General</div>
                </td>
                <td class="signatory">
                    <div style="height:100px;"></div>
                    <p>LUIS MIGUEL FEIJOO VALERIANO<br>DNI. 70757711</p>
                    <div class="signature">V°B° Centro de atención al usuario</div>
                </td>
                <td class="signatory">
                    <div style="height:100px;"></div>
                    <p>{{ $persona->apellido_paterno.' '.$persona->apellido_materno.', '.$persona->nombres }}<br>DNI. {{ $persona->nro_documento }}</p>
                    <div class="signature">Firma de usuario</div>
                </td>
            </tr>
        </table>
    </div>
</div>

<div class="note">
    <strong>Nota:</strong>
    <table>
        <tr>
            <td style="border:none;font-size: 9px;">
                <ol>
                    <li>Los bienes asignados quedan bajo el cuidado y responsabilidad del responsable del bien asignado, de acuerdo a la normatividad vigente.</li>
                    <li>Los movimientos de entrada y salida de bienes asignados deberán ser autorizados por el jefe de área, mediante actas y documentos que sustenten dichos movimientos, incluyendo la firma del Director General.</li>
                    <li>En caso de pérdida, robo, sustracción, destrucción total o parcial del bien, el servidor y/o funcionario responsable deberá documentar y sustentar la ocurrencia, de acuerdo con la normatividad vigente. Si un docente o estudiante conscientemente causa daño a los bienes patrimoniales asignados por el COAR para el desarrollo de sus actividades educativas, será responsable de la reparación y/o reemplazo. En ambos casos, los componentes utilizados deberán ser originales y tener iguales o superiores características al bien dañado. El plazo para la reparación y/o reposición no deberá exceder los 30 días desde la fecha de la incidencia.</li>
                    <li>Para validar el retorno de los bienes, se deberá acreditar mediante un acta o documento que sustente dicha devolución.</li>
                </ol>
            </td>
            <td style="border:none;">
                <img src="data:image/png;base64,{{ DNS2D::getBarcodePNG('http://181.176.246.5/doc/'.$persona->nro_documento.'-asignado', 'QRCODE') }}" />
            </td>
        </tr>
    </table>
</div>
</body>
</html>
