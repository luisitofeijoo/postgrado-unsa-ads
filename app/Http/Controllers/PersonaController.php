<?php

namespace App\Http\Controllers;

use App\Models\Bien;
use App\Models\Estudiante;
use App\Models\Persona;
use App\Models\RegistroComida;
use Carbon\Carbon;
use Faker\Provider\Person;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Sleep;
use Illuminate\Support\Str;
use Yajra\DataTables\Facades\DataTables;

class PersonaController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function listar_estudiantes_para_agregar($fecha, $tipoComida)
    {
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


        return $estudiantes;
    }

    public function add_personas_comidas_create(Request $request) {

        $data = $request->validate([
            'personas'       => 'required|array',
            'personas.*'     => 'integer',
            'fecha'          => 'required|date_format:Y-m-d',
            'tipo_comida_id' => 'required|integer'
        ]);

        $personas = $data['personas'];
        $fecha = $data['fecha'];
        $tipoComidaId = $data['tipo_comida_id'];

        foreach ($personas as $personaId) {
            // Utilizamos create() para cada registro.
            // Si deseas que 'fecha' se guarde según lo enviado en el request, lo estableces
            $asistencia = RegistroComida::create([
                'persona_id'     => $personaId,
                'tipo_comida_id' => $tipoComidaId,
                'fecha'          => $fecha,     // O puedes utilizar now() si prefieres la fecha actual
                'hora_registro'  => Carbon::parse($fecha)->setTime(0, 0, 0)
            ]);
            $registrosCreados[] = $asistencia;
        }
    }
    public function index(Request $request)
    {

     //   $pageSize = $this->paginateSize(request()->input('pageSize'));

        return Datatables::of(DB::table('personas')->orderBy('id', 'DESC')
            ->select([
                'personas.id',
                'personas.nro_documento',
                'personas.nombres',
                'personas.apellido_paterno',
                'personas.apellido_materno',/*
                'estudiantes.grado',
                'estudiantes.seccion',
                'estudiantes.ano_ingreso',*/
            ]))
            ->addIndexColumn()
            ->addColumn('action', fn($row) =>
                '<a  class="button has-text-black edit-persona is-info is-inline px-2 py-1 mr-1" '.($request->user()->hasRole('admin') ? '': 'disabled').' title="Editar persona"><i class="fas fa-edit"></i></a>'.
                '<a  class="button has-text-black add-bien is-primary is-inline px-2 py-1 mr-1" '.($request->user()->hasRole('admin') ? '': 'disabled').' title="Agregar bien"><i class="fas fa-plus"></i></a>'.
                '<a  class="button has-text-black view-persona is-warning is-inline px-1 py-1 mr-1" title="Ver persona"><i class="fas fa-eye"></i></a>'.
                '<a  class="button has-text-black delete-persona is-danger is-inline px-2 py-1" '.($request->user()->hasRole('admin') ? '': 'disabled').' title="Eliminar persona"><i class="fas fa-remove"></i></a>'
            )
            ->filterColumn('nro_documento', function ($query, $keyword) {
                $query->whereRaw("LOWER(personas.nro_documento) LIKE ?", ["%$keyword%"]);
            })
            ->filterColumn('apellido_paterno', function ($query, $keyword) {
                $query->whereRaw("LOWER(personas.apellido_paterno) LIKE ?", ["%$keyword%"]);
            })
            ->filterColumn('apellido_materno', function ($query, $keyword) {
                $query->whereRaw("LOWER(personas.apellido_materno) LIKE ?", ["%$keyword%"]);
            })
            ->filterColumn('nombres', function ($query, $keyword) {
                $query->whereRaw("LOWER(personas.nombres) LIKE ?", ["%$keyword%"]);
            })
            ->rawColumns(['action'])
            ->make(true);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function bienes($nro_documento, BienController $bienController)
    {
        try {
            // Intentar recuperar la persona
            $persona = Persona::where('nro_documento', $nro_documento)->with('estudiante')->first();

            // Verificar si la persona se encontró
            if($persona) {
                // Si se encontró, obtener los préstamos usando el método prestamos del controlador BienController
                $bienes = $bienController->prestamos($persona->id);

                // Retornar los datos
                return [
                    'persona' => $persona,
                    'bienes' => $bienes,
                ];
            } else {
                // Si la persona no se encontró, retornar un mensaje de error o lo que sea adecuado para tu aplicación
                return response()->json(['message' => 'Persona no encontrada'], 404);
            }
        } catch (\Exception $e) {
            // Manejar la excepción, por ejemplo, puedes registrar el error en un archivo de registro o retornar un mensaje de error genérico
            return response()->json(['message' => 'Error al procesar la solicitud'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $persona = new Persona();
        $persona->nro_documento = $request->input('nro_documento');
        $persona->nombres = $request->input('nombres');
        $persona->apellido_paterno = $request->input('apellido_paterno');
        $persona->apellido_materno = $request->input('apellido_materno');
        $persona->direccion = $request->input('direccion');
        $persona->sexo = $request->input('sexo');
        $persona->estado_civil = $request->input('estado_civil');
        $persona->celular = $request->input('celular');
        $persona->fecha_nacimiento  = $request->input('fecha_nacimiento');
        $persona->lugar_domicilio  = $request->input('lugar_domicilio');
        $persona->info_pareja  = $request->input('info_pareja');
        if($request->hasFile("avatar")) {
            $archivo = $request->file('avatar');
            $nombreArchivo = Str::uuid() . '.' . $archivo->getClientOriginalExtension();
            $archivo->move(public_path('img/personas'), $nombreArchivo);
            $persona->avatar = $nombreArchivo;
        }
        $persona->save();

        return $persona->avatar;
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //return Persona::find($id);
        return Persona::where('id', $id)->with('estudiante')->first();
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        $persona = Persona::findOrFail($id);
        $persona->nombres = $request->input('nombres');
        $persona->apellido_paterno = $request->input('apellido_paterno');
        $persona->apellido_materno = $request->input('apellido_materno');
        $persona->direccion = $request->input('direccion');
        $persona->sexo = $request->input('sexo');
        $persona->estado_civil = $request->input('estado_civil');
        $persona->celular = $request->input('celular');
        $persona->fecha_nacimiento  = $request->input('fecha_nacimiento') ?? null;
        $persona->lugar_domicilio  = $request->input('lugar_domicilio');
        $persona->info_pareja  = $request->input('info_pareja');

        if($request->hasFile("avatar")) {
            $archivo = $request->file('avatar');
            $nombreArchivo = Str::uuid() . '.' . $archivo->getClientOriginalExtension();
            $archivo->move(public_path('img/personas'), $nombreArchivo);
            $persona->avatar = $nombreArchivo;
        }

        $persona->save();


        // Verificar si existen datos de estudiante en la petición
        if ($request->has('estudiante')) {
            $datosEstudiante = $request->input('estudiante');
            // Busca si ya existe un registro de estudiante para esta persona
            $estudiante = Estudiante::where('persona_id', $persona->id)->first();

            if ($estudiante) {
                // Si existe, actualiza los datos del estudiante
                $estudiante->grado = $datosEstudiante['grado'] ?? $estudiante->grado;
                $estudiante->seccion = $datosEstudiante['seccion'] ?? $estudiante->seccion;
                // Agrega aquí otros campos del estudiante que puedas recibir
                $estudiante->save();
            } else {
                // Si no existe, crea un nuevo registro de estudiante
                $nuevoEstudiante = new Estudiante();
                $nuevoEstudiante->persona_id = $persona->id; // Asocia el estudiante a la persona
                $nuevoEstudiante->grado = $datosEstudiante['grado'] ?? null;
                $nuevoEstudiante->seccion = $datosEstudiante['seccion'] ?? null;
                // Agrega aquí otros campos del estudiante que puedas recibir
                $nuevoEstudiante->save();
            }
        }

        return $persona->avatar;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $persona = Persona::find($id)->delete();
    }


    public function reporte(Request $request)
    {
        $selectItems = explode(',', $request->input('selected'));
        $personas = Persona::whereIn('id', $selectItems)->get();
        $contenido = view('reportes.pdf_fotocheck', compact('personas'));
        $pdf = Pdf::loadHTML($contenido);
        return $pdf->stream();
    }
}
