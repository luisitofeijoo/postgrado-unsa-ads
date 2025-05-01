<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\TipoPregunta; // Import the model

class StoreEvaluacionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Set to true if authorization is handled elsewhere (e.g., middleware)
        // Or add specific checks like if the user is a teacher
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Get available question type IDs from the database
        $availableTipoPreguntaIds = TipoPregunta::pluck('id')->toArray();
        $multiChoiceTypeIds = TipoPregunta::whereIn('nombre_tipo', ['radio', 'checkbox'])->pluck('id')->toArray();
        $radioTypeId = TipoPregunta::where('nombre_tipo', 'radio')->value('id');

        return [
            'curso_id' => ['nullable', 'exists:cursos,id'], // Assuming nullable for now, adjust as needed
            'titulo' => ['required', 'string', 'max:255'],
            'descripcion' => ['required', 'string'],
            'tiempo' => ['required', 'integer', 'min:1'], // Tiempo in minutes

            'questions' => ['required', 'array', 'min:1'], // Must have at least one question
            'questions.*.enunciado' => ['required', 'string'],
            'questions.*.tipo_pregunta_id' => ['required', 'integer', Rule::in($availableTipoPreguntaIds)], // Must be one of the valid types
            'questions.*.puntaje' => ['required', 'integer', 'min:1'],

            // Rules for options array - only required for multi-choice types
            'questions.*.opciones' => [
                Rule::requiredIf(function () use ($multiChoiceTypeIds) {
                    // Get the current question's tipo_pregunta_id from the request data
                    // This requires iterating through the questions array within the rule context
                    // A simpler way is to use after() validation for these checks
                    // For basic structural validation, we check it's an array
                    return true; // We'll handle conditional requirement in after()
                }),
                'array',
            ],
            'questions.*.opciones.*.texto_opcion' => ['required', 'string'],
            'questions.*.opciones.*.es_correcto' => ['required', 'boolean'], // Ensure it's a boolean
        ];
    }

    /**
     * Add custom validation rules after the basic rules pass.
     * Used for complex checks like conditional requirements and counts in nested arrays.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $questions = $this->input('questions', []);
            $tipoPreguntaMap = TipoPregunta::pluck('nombre_tipo', 'id')->toArray();

            foreach ($questions as $qIndex => $question) {
                $tipoId = $question['tipo_pregunta_id'] ?? null;
                $tipoNombre = $tipoId ? ($tipoPreguntaMap[$tipoId] ?? null) : null;
                $opciones = $question['opciones'] ?? [];

                // Check for required options for specific types
                if ($tipoNombre && in_array($tipoNombre, ['radio', 'checkbox'])) {
                    if (empty($opciones)) {
                        $validator->errors()->add(
                            "questions.{$qIndex}.opciones",
                            "Pregunta " . ($qIndex + 1) . ": Debe agregar al menos una opción de respuesta para este tipo de pregunta."
                        );
                    } else {
                        $correctOptionsCount = 0;
                        foreach ($opciones as $oIndex => $opcion) {
                            if (($opcion['es_correcto'] ?? false) === true) {
                                $correctOptionsCount++;
                            }
                            if (empty($opcion['texto_opcion'])) {
                                $validator->errors()->add(
                                    "questions.{$qIndex}.opciones.{$oIndex}.texto_opcion",
                                    "Pregunta " . ($qIndex + 1) . ", Opción " . ($oIndex + 1) . ": El texto de la opción no puede estar vacío."
                                );
                            }
                        }

                        if ($correctOptionsCount === 0) {
                            $validator->errors()->add(
                                "questions.{$qIndex}.opciones",
                                "Pregunta " . ($qIndex + 1) . ": Debe marcar al menos una opción como correcta."
                            );
                        }

                        if ($tipoNombre === 'radio' && $correctOptionsCount > 1) {
                            $validator->errors()->add(
                                "questions.{$qIndex}.opciones",
                                "Pregunta " . ($qIndex + 1) . ": Las preguntas de tipo 'radio' solo pueden tener una respuesta correcta."
                            );
                        }
                    }
                }
            }
        });
    }

    /**
     * Customize error messages
     *
     * @return array
     */
    public function messages()
    {
        return [
            'titulo.required' => 'El título de la evaluación es obligatorio.',
            'descripcion.required' => 'La descripción de la evaluación es obligatoria.',
            'tiempo.required' => 'El tiempo límite es obligatorio.',
            'tiempo.integer' => 'El tiempo límite debe ser un número entero.',
            'tiempo.min' => 'El tiempo límite debe ser al menos de :min minuto.',

            'questions.required' => 'La evaluación debe contener al menos una pregunta.',
            'questions.array' => 'El formato de las preguntas es inválido.',
            'questions.min' => 'La evaluación debe contener al menos :min pregunta.',

            'questions.*.enunciado.required' => 'El enunciado de la pregunta :attribute es obligatorio.',
            'questions.*.tipo_pregunta_id.required' => 'El tipo de pregunta de la pregunta :attribute es obligatorio.',
            'questions.*.tipo_pregunta_id.in' => 'El tipo de pregunta seleccionado para la pregunta :attribute es inválido.',
            'questions.*.puntaje.required' => 'El puntaje de la pregunta :attribute es obligatorio.',
            'questions.*.puntaje.integer' => 'El puntaje de la pregunta :attribute debe ser un número entero.',
            'questions.*.puntaje.min' => 'El puntaje de la pregunta :attribute debe ser al menos :min.',

            'questions.*.opciones.array' => 'El formato de las opciones de respuesta para la pregunta :attribute es inválido.',

            'questions.*.opciones.*.texto_opcion.required' => 'El texto de la opción de respuesta :attribute es obligatorio.',
            'questions.*.opciones.*.es_correcto.required' => 'Debes especificar si la opción :attribute es correcta.',
            'questions.*.opciones.*.es_correcto.boolean' => 'El valor de "es_correcto" para la opción :attribute debe ser verdadero o falso.',

            // Custom messages for after() validation are added directly in withValidator
        ];
    }

    /**
     * Customize attribute names for messages
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'questions.*.enunciado' => 'número :index de pregunta', // Index starts from 0
            'questions.*.tipo_pregunta_id' => 'número :index de pregunta',
            'questions.*.puntaje' => 'número :index de pregunta',
            'questions.*.opciones.*.texto_opcion' => 'número :index de opción en la pregunta :secondIndex', // Need custom handling for index
            'questions.*.opciones.*.es_correcto' => 'número :index de opción en la pregunta :secondIndex',
        ];
    }
}
