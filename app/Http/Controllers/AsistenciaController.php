<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use App\Models\Persona;
use App\Models\Postulante;
use App\Models\Asistencia;
use App\Models\Programacion;
use App\Models\RegistroComida;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AsistenciaController extends Controller
{

    public function save(Request $request, $dni)
    {
        return DB::transaction(function () use ($request, $dni) {

            // Buscar el postulante por DNI
            $persona = Persona::where('nro_documento', $dni)
                ->first();

            if ($persona) {

                //Bloqueamos la fila para evitar concurrencia y verifica si ya existe una asistencia para este postulante
                $asistenciaExistente = RegistroComida::where('persona_id', $persona->id)
                    ->where('tipo_comida_id', $request->input('tipoRegistro'))
                    ->whereDate('fecha', now()) // Asegura que la fecha sea solo la parte de la fecha sin la hora
                    ->first();

                $persona->load('estudiante');

                if (!$asistenciaExistente) {
                    // Si no existe, registra la asistencia
                    $asistencia = RegistroComida::create([
                        'persona_id' => $persona->id,
                        'tipo_comida_id' => $request->input('tipoRegistro'),
                        'fecha' => now(),
                        'hora_registro' => now()
                    ]);

                    // Retornar los datos del postulante y la asistencia
                    return response()->json([
                        'mensaje' => '<span class="far fa-circle-check"></span>Consumo registrado correctamente. ',
                        'persona' => $persona,
                        'asistencia' => $asistencia,
                        'estado' => 'nuevo',
                    ]);
                } else {
                    // Si ya existe una asistencia para este postulante, devolver los datos existentes
                    return response()->json([
                        'mensaje' => '<span class="far fa-warning"></span> El estudiante ya ha consumido esta comida en este turno.',
                        'persona' => $persona,
                        'asistencia' => $asistenciaExistente,
                        'estado' => 'registrado',
                    ]);
                }
            } else {
                // El postulante no existe en la base de datos
                return response()->json(['mensaje' => 'Postulante no encontrado'], 404);
            }
        });
    }

    public function registro_comida_eliminar($id)
    {
        $registro = RegistroComida::findOrFail($id);
        $registro->delete();
    }

    public function reporte_aula()
    {
        $programacion = Programacion::where('estado', 1)
            ->first();
        // Obtén el número de postulantes ingresados por aula (todos)
        $postulantesPorAula = Postulante::join('asistencias', 'postulantes.id', '=', 'asistencias.postulante_id')
            ->select('postulantes.aula', \DB::raw('count(*) as total_postulantes'))
            ->where('postulantes.programacion_id', $programacion->id)
            ->groupBy('postulantes.aula')
            ->get();

        return view('reporte.rpt_asistencia_aula', ['postulantes_aula' => $postulantesPorAula]);
    }

    public function reporte_postulantes()
    {
        $programacion = Programacion::where('estado', 1)
            ->first();

        $asistencias = Asistencia::with('postulante')
            ->whereHas('postulante', function ($query) use ($programacion) {
                $query->where('programacion_id', $programacion->id);;
            })
            ->orderBy('fecha_asistencia', 'desc')->get();
        return view('reporte.rpt_asistencia_postulantes', compact('asistencias'));
    }

    public function pdf_mesas()
    {
        $programacion = Programacion::where('estado', 1)
            ->first();
        // Obtén el número de postulantes ingresados por aula (todos)
        $users_asistencias = Postulante::join('asistencias', 'postulantes.id', '=', 'asistencias.postulante_id')
            ->join('users', 'users.id', '=', 'asistencias.user_id')
            ->select('users.nombres','users.username',\DB::raw('count(*) as registrados'))
            ->where('postulantes.programacion_id', $programacion->id)
            ->groupBy('asistencias.user_id')
            ->orderBy('registrados', 'DESC')
            ->get();


        return view('reportes.rpt_registro_asistencia_users', compact('users_asistencias'));
    }

    public function reporte_postulantes_user()
    {
        $programacion = Programacion::where('estado', 1)
            ->first();

        $asistencias = Asistencia::with('postulante')
            ->whereHas('postulante', function ($query) use ($programacion) {
                $query->where('programacion_id', $programacion->id);
            })
            ->where('user_id', Auth::id())
            ->orderBy('fecha_asistencia', 'desc')->get();
        return view('reporte.rpt_asistencia_postulantes', compact('asistencias'));
    }

    public function page_programacion()
    {
        $programaciones = Programacion::all();
        return view('programacion', compact('programaciones'));
    }

    public function actualizarEstado(Request $request){
        $programacionId = $request->get('programacion');

        // Actualizar el estado en la base de datos
        $programacion = Programacion::find($programacionId);
        $programacion->estado = 1;
        $programacion->save();

        // Desactivar el resto de elementos
        Programacion::where('id', '!=', $programacionId)->update(['estado' => 0]);

        return redirect(route('page_programacion'));
    }

    public function resumen_asistencia()
    {
        $programacion = Programacion::where('estado', 1)
            ->first();
        if($programacion) {
            $consultaSQL = "
                SELECT
                    p.aula,
                    COUNT(p.id) as total_postulantes_habilitados,
                    COUNT(a.id) as total_postulantes_con_asistencia,
                    (COUNT(p.id) - COUNT(a.id)) as total_postulantes_faltantes
                FROM
                    postulantes p
                LEFT JOIN
                    asistencias a ON p.id = a.postulante_id
                WHERE
                    p.programacion_id = " . $programacion->id . "
                GROUP BY
                    p.aula
            ";
        }

        $asistencias =  DB::select($consultaSQL);
        return view('reporte.rpt_asistencia_resumen', compact('programacion','asistencias'));
    }
    public function eliminar($idAsistencia)
    {
        RegistroComida::find($idAsistencia)->delete();
    }



    public function reporte_postulanteX(Request $request)
    {
        $programacion = Programacion::where('estado', 1)
            ->first();

        $asistencias = Asistencia::with(['postulante', 'user'])
            ->whereHas('postulante', function ($query) use ($programacion) {
                $query->where('programacion_id', $programacion->id);
            })
            ->where('user_id', $request->user()->id)
            ->orderBy('fecha_asistencia', 'desc')->get();
        return $asistencias;
    }

    public function reporte_asistencias_deletes(Request $request)
    {
        $programacion = Programacion::where('estado', 1)
            ->first();
        $asistencias = Asistencia::onlyTrashed()
            ->with(['postulante', 'user'])
            ->whereHas('postulante', function ($query) use ($programacion) {
                $query->where('programacion_id', $programacion->id);
            })
            ->orderBy('fecha_asistencia', 'desc')->get();
        return $asistencias;
    }

    public function resumen_comidas_listar()
    {
        $datos = DB::table('registro_comidas')
            ->join('tipo_comidas', 'registro_comidas.tipo_comida_id', '=', 'tipo_comidas.id')
            ->join('estudiantes', 'registro_comidas.persona_id', '=', 'estudiantes.persona_id') // <- filtro por estudiantes
            ->select(
                DB::raw('DAYNAME(registro_comidas.fecha) as dia'),
                DB::raw('DATE_FORMAT(registro_comidas.fecha, "%d/%m/%Y") as fecha'),
                DB::raw('SUM(CASE WHEN tipo_comidas.id = 1 THEN 1 ELSE 0 END) as desayuno'),
                DB::raw('SUM(CASE WHEN tipo_comidas.id = 2 THEN 1 ELSE 0 END) as ref1'),
                DB::raw('SUM(CASE WHEN tipo_comidas.id = 3 THEN 1 ELSE 0 END) as almuerzo'),
                DB::raw('SUM(CASE WHEN tipo_comidas.id = 4 THEN 1 ELSE 0 END) as ref2'),
                DB::raw('SUM(CASE WHEN tipo_comidas.id = 5 THEN 1 ELSE 0 END) as cena'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('registro_comidas.fecha')
            ->orderBy('registro_comidas.fecha', 'desc')
            ->get();

        return $datos;
    }

    public function update_registro_comidas(Request $request, $id)
    {
        $registro = RegistroComida::findOrFail($id);


        $fecha = Carbon::createFromFormat('d/m/Y, H:i:s', $request->hora_registro)
            ->setTimezone(config('app.timezone'))
            ->toDateTimeString();

            // 4. Actualizar el modelo
            $registro->update([
                'hora_registro' => $fecha,
                'fecha' => $fecha,
            ]);

            return response()->json(['message' => 'Registro actualizado correctamente.']);


    }
    public function reporte_asistencias_comidas($fecha, $tipo_comida_id){
        $estudiantes = DB::select("
            SELECT rc.id AS registro_comida_id, p.id AS persona_id, e.grado, e.seccion,
                   p.nro_documento, p.nombres, p.apellido_paterno, p.apellido_materno, p.activo_comida, rc.fecha, rc.hora_registro
            FROM estudiantes e
            JOIN personas p ON e.persona_id = p.id
            JOIN registro_comidas rc ON e.persona_id = rc.persona_id
                AND rc.fecha = ?
                AND rc.tipo_comida_id = ?
            ORDER BY e.grado, e.seccion, p.apellido_paterno, p.apellido_materno;
        ", [$fecha, $tipo_comida_id]);
        return $estudiantes;
    }
    public function PDF_asistencia_consumio($tipoComida, $fecha)
    {
        try {
            // Validar y convertir la fecha
            $fecha = Carbon::createFromFormat('Y-m-d', $fecha)->toDateString();

            // Ejecutar consulta SQL pura
            $estudiantes = DB::select("
            SELECT p.id AS persona_id, e.grado, e.seccion,
                   p.nro_documento, p.nombres, p.apellido_paterno, p.apellido_materno, p.activo_comida, rc.fecha, rc.hora_registro
            FROM estudiantes e
            JOIN personas p ON e.persona_id = p.id
            JOIN registro_comidas rc ON e.persona_id = rc.persona_id
                AND rc.fecha = ?
                AND rc.tipo_comida_id = ?
            ORDER BY e.grado, e.seccion, p.apellido_paterno, p.apellido_materno;
        ", [$fecha, $tipoComida]);

            // Verificar si hay datos
            if (empty($estudiantes)) {
                return response()->json(['error' => 'No se encontraron estudiantes que consumieron comida.'], 404);
            }

            // Generar PDF
            $pdf = PDF::loadView('reportes.reporte_consumieron', compact('estudiantes', 'fecha', 'tipoComida'));

            return $pdf->stream('reporte_consumieron.pdf');

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Formato de fecha inválido o error interno',
                'detalle' => $e->getMessage()
            ], 400);
        }
    }
    public function PDF_asistencia_noconsumio($tipoComida, $fecha)
    {
        try {
            // Validar y convertir la fecha
            $fecha = Carbon::createFromFormat('Y-m-d', $fecha)->toDateString();

            // Ejecutar consulta SQL pura
            $estudiantes = DB::select("
            SELECT p.id AS persona_id, e.grado, e.seccion,
                   p.nro_documento, p.nombres, p.apellido_paterno, p.apellido_materno, p.activo_comida
            FROM estudiantes e
            JOIN personas p ON e.persona_id = p.id
            LEFT JOIN registro_comidas rc ON e.persona_id = rc.persona_id
                AND rc.fecha = ?
                AND rc.tipo_comida_id = ?
            WHERE rc.id IS NULL
            ORDER BY e.grado, e.seccion, p.apellido_paterno, p.apellido_materno;
        ", [$fecha, $tipoComida]); // Se pasan los valores para evitar inyección SQL

            // Verificar si hay datos
            if (empty($estudiantes)) {
                return response()->json(['error' => 'No se encontraron estudiantes que no consumieron comida.'], 404);
            }

            // Generar PDF
            $pdf = PDF::loadView('reportes.reporte_no_consumieron', compact('estudiantes', 'fecha', 'tipoComida'));

            return $pdf->stream('reporte_no_consumieron.pdf');

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Formato de fecha inválido o error interno',
                'detalle' => $e->getMessage()
            ], 400);
        }
    }

    public function PDF_asistencia_reporte_consumo_resumen($fecha_inicio, $fecha_fin) {
        // Validar y convertir la fecha
        $fecha_inicio = Carbon::createFromFormat('Y-m-d', $fecha_inicio)->toDateString();
        $fecha_fin = Carbon::createFromFormat('Y-m-d', $fecha_fin)->toDateString();

        $datos = DB::table('registro_comidas')
            ->join('tipo_comidas', 'registro_comidas.tipo_comida_id', '=', 'tipo_comidas.id')
            ->join('estudiantes', 'registro_comidas.persona_id', '=', 'estudiantes.persona_id') // <- filtro por estudiantes
            ->select(
                DB::raw('DAYNAME(registro_comidas.fecha) as dia'),
                DB::raw('DATE_FORMAT(registro_comidas.fecha, "%d/%m/%Y") as fecha'),
                DB::raw('SUM(CASE WHEN tipo_comidas.id = 1 THEN 1 ELSE 0 END) as desayuno'),
                DB::raw('SUM(CASE WHEN tipo_comidas.id = 2 THEN 1 ELSE 0 END) as ref1'),
                DB::raw('SUM(CASE WHEN tipo_comidas.id = 3 THEN 1 ELSE 0 END) as almuerzo'),
                DB::raw('SUM(CASE WHEN tipo_comidas.id = 4 THEN 1 ELSE 0 END) as ref2'),
                DB::raw('SUM(CASE WHEN tipo_comidas.id = 5 THEN 1 ELSE 0 END) as cena'),
                DB::raw('COUNT(*) as total')
            )
            ->whereBetween('registro_comidas.fecha', [$fecha_inicio, $fecha_fin])
            ->groupBy('registro_comidas.fecha')
            ->orderBy('registro_comidas.fecha', 'asc')
            ->get();


        // Generar la vista y convertirla en PDF
        $html = view('reportes.PDF_reporte_comidas', compact('datos'));
        return Pdf::loadHTML($html)->stream();
    }
    public function PDF_asistencia_resumen($fecha)
    {
        // Validar y convertir la fecha
        $fecha = Carbon::createFromFormat('Y-m-d', $fecha)->toDateString();

        $estudiantes = DB::table('estudiantes')
            ->join('personas', 'estudiantes.persona_id', '=', 'personas.id')
           // ->leftJoin('registro_comidas', 'personas.id', '=', 'registro_comidas.persona_id')
            ->leftJoin('registro_comidas', function ($join) use ($fecha) {
                $join->on('personas.id', '=', 'registro_comidas.persona_id')
                    ->whereDate('registro_comidas.fecha', $fecha); // Filtra solo el día actual
            })
            ->leftJoin('tipo_comidas', 'registro_comidas.tipo_comida_id', '=', 'tipo_comidas.id')
            ->select(
                'estudiantes.grado',
                'estudiantes.seccion',
                'personas.nombres',
                'personas.apellido_paterno',
                'personas.apellido_materno',
                'personas.sexo',
                'personas.activo_comida',
                DB::raw('SUM(CASE WHEN tipo_comidas.id = "1" THEN 1 ELSE 0 END) as desayuno'),
                DB::raw('SUM(CASE WHEN tipo_comidas.id = "2" THEN 1 ELSE 0 END) as ref1'),
                DB::raw('SUM(CASE WHEN tipo_comidas.id = "3" THEN 1 ELSE 0 END) as almuerzo'),
                DB::raw('SUM(CASE WHEN tipo_comidas.id = "4" THEN 1 ELSE 0 END) as ref2'),
                DB::raw('SUM(CASE WHEN tipo_comidas.id = "5" THEN 1 ELSE 0 END) as cena')
            )
            ->whereIn('estudiantes.grado', ['3', '4', '5'])
            ->groupBy('estudiantes.grado', 'estudiantes.seccion', 'personas.nombres', 'personas.apellido_paterno', 'personas.apellido_materno', 'personas.sexo', 'personas.activo_comida')
            ->orderBy('estudiantes.grado')
            ->orderBy('estudiantes.seccion')
            ->orderBy('personas.apellido_paterno')
            ->get()
            ->groupBy(function($item) {
                return $item->grado . '-' . $item->seccion;
            });

        $html = view('reportes.PDF_asistencia_resumen', compact('estudiantes', 'fecha'));
        return Pdf::loadHTML($html)->stream();
    }
    /*
    public function PDF_asistencia_resumen()
    {
        $programacion = Programacion::where('estado', 1)
            ->first();

        if($programacion) {
            $consultaSQL = "
                SELECT
                    p.aula,
                    COUNT(p.id) as total_postulantes_habilitados,
                    COUNT(a.id) as total_postulantes_con_asistencia,
                    (COUNT(p.id) - COUNT(a.id)) as total_postulantes_faltantes,
                    SUM(CASE WHEN a.dj = 1 THEN 1 ELSE 0 END) AS total_dj
                FROM
                    postulantes p
                LEFT JOIN
                    asistencias a ON p.id = a.postulante_id
                WHERE
                    p.programacion_id = " . $programacion->id . "
                GROUP BY
                    p.aula
            ";
        }

        $asistencias =  DB::select($consultaSQL);

        $html = view('reportes.PDF_asistencia_resumen', compact('programacion','asistencias'));
        return Pdf::loadHTML($html)->stream();
    }
    */
}
