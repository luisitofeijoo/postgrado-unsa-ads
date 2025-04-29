<html>
<head>
    <meta charset="utf-8" />
    <style>
        @font-face {
            font-family: 'Inter-Medium';
            src: url({{ storage_path('fonts/Inter-Medium.ttf') }}) format("truetype");
            }
        html {
            margin-left: 20px;
            margin-right: 20px;
        }
    </style>
</head>
    <body>
        @foreach($personas as $persona)
            <div style="position: relative;width:655px;height:200px;margin-bottom: 5px;">
                <img src="{{ asset('img/fotocheck/template.jpg')  }}" width="654px" />
                <div style="position: absolute;top:40px;left:16px;background:white;width:90px;height:117px">
                    <img src="{{ is_null($persona->avatar)? "": asset($persona->avatar) }}" width="90px" height="121px" alt="">
                </div>
                <div class="nombre" style="position: absolute;top: 50px;left: 120px;font-size: 14px;">
                    <p style="padding:0;padding-bottom:2px;margin: 0;line-height: 11px;font-family: 'Inter-Medium'">
                        <small style="font-size:12px;">Dni:</small><br>
                        <span>{{ $persona->dni }}</span>
                    </p>
                    <p style="padding:0;padding-bottom:2px;margin: 0;line-height: 11px;font-family: 'Inter-Medium'">
                        <small style="font-size:12px;">Apellidos:</small><br>
                        {{ strtoupper($persona->apellido_paterno) }} <br>
                        {{ strtoupper($persona->apellido_materno) }}
                    </p>
                    <p style="padding:0;padding-bottom:0px;margin: 0;line-height: 11px;font-family: 'Inter-Medium'">
                        <small style="font-size:12px;">Nombres:</small><br>
                        {{ strtoupper($persona->nombres) }}

                    </p>
                </div>
                <div style="position: absolute;font-size:13px;bottom: 9px;left: 140px;font-family: 'Inter-Medium'">
                    <span style="color:#a40303;">.: N° {{ str_pad($persona->numero_comunero, 3, '0', STR_PAD_LEFT) }}</span>
                </div>
                <div style="position: absolute; top: 10px;right: 10px;text-align: right;">
                    <div style="background: white;padding:5px 5px 0px 5px;border-radius: 4px;line-height: 15px;">
                        <img src="data:image/png;base64,{{DNS2D::getBarcodePNG($persona->dni.'|'.$persona->numero_comunero.'|'.strtoupper($persona->estado_civil).'=>'.strtoupper($persona->nombre_pareja), 'QRCODE') }}" width="80px;"/><br>
                        <small style="font-size: 10px;padding: 0;margin: 0;">&copy; 2023 - 2024</small>
                    </div>
                </div>
{{--                <div style="position: absolute; top: 40px;right: 110px;text-align: right;">--}}
{{--                    <img src="{{ asset('img/firma.png')  }}" width="150px" alt="">--}}
{{--                </div>--}}
            </div>
        @endforeach
    </body>
</html>
