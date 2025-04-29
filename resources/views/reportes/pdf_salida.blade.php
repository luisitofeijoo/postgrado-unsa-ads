<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documento PDF</title>
    <style>
        body {
            margin: 0;
            padding: 0;
        }
        @page {
            margin: 0px;
        }
        @font-face {
            font-family: 'Inter-Medium';
            src: url({{ storage_path('fonts/Inter-Medium.ttf') }}) format("truetype");
            }
        .pagina {
            width: 100%;
            height: 100%;
            position: relative;
        }

        .imagen {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }

        .texto {
            position: absolute;
            color: black;
            font-family: Inter-Medium;
            font-size: 18px;
        }
    </style>
</head>
<body>

@foreach($personas as $persona)
    <div class="pagina">
        <img class="imagen" src="{{ asset('/salida.jpg') }}" alt="Imagen A4">
        <div class="texto" style="top: 122px;left: 330px;">
            <p>{{ strtoupper($persona->apellido_paterno) }} {{ strtoupper($persona->apellido_materno) }}, {{ strtoupper($persona->nombres) }}</p>
        </div>
        <div class="texto" style="top: 165px;left: 330px;">
            <p>{{ $persona->nro_documento }}</p>
        </div>       
        <div class="texto" style="top: 150px;right: 65px;font-size:26px;">
            <p>{{ $persona->estudiantes[0]->grado }} "{{ $persona->estudiantes[0]->seccion }}"</p>
        </div>    
    </div>
    <div class="pagina">
        <img class="imagen" src="{{ asset('/salida.jpg') }}" alt="Imagen A4">
        <div class="texto" style="top: 122px;left: 330px;">
            <p>{{ strtoupper($persona->apellido_paterno) }} {{ strtoupper($persona->apellido_materno) }}, {{ strtoupper($persona->nombres) }}</p>
        </div>
        <div class="texto" style="top: 165px;left: 330px;">
            <p>{{ $persona->nro_documento }}</p>
        </div>       
        <div class="texto" style="top: 150px;right: 65px;font-size:26px;">
            <p>{{ $persona->estudiantes[0]->grado }} "{{ $persona->estudiantes[0]->seccion }}"</p>
        </div>    
    </div>
@endforeach

</body>
</html>