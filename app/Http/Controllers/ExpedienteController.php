<?php

namespace App\Http\Controllers;

use App\Models\Expediente;
use App\Models\Persona;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Calculation\MathTrig\Exp;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\DataTables;

class ExpedienteController extends Controller
{
    public function index(DataTables $dataTables)
    {

        // Generar la consulta con relaciones (sin forzar orderBy en la consulta base)
        $query = Expediente::with(['tipo_documento', 'oficina'])->orderBy('created_at', 'DESC');

        // Usar la instancia inyectada de DataTables para procesar la consulta
        return $dataTables->eloquent($query)
            ->addColumn('action', function ($row) {
                $buttons = '';

                // Verificar si la oficina existe y su id es diferente de 1
                if ($row->oficina->id == 1) {
                    $buttons .= '<a class="button has-text-black handle-derivar is-warning is-inline mr-2 pr-2 pl-2" title="Derivar expediente"><i class="fas fa-send"></i></a>';
                }
                $buttons .= '<a class="button has-text-black handle-ver is-primary is-inline mr-2 pr-2 pl-2" title="Visualizar expediente"><i class="fas fa-eye"></i></a>';
                $buttons .= '<a class="button has-text-black handle-eliminar is-danger is-inline mr-2 pr-2 pl-2" title="Eliminar expediente"><i class="fas fa-close"></i></a>';

                return $buttons;
            })
            ->make(true);
    }

    public function show(string $id)
    {
        return Expediente::with(['tipo_documento','oficina'])->find($id);
    }
    public function destroy(string $id)
    {
        return Expediente::find($id)->delete();
    }
    /*
     * Guardamos el expediente ingresado por mesa de partes
     * */
    public function create(Request $request)
    {
        try {
            $ultimoExpediente = Expediente::latest()->first();

// Si existe un registro, suma 1 al código; de lo contrario, asigna 1
            $codigo = $ultimoExpediente ? $ultimoExpediente->codigo + 1 : 1;

            $expediente = new Expediente([
                'tipo_persona' => $request->input('tipoPersona'),
                'nro_documento' => $request->input('nroDocumento'),
                'codigo' => $codigo,
                'nro_expediente' => $request->input('nro_expediente'),
                'nombre_razonsocial' => $request->input('nombre_razon_social'),
                'direccion' => $request->input('direccion'),
                'celular' => $request->input('celular'),
                'email' => $request->input('email'),
                'asunto' => $request->input('asunto'),
                'descripcion' => $request->input('descripcion'),
                'folio' => $request->input('folio'),
                //'url_drive' => $request->input('url_drive'),
                'tipo_documento_id' => $request->input('tipoDocumento')
            ]);

            /*  if ($request->hasFile('archivo')) {
                  $archivo = $request->file('archivo');
                  $nombreArchivo = Str::uuid() . '.' . $archivo->getClientOriginalExtension();
                  $archivo->move(public_path('expedientes/file'), $nombreArchivo);
                  $expediente->archivo = $nombreArchivo;

              }*/
            $expediente->save();
            $mensaje = 'El registro se realizó exitosamente.';

            return response()->json(['success' => true, 'message' => $mensaje, 'codigo' => $expediente->codigo]);
        } catch (\Exception $e) {
            $mensaje = 'Ocurrió un error al guardar el registro.';
            return $e;
            return response()->json(['success' => false, 'message' => $mensaje]);
        }
    }

    public function rpt_pdf() {
        $expedientes = Expediente::join('oficinas', 'expedientes.oficina_id', '=', 'oficinas.id')
            ->orderBy('created_at', 'desc')
            ->get();
        $pdf = Pdf::loadHTML(view('reportes.pdf_expedientes', compact('expedientes')))
            ->setPaper('A4', 'landscape');
        return $pdf->stream();
    }
}
