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
            font-size: 12px;
        }
    </style>
</head>
<body>

@foreach($personas as $persona)
    <div class="pagina">
        <img class="imagen" src="{{ asset('/formato_recepcion.jpg') }}" alt="Imagen A4">
        <div class="texto" style="top: 150px;left: 150px;">
            <p>{{ strtoupper($persona->apellido_paterno) }} {{ strtoupper($persona->apellido_materno) }}, {{ strtoupper($persona->nombres) }}</p>
        </div>
        <div class="texto" style="top: 168px;left: 150px;">
            <p>{{ $persona->estudiantes[0]->grado }} "{{ $persona->estudiantes[0]->seccion }}"</p>
        </div>
        <div class="texto" style="top: 161px;right: 50px;">
        {{ strtoupper($persona->nro_documento) }} 
      </div>
      <div class="texto" style="top: 180px;right: 50px;">
      {{ $persona->estudiantes[0]->tutor }}
      </div>
      <div class="texto" style="bottom: 95px;left: 25px;font-size:10px;">
            <small style="line-height:0px;">
              {{ strtoupper($persona->apellido_paterno) }} {{ strtoupper($persona->apellido_materno) }}, {{ strtoupper($persona->nombres) }} <br> {{ $persona->nro_documento }}  |  {{ $persona->estudiantes[0]->grado }} "{{ $persona->estudiantes[0]->seccion }}" </small>
        </div>

        <div class="texto" style="bottom: 95px;left: 265px;font-size:10px;">
            <small style="line-height:0px;">
            ING. LUIS MIGUEL FEIJOO VALERIANO <br> 70757711</small>
        </div>

        <div class="texto" style="bottom: 103px;right: 40px;font-size:10px;">
            <small style="line-height:0px;">
            {{ $persona->estudiantes[0]->tutor }}
            </small>
        </div>
    </div>
@endforeach

</body>
</html>