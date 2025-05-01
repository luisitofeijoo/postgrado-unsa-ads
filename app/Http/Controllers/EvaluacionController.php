<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
//use App\Http\Requests\StoreEvaluacionRequest; // Import the Form Request
use Illuminate\Http\Request;
use App\Models\Evaluacion;
use App\Models\Pregunta;
use App\Models\OpcionRespuesta; // Use the singular model name
use Illuminate\Support\Facades\DB; // Import DB facade
use Illuminate\Http\JsonResponse; // Import JsonResponse

class EvaluacionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // $request->validated() contains the data after passing all validation rules
        //$validatedData = $request->validated();

        // Use a database transaction to ensure atomicity
       // DB::beginTransaction();

        try {
            // 1. Create the main Evaluation
            // Assuming curso_id is nullable or handled elsewhere if not provided in frontend
            $evaluation = Evaluacion::create([
                'curso_id' => 1, // Adjust if curso_id is mandatory
                'titulo' => $request->titulo,
                'descripcion' => $request->descripcion,
                'tiempo' => $request->tiempo,
                // Laravel handles created_at and updated_at automatically
            ]);

            // 2. Loop through questions and create them
            foreach ($request->get('questions') as $questionData) {
                $question = $evaluation->preguntas()->create([
                    'tipo_pregunta_id' => $questionData['tipo_pregunta_id'],
                    'enunciado' => $questionData['enunciado'],
                    'puntaje' => $questionData['puntaje'],
                ]);

                if (!empty($questionData['opciones'])) {
                    foreach ($questionData['opciones'] as $optionData) {
                        $question->opciones()->create([
                            'texto_opcion' => $optionData['texto_opcion'],
                            'es_correcto' => $optionData['es_correcto'],
                        ]);
                    }
                }
            }



          //  DB::commit();

            // Return a success response
            return response()->json([
                'message' => 'Evaluación creada con éxito',
                'evaluation' => $evaluation // Optionally return the created evaluation data
            ], 201); // 201 Created status code

        } catch (\Exception $e) {
            // If any error occurs, rollback the transaction
            DB::rollback();

            // Log the error for debugging
            \Log::error('Error creating evaluation: ' . $e->getMessage(), ['exception' => $e]);

            // Return an error response
            return response()->json([
                'message' => 'Error al crear la evaluación',
                'error' => $e->getMessage() // Provide specific error message in development, maybe generic in production
            ], 500); // 500 Internal Server Error status code
        }
    }

        public function getEvaluacion(Evaluacion $evaluacionEstudiante): JsonResponse {


        $evaluacionEstudiante->load([
            'preguntas.opciones',
            'preguntas.tipoPregunta',
            // Potentially load previous answers if supporting resume
            // 'respuestasEstudiantes' // Assuming this relationship exists on EvaluacionEstudiante
        ]);


        /*return response()->json([
            'message' => 'Evaluación cargada exitosamente.',
            'evaluationAttempt' => $evaluacionEstudiante, // Includes start/end times if loaded
            'evaluation' => $evaluacionEstudiante->evaluacion, // The nested evaluation structure
        ]);*/

    }
}
