<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

class EstudianteController extends Controller
{
    public function index(Request $request)
    {
        return Datatables::of(DB::table('estudiantes')
            ->join('personas', 'estudiantes.persona_id', '=', 'personas.id')
            ->select([
                'personas.id',
                'personas.nro_documento',
                'personas.nombres',
                'personas.apellido_paterno',
                'personas.apellido_materno',
                'estudiantes.grado',
                'estudiantes.seccion',
                'estudiantes.ano_ingreso',
            ]))
            ->addIndexColumn()
            ->addColumn('action', fn($row) =>
                '<a  class="button has-text-black edit-persona is-info is-inline px-2 py-1 mr-1" '.($request->user()->hasRole('admin') ? '': 'disabled').' title="Editar persona"><i class="fas fa-edit"></i></a>'.
               // '<a  class="button has-text-black add-bien is-primary is-inline px-2 py-1 mr-1" '.($request->user()->hasRole('admin') ? '': 'disabled').' title="Agregar bien"><i class="fas fa-plus"></i></a>'.
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
            ->filterColumn('grado', function ($query, $keyword) {
                $query->whereRaw("LOWER(estudiantes.grado) LIKE ?", ["%$keyword%"]);
            })
            ->filterColumn('seccion', function ($query, $keyword) {
                $query->whereRaw("LOWER(estudiantes.seccion) LIKE ?", ["%$keyword%"]);
            })
            ->rawColumns(['action'])
            ->make(true);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $persona = Estudiante::find($id)->delete();
    }
}
