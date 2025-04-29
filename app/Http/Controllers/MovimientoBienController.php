<?php

namespace App\Http\Controllers;

use App\Models\Bien;
use App\Models\MovimientoBien;
use App\Models\Persona;
use App\Models\Prestamo;
use Faker\Provider\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Sleep;
use Carbon\Carbon;

class MovimientoBienController extends Controller
{
    public function mostrar_registros()
    {
        return MovimientoBien::with(['persona', 'bien'])->orderBy('created_at', 'desc')->limit(100)->get();
    }

    public function actualizar_registro(Request $request)
    {
        $movimiento = MovimientoBien::find($request->get('id'));
        $movimiento->tipo_movimiento = $request->get('tipo_movimiento');
        $movimiento->save();
    }
    public function api_registro_bien(Request $request)
    {
        $mov = new MovimientoBien();
        $mov->bien_id = $request->input('bien_id');
        $mov->persona_id = $request->input('persona_id');
        $mov->fecha_movimiento = now();
        $mov->tipo_movimiento = $request->input('tipo_movimiento');
        $mov->save();
    }

    public function delete($id) {
        MovimientoBien::find($id)->delete();
    }
    public function api_movimientos(){
        return MovimientoBien::all();
    }

    public function api_registro_bienes_persona(Request $request)
    {
        $movimientos = [];

        $id_bienes = $request->input('id_bienes');
        $id_persona = $request->input('id_persona');
        $tipo_movimiento = $request->input('tipo_movimiento');

        $existentes = MovimientoBien::whereIn('bien_id', $id_bienes)
            ->whereDate('fecha_movimiento', Carbon::now()->toDateString())
            ->where('tipo_movimiento', $tipo_movimiento)
            ->pluck('bien_id')
            ->toArray();

        foreach(array_diff($id_bienes, $existentes) as $existente) {
            $movimiento = new MovimientoBien();
            $movimiento->bien_id = $existente;
            $movimiento->persona_id = $id_persona;
            $movimiento->fecha_movimiento = now();
            $movimiento->tipo_movimiento = $tipo_movimiento;
            $movimiento->save();

            $movimientos[] = $movimiento;
        }

        return response()->json($movimientos);
    }

    public function api_registro_bien_persona(Request $request)
    {
        $statusCode = 200; // Código de estado por defecto
        $movimiento = null;

        // Validación de datos de entrada
        $request->validate([
            'codigo_bien' => 'required|string',
            'tipo_movimiento' => 'required|string',
        ]);

        // Obtener la fecha actual
        $fecha_movimiento = Carbon::now()->toDateString();

        // Obtener el código del bien y el tipo de movimiento del request
        $codigo_bien = $request->input('codigo_bien');
        $tipo_movimiento = $request->input('tipo_movimiento');

        // Buscar el bien por su código patrimonial
        $bien = Bien::where('codigo_patrimonial', $codigo_bien)->firstOrFail();

        // Buscar un préstamo activo para este bien
        $prestamo = Prestamo::where('bien_id', $bien->id)
            ->where('activo', true)
            ->with('persona.estudiante')
            ->first();

        // Verificar si se encontró un préstamo activo
        if (!$prestamo) {
            return response()->json([
                'message' => 'No se encontró una asignación activa para este bien.',
            ], 404);
        }

        // Verificar si ya existe un movimiento para este bien en la fecha especificada
        $existente_mov = MovimientoBien::where('bien_id', $prestamo->bien_id)
            ->whereDate('fecha_movimiento', $fecha_movimiento)
            ->where('tipo_movimiento', $tipo_movimiento)
            ->first();

        // Si ya existe un movimiento para este bien en la fecha especificada
        if (!$existente_mov && $bien->propiedad === 'PERSONAL') {

            // Iniciar una transacción de base de datos
            DB::beginTransaction();

            try {
                // Registrar el movimiento del bien
                $movimiento = new MovimientoBien();
                $movimiento->bien_id = $prestamo->bien_id;
                $movimiento->persona_id = $prestamo->persona_id;
                $movimiento->fecha_movimiento = now();
                $movimiento->tipo_movimiento = $tipo_movimiento;
                $movimiento->save();

                // Commit de la transacción
                $message = 'Registro autorizado! <strong>'.Carbon::createFromFormat('Y-m-d H:i:s', $movimiento->fecha_movimiento)->format('d/m/Y H:i:s').'</strong>';
                DB::commit();

            } catch (\Exception $e) {
                // Rollback de la transacción en caso de error
                DB::rollback();
                return response()->json([
                    'message' => 'Hubo un error al registrar el movimiento del bien.',
                    'error' => $e,
                ], 500);
            }

        } else {
            if($bien->propiedad === 'INSTITUCION') {
                $message = 'Bien perteneciente al COAR AREQUIPA, sin autorización de salida.';
                $statusCode = 500; // Código de estado de advertencia
            } else{
                $message = 'Este registro ya fue realizado - <strong>'.Carbon::createFromFormat('Y-m-d H:i:s', $existente_mov->fecha_movimiento)->format('d/m/Y H:i:s').'</strong>';
                $statusCode = 409; // Código de estado de advertencia
            }
        }

        // Devolver la respuesta
        return response()->json([
            'message' => $message,
            'status' => $statusCode,
            'bien' => $bien,
            'persona' => $prestamo->persona,
            'movimiento' => isset($movimiento)? $movimiento: $existente_mov,
        ]); // Devuelve el código de estado correspondiente
    }
}
