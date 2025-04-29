<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use App\Models\MovimientoBien;
use App\Models\Persona;
use App\Models\Prestamo;
use App\Models\Bien;
use App\Models\Reposicion;
use App\Models\Ubicacion;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

class BienController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $query = DB::table('bienes')->orderBy('id', 'desc');

        // Aplicar filtro por marca si se proporciona
        if ($request->has('marca')) {
            $query->where('marca', $request->marca);
        }

        return Datatables::of($query)
            ->addIndexColumn()
            ->addColumn('action', function ($row) use ($request) {
                return '<a class="button has-text-black edit-producto is-warning is-inline px-2 py-1 mr-1" ' . ($request->user()->hasRole('admin') ? '' : 'disabled') . ' title="Editar producto"><i class="fas fa-edit"></i></a>' .

                    '<a class="button has-text-black delete-producto is-danger is-inline px-2 py-1" title="Eliminar bien"><i class="fas fa-remove"></i></a>';
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $producto = new Bien();
        $producto->codigo_patrimonial = $request->get('codigo_patrimonial');
        $producto->codigo_interno = $request->get('codigo_interno');
        $producto->nombre = $request->get('nombre');
        $producto->marca = $request->get('marca');
        $producto->modelo = $request->get('modelo');
        $producto->serie = $request->get('serie');
        $producto->color = $request->get('color');
        $producto->estado = $request->get('estado');
        $producto->situacion = $request->get('situacion');
        $producto->detalle = $request->get('detalle');
        $producto->observacion = $request->get('observacion');
        $producto->ubicacion_id = $request->get('ubicacion_id');
        $producto->comentario = $request->get('comentario');
        $producto->propiedad = $request->get('propiedad');
        $producto->save();

        return $producto;
    }

    public function registro_rapido_bien($persona_id, Request $request)
    {
        $producto = new Bien();
        $producto->codigo_patrimonial = time();

        // Verifica si el nombre del bien es "OTRO" y usa el nombre personalizado si está disponible
        if ($request->get('nombre_bien') === 'OTRO' && $request->has('otro_nombre_bien')) {
            $producto->nombre = $request->get('otro_nombre_bien');
        } else {
            $producto->nombre = $request->get('nombre_bien');
        }

        $producto->marca = $request->get('marca');
        $producto->serie = $request->get('serie');
        $producto->situacion = 'U';
        $producto->propiedad = 'PERSONAL';
        $producto->save();

        return $this->asignar_producto($persona_id, $producto->id, $request);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Bien::find($id);
    }


    public function buscarXCodigo($codigo_bien)
    {
        return Bien::where('codigo_patrimonial', $codigo_bien)->first();
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
        $producto = Bien::findOrFail($id);
        $producto->codigo_patrimonial = $request->get('codigo_patrimonial');
        $producto->codigo_interno = $request->get('codigo_interno');
        $producto->nombre = $request->get('nombre');
        $producto->marca = $request->get('marca');
        $producto->modelo = $request->get('modelo');
        $producto->serie = $request->get('serie');
        $producto->color = $request->get('color');
        $producto->estado = $request->get('estado');
        $producto->situacion = $request->get('situacion');
        $producto->detalle = $request->get('detalle');
        $producto->observacion = $request->get('observacion');
        $producto->ubicacion_id = $request->get('ubicacion_id');
        $producto->comentario = $request->get('comentario');
        $producto->propiedad = $request->get('propiedad');
        $producto->save();
    }

    public function updateLight(Request $request) {
        $producto = Bien::findOrFail($request->get('bien_id'));
        $producto->codigo_patrimonial = $request->get('codigo_patrimonial');
        $producto->marca = $request->get('marca');
        $producto->serie = $request->get('serie');
        $producto->save();
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        MovimientoBien::where('bien_id', $id)->delete();
        Prestamo::where('bien_id', $id)->delete();
        Bien::destroy($id);
    }

    /* public function reporte(Request $request) {
         $productos = Producto::all();
         $contenido = view('reportes.pdf_productos', compact('productos'));
         $pdf = Pdf::loadHTML($contenido)->setPaper('A4', 'landscape');
         return $pdf->stream();
     }*/

    public function registrar_salida($codigo)
    {
        //Primeramente buscamos el bien
        $bien = Bien::where('codigo_patrimonial', $codigo)->first();
        $prestamo = Prestamo::where('bien_id', $bien->id)->first();

        return response()->json([
            'bienes' => $this->prestamos($prestamo->persona_id),
            'persona' => Persona::find($prestamo->persona_id),
        ]);


        /*  $prestamo = Prestamo::where('bien_id', $bien->id)->first();

          if($prestamo) {
              $persona = Persona::find($prestamo->persona_id);

              $moviento = new MovimientoBien();
              $moviento->bien_id = $bien->id;
              $moviento->fecha_movimiento = now();
              $moviento->tipo_movimiento = 'salida';
              $moviento->save();*/
//            return response()->json([
//                'persona' => $persona,
//                'movimiento' => $movientophp,
        /*            ]);
                } else {

                    return 1;
                }*/

    }

    public function reporte(Request $request)
    {

        $personas = Persona::with('estudiantes')->where('id', 301)->get();
        $contenido = view('reportes.pdf_productos', compact('personas'));
        $pdf = Pdf::loadHTML($contenido)->setPaper('A4', 'portrait');
        return $pdf->stream();
    }

    public function reporte_salida(Request $request)
    {
        $personas = Persona::with('estudiantes')->where('nro_documento', 61306952)->get();
        $contenido = view('reportes.pdf_salida', compact('personas'));
        $pdf = Pdf::loadHTML($contenido)->setPaper('A4', 'portrait');
        return $pdf->stream();
    }

    public function search(Request $request)
    {
        $searchTerm = $request->input('searchTerm');

        $productos = Bien::where('disponible', true)
            ->where(function ($query) use ($searchTerm) {
                $query->where('serie', 'like', "%$searchTerm%")
                    ->orWhere('nombre', 'like', "%$searchTerm%")
                    ->orWhere('modelo', 'like', "%$searchTerm%")
                    ->orWhere('codigo_patrimonial', 'like', "%$searchTerm%");
            })
            ->get();

        return $productos;
    }

    public function prestamos($persona_id)
    {
        return Prestamo::join('bienes', 'prestamos.bien_id', '=', 'bienes.id')
            ->where('prestamos.persona_id', $persona_id)
            ->where('prestamos.activo', true)
            ->select('prestamos.id as prestamo_id', 'bienes.*', 'prestamos.*', 'bienes.id as producto_id')
            ->get();
    }

    public function ubicaciones()
    {
        return Ubicacion::all();
    }

    public function reposiciones($persona_id)
    {
        return Reposicion::join('prestamos', 'reposiciones.prestamo_id', '=', 'prestamos.id')
            ->join('bienes', 'bienes.id', '=', 'prestamos.bien_id')
            ->select(
                'reposiciones.id as reposicion_id',
                'motivo_reposicion as reposicion_motivo',
                'bienes.codigo_patrimonial',
                'bienes.nombre as producto_nombre',
                'bienes.marca as producto_marca',
                'bienes.modelo as producto_modelo',
                'bienes.serie as producto_serie',
                'reposiciones.estado as reposicion_estado'
            )->where('reposiciones.estado', 'pendiente')
            ->where('prestamos.persona_id', $persona_id)
            ->get();
    }

    public function asignar_producto($persona_id, $producto_id, Request $request)
    {

        $prestamo = new Prestamo();
        $prestamo->persona_id = $persona_id;
        $prestamo->bien_id = $producto_id;
        $prestamo->fecha_prestamo = now();
        $prestamo->motivo = $request->has('motivo') ? $request->get('motivo') : null;
        $prestamo->save();

        // Actualizar el estado de disponibilidad del producto a "no disponible"
        $producto = Bien::find($producto_id);
        $producto->disponible = false;
        $producto->save();

        return $this->prestamos($persona_id);
    }

    public function liberar_reposicion(Request $request)
    {
        $reposicion = Reposicion::find($request->get('reposicion_id'));
        $reposicion->estado = 'completado';
        $reposicion->fecha_reposicion = now();
        $reposicion->save();


        $prestamo = Prestamo::find($reposicion->prestamo_id)->first();

        return $this->reposiciones($prestamo->persona_id);
    }

    public function registrar_reposicion(Request $request)
    {

        $p = Prestamo::find($request->get('prestamoId'));
        if ($request->get('reposicion') === "si") {
            $reposicion = new Reposicion();
            $reposicion->prestamo_id = $request->get('prestamoId');
            $reposicion->motivo_reposicion = $request->get('motivo');
            $reposicion->estado = "pendiente";
            $reposicion->save();
        } else {
            $p->fecha_devolucion = now();
            $producto = Bien::find($p->bien_id);
            $producto->disponible = true;
            $producto->save();
        }

        $p->activo = false;
        $p->save();

        return response()->json([
            'prestamos' => $this->prestamos($request->get('persona_id')),
            'reposiciones' => $this->reposiciones($request->get('persona_id')),
        ]);
    }

    public function rpt_pdf()
    {
        $bienes = Bien::all();
        $pdf = Pdf::loadHTML(view('reportes.pdf_bienes', compact('bienes')))
            ->setPaper('A4', 'landscape');
        return $pdf->stream();
    }

    public function rpt_barcode()
    {
        $bienes = Bien::all();
        $pdf = Pdf::loadHTML(view('reportes.pdf_barcode', compact('bienes')))
            ->setPaper('A4', 'portrait');
        return $pdf->stream();
    }

    /* public function api_persona_bienes($dni) {
         $persona = Persona::with('estudiante')->where('nro_documento', $dni)->first();
         return response()->json([
             'persona' => $persona,
             'asignaciones' => $this->prestamos($persona->id),
         ]);
     }*/


    public function api_bien_persona($codigo_bien)
    {
        $bien = Bien::where('codigo_patrimonial', $codigo_bien)->first();
        return $bien;
    }

    public function rpt_prestamos() {
        return 1;
    }
    public function PDF_rpt_salida_bienes_estudiantes(Request $request)
    {

        $date_start = Carbon::parse($request->input('date_start'))->startOfDay();
        $date_end = Carbon::parse($request->input('date_end'))->endOfDay();

        // Obtener grados y secciones de la solicitud desde el parámetro "gs"
        $gs = $request->input('gs'); // Se espera un string con el formato "grado1seccion1,grado2seccion2,..."
        $grados_secciones = explode(',', $gs); // Convertir el string en un array de grados y secciones


        $query = Estudiante::with([
            'persona.movimientos' => function ($query) use ($date_start, $date_end) {
                $query->whereBetween('fecha_movimiento', [$date_start, $date_end]);
            },
            'persona.movimientos.bien'
        ]);

        // Aplicar filtro por grados y secciones
        foreach ($grados_secciones as $gs) {
            $grado = $gs[0]; // El primer carácter es el grado
            $secciones = substr($gs, 1); // Los caracteres restantes son las secciones

            // Aplicar filtro por grado
            $query->orWhere('grado', $grado);

            // Aplicar filtro por secciones si están presentes
            if ($secciones) {
                $query->whereIn('seccion', str_split($secciones));
            }
        }

        $registros = $query->get()
        ->map(function ($estudiante) {
            return [
                'nombres' => $estudiante->persona->nombres,
                'apellidos' => $estudiante->persona->apellido_paterno . ' ' . $estudiante->persona->apellido_materno,
                'grado' => $estudiante->grado,
                'seccion' => $estudiante->seccion,
                'movimientos' => $estudiante->persona->movimientos->map(function ($movimiento) {
                    $bien = $movimiento->bien;
                    return [
                        'tipo_movimiento' => $movimiento->tipo_movimiento,
                        'fecha_movimiento' => $movimiento->fecha_movimiento,
                        'nombre_bien' => $bien ? $bien->nombre : null,
                        'marca_bien' => $bien ? $bien->marca : null,
                        'modelo_bien' => $bien ? $bien->modelo : null,
                        'serie_bien' => $bien ? $bien->serie : null,
                    ];
                })->toArray()
            ];
        })->toArray();

        $HTML = PDF::loadHTML(view('reportes.pdf_salida_bienes_estudiantes',
            compact('registros', 'date_start', 'date_end'),
        ))
            ->setPaper('A4', 'portrait');

        return $HTML->stream();
    }
}
