<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

//use App\Http\Requests\StoreEvaluacionRequest; // Import the Form Request
use App\Models\RespuestaEstudiante;
use Illuminate\Http\Request;
use App\Models\Evaluacion;
use App\Models\Pregunta;
use App\Models\OpcionRespuesta;

// Use the singular model name
use Illuminate\Support\Facades\DB;

// Import DB facade
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
// Import JsonResponse

class EvaluacionController extends Controller
{
    public function store(Request $request, $curso_id): JsonResponse
    {
        // $request->validated() contains the data after passing all validation rules
        //$validatedData = $request->validated();

        // Use a database transaction to ensure atomicity
        // DB::beginTransaction();

        try {
            // 1. Create the main Evaluation
            // Assuming curso_id is nullable or handled elsewhere if not provided in frontend
            $evaluation = Evaluacion::create([
                'curso_id' => $curso_id, // Adjust if curso_id is mandatory
                'user_id' => $request->user()->id,
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


              DB::commit();

            return response()->json([
                'message' => 'Evaluación creada con éxito',
                'evaluation' => $evaluation
            ], 201);



        } catch (\Exception $e) {

            DB::rollback();

            \Log::error('Error creating evaluation: ' . $e->getMessage(), ['exception' => $e]);

            return response()->json([
                'message' => 'Error al crear la evaluación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function saveAnswers(Request $request,  $evaluacion_id): JsonResponse
    {

        // --- WARNING: THIS METHOD SKIPS ALL VALIDATION AND PROPER ATTEMPT TRACKING ---
        // --- IT IS PROVIDED ONLY TO DEMONSTRATE SIMPLE INSERTION SYNTAX ---

        $answers = $request->input('respuestas', []); // Expecting an array named 'answers' in the request body

        // --- Schema Requirement Conflict ---
        // Your 'respuestas_estudiantes' table requires 'evaluacion_estudiantes_id'.
        // This simple method signature does not provide it.
        // For this minimal code, we'll need a placeholder or assume it's sent in the body.
        // Assuming the frontend sends 'evaluacion_estudiantes_id' in the body for simplicity here,
        // OR you have a default/placeholder ID you can use.
        // Let's assume it's in the body, though the signature doesn't reflect it.
      //  $evaluacionEstudianteId = $request->input('evaluacion_estudiantes_id', 1); // WARNING: Using a dummy/default ID (1) or expecting it in the body
        $evaluacionEstudianteId = $evaluacion_id;

            DB::beginTransaction();

        try {
            $respuestasToCreate = [];
            $submittedPreguntaIds = [];
            // 3. CALCULAR EL PUNTAJE TOTAL

            foreach ($answers as $answerData) {
                // WARNING: Directly using data from request without validation.
                // Expecting structure like { pregunta_id: 1, opcion_respuesta_id: 5, texto_respuesta: null }
                // or { pregunta_id: 2, opcion_respuesta_id: null, texto_respuesta: "Some text" }

                $preguntaId = $answerData['pregunta_id'] ?? null;
                $opcionId = $answerData['opcion_respuesta_id'] ?? null;
                $textoRespuesta = $answerData['texto_respuesta'] ?? null;

                // Basic check: ensure pregunta_id is present before adding
                if ($preguntaId === null) {
                    continue; // Skip entries without a question ID
                }

                $respuestasToCreate[] = [
                    'evaluacion_id' => $evaluacionEstudianteId, // --- WARNING: Using potentially invalid ID ---
                    'pregunta_id' => (int) $preguntaId, // Cast to int
                    'opcion_respuesta_id' => $opcionId !== null ? (int) $opcionId : null, // Cast or null
                    'texto_respuesta' => $textoRespuesta !== null ? (string) $textoRespuesta : null, // Cast or null
                    'fecha_respuesta' => now(), // Record current time
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $submittedPreguntaIds[] = $answerData['pregunta_id'];

            }

            if (!empty($respuestasToCreate)) {
                // WARNING: This inserts data without checking foreign key validity or any rules.
                // Foreign key errors will occur if IDs don't exist in the DB.
                RespuestaEstudiante::insert($respuestasToCreate);
            }

            // 4. CALCULAR EL PUNTAJE TOTAL
            $totalScore = 0;



            $uniqueSubmittedPreguntaIds = collect($submittedPreguntaIds)->unique()->filter(fn($id) => $id !== null)->values();


            $evaluationTemplate = Evaluacion::find($evaluacion_id);

            if (!$evaluationTemplate) {
                throw new \Exception("Plantilla de evaluación con ID {$evaluacion_id} no encontrada para calificar.");
            }


            $preguntasForScoring = $evaluationTemplate->preguntas()
                ->whereIn('id', $uniqueSubmittedPreguntaIds->toArray())
                ->with(['opciones' => function ($query) {
                    $query->where('es_correcto', true);
                }])
                ->with('tipoPregunta')
                ->get()
                ->keyBy('id');


            $submittedAnswersGrouped = collect($answers)->groupBy('pregunta_id');



            foreach ($uniqueSubmittedPreguntaIds as $preguntaId) {
                $pregunta = $preguntasForScoring->get($preguntaId);

                if (!$pregunta) continue;

                $tipoNombre = $pregunta->tipoPregunta->nombre_tipo;
                $preguntaScore = $pregunta->puntaje;

                $submittedAnswersForQuestion = $submittedAnswersGrouped->get($preguntaId, collect());

                if ($tipoNombre === 'texto') {
                    $textAnswerExists = $submittedAnswersForQuestion
                        ->whereNotNull('texto_respuesta')
                        ->where('texto_respuesta', '!=', '')
                        ->isNotEmpty();
                    if ($textAnswerExists) {
                        $totalScore += $preguntaScore;
                    }
                } else { // 'radio' o 'checkbox'
                    $correctOptionIds = $pregunta->opciones->pluck('id')->toArray();
                    $submittedOptionIds = $submittedAnswersForQuestion
                        ->whereNotNull('opcion_respuesta_id')
                        ->pluck('opcion_respuesta_id')
                        ->toArray();

                    if ($tipoNombre === 'radio') {
                        if (count($submittedOptionIds) === 1 && in_array($submittedOptionIds[0], $correctOptionIds)) {
                            $totalScore += $preguntaScore;
                        }
                    } elseif ($tipoNombre === 'checkbox') {
                        if (count($submittedOptionIds) === count($correctOptionIds) && empty(array_diff($submittedOptionIds, $correctOptionIds))) {
                            $totalScore += $preguntaScore;
                        }
                    }
                }
            }



            DB::commit();

            return response()->json([
                'message' => 'Respuestas recibidas y guardadas (sin validación).',
                'count' => count($respuestasToCreate),
                'totalScore' => $totalScore,
            ], 200);

        } catch (\Exception $e) {
            DB::rollback();

            // Basic error logging
            \Log::error('Error in simple saveAnswers: ' . $e->getMessage(), [
                'evaluacion_id' => $evaluacion_id,
                'request_data' => $request->all(),
                'exception' => $e
            ]);

            return response()->json([
                'message' => 'Error al guardar las respuestas.',
                'error' => $e->getMessage()
                // Do not include $e->getMessage() in production error responses
            ], 500);
        }
    }

    public function getEvaluacion($evaluacion_id) : JsonResponse
    {

        $evaluacionEstudiante =  Evaluacion::find($evaluacion_id)->load(['preguntas.opciones', 'preguntas.tipoPregunta']);

        // Optionally, record the start time if not already set



//        $evaluacionEstudiante->load([
//            'preguntas.opciones',
//            'preguntas.tipoPregunta',
//        ]);
//
//
        return response()->json([
            'message' => 'Evaluación cargada exitosamente.',
            'evaluationAttempt' => $evaluacionEstudiante, // Includes start/end times if loaded
            'evaluation' => Evaluacion::find($evaluacion_id), // The nested evaluation structure
        ]);
    }

}
