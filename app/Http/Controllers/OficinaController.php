<?php

namespace App\Http\Controllers;

use App\Models\Expediente;
use App\Models\MovimientoExpediente;
use App\Models\Oficina;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\DataTables;

class OficinaController extends Controller
{
    public function index()
    {
        return DataTables::of(DB::table('oficinas'))
            ->addColumn('action', fn($row) => '<a  class="button has-text-black eliminar-categoria is-danger is-inline px-2 py-1" title="Eliminar categoria"><i class="fas fa-remove"></i></a>'
            )
            ->rawColumns(['action'])
            ->make(true);
    }

    public function destroy(string $id)
    {
        return Oficina::destroy($id);
    }

    public function store(Request $request)
    {
        $oficina = new Oficina();
        $oficina->descripcion = $request->input('descripcion');
        $oficina->save();
        return $oficina;
    }
    public function movimiento_expediente($id, Request $request) {
        $expediente = Expediente::find($id);
        $expediente->oficina_id = $request->get('oficina_id');
        $expediente->fecha_derivado = now();
        $expediente->detalle_derivado = $request->get('detalle_derivado');
        $expediente->save();
    }
}
