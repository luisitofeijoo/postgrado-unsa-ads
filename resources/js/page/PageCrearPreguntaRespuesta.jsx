import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';


const generateUniqueId = () => Date.now() + Math.random();

export default function PageCrearPreguntaRespuesta() {
    document.title = 'Crear evaluación';
    const {id} = useParams();

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    const [questions, setQuestions] = useState([]);

    const [questionTypes, setQuestionTypes] = useState([
        { id: 1, nombre_tipo: 'radio' },
        { id: 2, nombre_tipo: 'checkbox' },
        { id: 3, nombre_tipo: 'texto' },
    ]);

    useEffect(() => {

    }, []);

    const handleAddQuestion = () => {
        const newQuestion = {
            id: generateUniqueId(),
            enunciado: '',
            tipo_pregunta_id: '',
            puntaje: 1,
            opciones: [],
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleRemoveQuestion = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setQuestions(questions.filter(q => q.id !== id));
                toast.success('Pregunta eliminada.');
            }
        });
    };

    const handleQuestionChange = (id, field, value) => {
        setQuestions(questions.map(q =>
            q.id === id ? {
                ...q,
                [field]: field === 'puntaje' ? Number(value) : value,
                ...(field === 'tipo_pregunta_id' && value === questionTypes.find(type => type.nombre_tipo === 'texto')?.id.toString()) && { opciones: [] }
            } : q
        ));
    };

    const handleAddOption = (questionId) => {
        setQuestions(questions.map(q =>
            q.id === questionId ? {
                ...q,
                opciones: [...q.opciones, {
                    id: generateUniqueId(),
                    texto_opcion: '',
                    es_correcto: false,
                }]
            } : q
        ));
    };

    const handleRemoveOption = (questionId, optionId) => {
        setQuestions(questions.map(q =>
            q.id === questionId ? {
                ...q,
                opciones: q.opciones.filter(o => o.id !== optionId)
            } : q
        ));
    };

    const handleOptionChange = (questionId, optionId, field, value) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const updatedOptions = q.opciones.map(o => {
                    if (o.id === optionId) {
                        if (field === 'es_correcto' && q.tipo_pregunta_id === questionTypes.find(type => type.nombre_tipo === 'radio')?.id.toString()) {
                            return { ...o, es_correcto: value };
                        }
                        return { ...o, [field]: value };
                    } else {
                        if (field === 'es_correcto' && q.tipo_pregunta_id === questionTypes.find(type => type.nombre_tipo === 'radio')?.id.toString() && value) {
                            return { ...o, es_correcto: false };
                        }
                        return o;
                    }
                });
                return { ...q, opciones: updatedOptions };
            }
            return q;
        }));
    };

    const validateQuestions = () => {
        let isValid = true;
        const errors = [];

        if (questions.length === 0) {
            errors.push("Debes agregar al menos una pregunta.");
            isValid = false;
        }

        questions.forEach((q, qIndex) => {
            if (!q.enunciado.trim()) {
                errors.push(`Pregunta ${qIndex + 1}: El enunciado no puede estar vacío.`);
                isValid = false;
            }
            if (!q.tipo_pregunta_id) {
                errors.push(`Pregunta ${qIndex + 1}: Debes seleccionar un tipo de pregunta.`);
                isValid = false;
            }
            if (q.puntaje <= 0) {
                errors.push(`Pregunta ${qIndex + 1}: El puntaje debe ser mayor a 0.`);
                isValid = false;
            }

            const questionType = questionTypes.find(type => type.id.toString() === q.tipo_pregunta_id);

            if (questionType && (questionType.nombre_tipo === 'radio' || questionType.nombre_tipo === 'checkbox')) {
                if (q.opciones.length === 0) {
                    errors.push(`Pregunta ${qIndex + 1}: Debes agregar al menos una opción de respuesta.`);
                    isValid = false;
                } else {
                    let correctOptionsCount = 0;
                    q.opciones.forEach((o, oIndex) => {
                        if (!o.texto_opcion.trim()) {
                            errors.push(`Pregunta ${qIndex + 1}, Opción ${oIndex + 1}: El texto de la opción no puede estar vacío.`);
                            isValid = false;
                        }
                        if (o.es_correcto) {
                            correctOptionsCount++;
                        }
                    });

                    if (correctOptionsCount === 0) {
                        errors.push(`Pregunta ${qIndex + 1}: Debes marcar al menos una opción como correcta.`);
                        isValid = false;
                    }
                    if (questionType.nombre_tipo === 'radio' && correctOptionsCount > 1) {
                        errors.push(`Pregunta ${qIndex + 1}: Las preguntas de tipo 'radio' solo pueden tener una respuesta correcta.`);
                        isValid = false;
                    }
                }
            }
        });


        if (!isValid) {
            errors.forEach(error => toast.error(error));
        }

        return isValid;
    };


    const onSubmit = async (data) => {
        if (!validateQuestions()) {
            return;
        }

        const evaluationData = {
            ...data,
            questions: questions.map(q => {
                const questionType = questionTypes.find(type => type.id.toString() === q.tipo_pregunta_id);
                return {
                    enunciado: q.enunciado,
                    tipo_pregunta_id: parseInt(q.tipo_pregunta_id, 10),
                    puntaje: q.puntaje,
                    opciones: questionType && (questionType.nombre_tipo === 'radio' || questionType.nombre_tipo === 'checkbox')
                        ? q.opciones.map(o => ({
                            texto_opcion: o.texto_opcion,
                            es_correcto: o.es_correcto,
                        }))
                        : [],
                };
            }),
        };

        console.log("Datos a enviar:", evaluationData);

        try {
           // const response = await axios.post('/api/evaluaciones', evaluationData);
            const response = await axios.post(`/api/evaluaciones/${id}`, evaluationData);

            Swal.fire(
                '¡Creada!',
                'La evaluación ha sido creada exitosamente.',
                'success'
            );
            reset();
            setQuestions([]);

        } catch (error) {
            console.error("Error creating evaluation:", error.response || error);
            const errorMessage = error.response?.data?.message || "Hubo un error al crear la evaluación.";
            Swal.fire(
                '¡Error!',
                errorMessage,
                'error'
            );
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach(messages => {
                    messages.forEach(message => toast.error(message));
                });
            }
        }
    };

    const textoTypeId = questionTypes.find(type => type.nombre_tipo === 'texto')?.id.toString();


    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <section className="section">
                <div className="container">
                    <h1 className="title">Crear Nueva Evaluación</h1>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="card mb-5">
                            <header className="card-header">
                                <p className="card-header-title">
                                    Detalles de la Evaluación
                                </p>
                            </header>
                            <div className="card-content">
                                <div className="field">
                                    <label htmlFor="titulo" className="label">Título</label>
                                    <div className="control">
                                        <input
                                            type="text"
                                            className={`input ${errors.titulo ? 'is-danger' : ''}`}
                                            id="titulo"
                                            {...register("titulo", { required: "El título es obligatorio." })}
                                        />
                                    </div>
                                    {errors.titulo && <p className="help is-danger">{errors.titulo.message}</p>}
                                </div>

                                <div className="field">
                                    <label htmlFor="descripcion" className="label">Descripción</label>
                                    <div className="control">
                                        <textarea
                                            className={`textarea ${errors.descripcion ? 'is-danger' : ''}`}
                                            id="descripcion"
                                            rows="3"
                                            {...register("descripcion", { required: "La descripción es obligatoria." })}
                                        ></textarea>
                                    </div>
                                    {errors.descripcion && <p className="help is-danger">{errors.descripcion.message}</p>}
                                </div>

                                <div className="field">
                                    <label htmlFor="tiempo" className="label">Tiempo Límite (minutos)</label>
                                    <div className="control">
                                        <input
                                            type="number"
                                            className={`input ${errors.tiempo ? 'is-danger' : ''}`}
                                            id="tiempo"
                                            {...register("tiempo", {
                                                required: "El tiempo límite es obligatorio.",
                                                min: { value: 1, message: "El tiempo debe ser al menos 1 minuto." }
                                            })}
                                        />
                                    </div>
                                    {errors.tiempo && <p className="help is-danger">{errors.tiempo.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="card mb-5">
                            <header className="card-header">
                                <p className="card-header-title">
                                    Preguntas
                                </p>
                                <div className="card-header-icon">
                                    <button
                                        type="button"
                                        className="button is-primary is-small"
                                        onClick={handleAddQuestion}
                                    >
                                        Agregar Pregunta
                                    </button>
                                </div>
                            </header>
                            <div className="card-content">
                                {questions.length === 0 ? (
                                    <p className="has-text-grey">Haz clic en "Agregar Pregunta" para empezar.</p>
                                ) : (
                                    questions.map((question, qIndex) => (
                                        <div key={question.id} className="box mb-4">
                                            <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                                                <h6 className="title is-6">Pregunta {qIndex + 1}</h6>
                                                <button
                                                    type="button"
                                                    className="button is-danger"
                                                    onClick={() => handleRemoveQuestion(question.id)}
                                                >
                                                    Eliminar Pregunta
                                                </button>
                                            </div>
                                            <div className="field">
                                                <label htmlFor={`enunciado-${question.id}`} className="labell">Enunciado</label>
                                                <div className="control">
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        id={`enunciado-${question.id}`}
                                                        value={question.enunciado}
                                                        onChange={(e) => handleQuestionChange(question.id, 'enunciado', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="columns is-multiline">
                                                <div className="column is-half">
                                                    <div className="field">
                                                        <label htmlFor={`tipo_pregunta-${question.id}`} className="label">Tipo de Pregunta</label>
                                                        <div className="control">
                                                            <div className="select is-fullwidth">
                                                                <select
                                                                    id={`tipo_pregunta-${question.id}`}
                                                                    value={question.tipo_pregunta_id}
                                                                    onChange={(e) => handleQuestionChange(question.id, 'tipo_pregunta_id', e.target.value)}
                                                                    required
                                                                >
                                                                    <option value="">Seleccionar Tipo</option>
                                                                    {questionTypes.map(type => (
                                                                        <option key={type.id} value={type.id}>
                                                                            {type.nombre_tipo.charAt(0).toUpperCase() + type.nombre_tipo.slice(1)}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="column is-half">
                                                    <div className="field">
                                                        <label htmlFor={`puntaje-${question.id}`} className="label">Puntaje</label>
                                                        <div className="control">
                                                            <input
                                                                type="number"
                                                                className="input"
                                                                id={`puntaje-${question.id}`}
                                                                value={question.puntaje}
                                                                onChange={(e) => handleQuestionChange(question.id, 'puntaje', e.target.value)}
                                                                min="1"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {question.tipo_pregunta_id && question.tipo_pregunta_id !== textoTypeId && (
                                                <div className="box has-background-white-ter p-4">
                                                    <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                                                        <h6 className="title is-6">Opciones de Respuesta</h6>
                                                        <button
                                                            type="button"
                                                            className="button is-link is-outlined"
                                                            onClick={() => handleAddOption(question.id)}
                                                        >
                                                            Agregar Opción
                                                        </button>
                                                    </div>
                                                    {question.opciones.length === 0 ? (
                                                        <p className="has-text-grey is-size-7">Agrega opciones para esta pregunta.</p>
                                                    ) : (
                                                        question.opciones.map((option, oIndex) => (
                                                            <div key={option.id} className="field has-addons mb-2">
                                                                <p className="control">
                                                                    <label className={`checkbox ${question.tipo_pregunta_id === questionTypes.find(type => type.nombre_tipo === 'radio')?.id.toString() ? 'radio' : ''} is-small`}>
                                                                        {question.tipo_pregunta_id === questionTypes.find(type => type.nombre_tipo === 'radio')?.id.toString() ? (
                                                                            <input
                                                                                type="radio"
                                                                                name={`correct_option_${question.id}`}
                                                                                checked={option.es_correcto}
                                                                                onChange={(e) => handleOptionChange(question.id, option.id, 'es_correcto', e.target.checked)}
                                                                            />
                                                                        ) : (
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={option.es_correcto}
                                                                                onChange={(e) => handleOptionChange(question.id, option.id, 'es_correcto', e.target.checked)}
                                                                            />
                                                                        )}
                                                                        Correcta
                                                                    </label>
                                                                </p>
                                                                <p className="control is-expanded">
                                                                    <input
                                                                        type="text"
                                                                        className="input"
                                                                        placeholder={`Opción ${oIndex + 1}`}
                                                                        value={option.texto_opcion}
                                                                        onChange={(e) => handleOptionChange(question.id, option.id, 'texto_opcion', e.target.value)}
                                                                        required
                                                                    />
                                                                </p>
                                                                <p className="control">
                                                                    <button
                                                                        type="button"
                                                                        className="button is-dangerl is-outlined"
                                                                        onClick={() => handleRemoveOption(question.id, option.id)}
                                                                    >
                                                                        <span>Eliminar</span>
                                                                        <span className="icon is-small"><i className="fas fa-times"></i></span>
                                                                    </button>
                                                                </p>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="field">
                            <div className="control">
                                <button type="submit" className="button is-success is-large is-fullwidth mb-5">
                                    Guardar Evaluación
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}
