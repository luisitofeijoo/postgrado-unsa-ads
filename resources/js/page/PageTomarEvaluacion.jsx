import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate for redirection
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import {Navigate, Outlet, NavLink, Link} from 'react-router-dom';
// Make sure Bulma CSS is imported in your project entry file

export default function PageTomarEvaluacion() {
    document.title = 'Tomar evaluación';

    const evaluacionEstudianteId  = 1; // Get the ID from URL
    const navigate = useNavigate(); // Hook for redirection

    const [evaluationAttempt, setEvaluationAttempt] = useState(null); // Holds the evaluaciones_estudiantes record
    const [evaluation, setEvaluation] = useState(null); // Holds the nested evaluation data (questions, options)
    const [studentAnswers, setStudentAnswers] = useState({}); // State to store student's answers
    const [timeRemaining, setTimeRemaining] = useState(0); // Time in seconds
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const timerRef = useRef(null); // Ref to hold the interval ID

    // Fetch Evaluation Data
    useEffect(() => {
        const fetchEvaluationData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Backend endpoint to get evaluation details for a specific student attempt
                const response = await axios.get(`/api/evaluaciones/${evaluacionEstudianteId}`);
                const data = response.data;

                setEvaluationAttempt(data.evaluationAttempt); // Save the attempt record if needed
                setEvaluation(data.evaluation); // Save the nested evaluation data

                // Initialize time remaining (assuming time is in minutes from backend)
                // Use the time remaining from the attempt record if available, otherwise use evaluation time
                const initialTime = data.evaluationAttempt?.time_remaining ?? (data.evaluation.tiempo * 60);
                setTimeRemaining(initialTime);

                // Initialize student answers state structure based on questions
                const initialAnswers = {};
                data.evaluation.preguntas.forEach(question => {
                    if (question.tipo_pregunta.nombre_tipo === 'checkbox') {
                        initialAnswers[question.id] = []; // Checkbox uses an array of selected option IDs
                    } else {
                        initialAnswers[question.id] = null; // Radio uses a single option ID, text uses null initially
                    }
                    // If retrieving previous answers (e.g., if attempt was paused), populate initialAnswers here
                });
                setStudentAnswers(initialAnswers);


                setIsLoading(false);

            } catch (err) {
                console.error("Error fetching evaluation:", err.response || err);
                setError("No se pudo cargar la evaluación. Inténtalo de nuevo.");
                setIsLoading(false);
                toast.error("Error al cargar la evaluación.");
            }
        };

        if (evaluacionEstudianteId) {
            fetchEvaluationData();
        } else {
            setError("ID de evaluación de estudiante no proporcionado.");
            setIsLoading(false);
        }

        // Cleanup function to clear timer if component unmounts before timer starts
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };

    }, [evaluacionEstudianteId]); // Re-run if evaluacionEstudianteId changes


    // Timer Effect
    useEffect(() => {
        if (timeRemaining > 0 && !isLoading && !error && !isSubmitted) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);

            // Cleanup function to clear the interval
            return () => clearInterval(timerRef.current);
        } else if (timeRemaining === 0 && !isLoading && !error && !isSubmitted) {
            // Time's up, auto-submit
            handleSubmitEvaluation(true); // Pass true to indicate auto-submit
        }

        // Cleanup function to clear timer when dependencies change (e.g., time runs out, submitted)
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };

    }, [timeRemaining, isLoading, error, isSubmitted]); // Re-run when these dependencies change


    // Format time for display (MM:SS)
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${paddedMinutes}:${paddedSeconds}`;
    };

    // Handle student answer changes
    const handleAnswerChange = (questionId, answer) => {
        setStudentAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    };

    // Handle checkbox changes
    const handleCheckboxChange = (questionId, optionId, isChecked) => {
        setStudentAnswers(prevAnswers => {
            const currentOptions = prevAnswers[questionId] || [];
            if (isChecked) {
                // Add option if checked and not already in array
                if (!currentOptions.includes(optionId)) {
                    return {
                        ...prevAnswers,
                        [questionId]: [...currentOptions, optionId],
                    };
                }
            } else {
                // Remove option if unchecked
                return {
                    ...prevAnswers,
                    [questionId]: currentOptions.filter(id => id !== optionId),
                };
            }
            return prevAnswers; // No change needed
        });
    };


    // Handle evaluation submission
    const handleSubmitEvaluation = async (isAutoSubmit = false) => {
        if (isSubmitted) return; // Prevent double submission

        setIsSubmitted(true); // Disable submit button and stop timer
        clearInterval(timerRef.current); // Ensure timer is stopped

        // Prepare data structure for backend submission
        const submissionData = {
            respuestas: [] // Array of individual response objects
        };

        // Iterate through collected answers and format them
        Object.keys(studentAnswers).forEach(questionIdString => {
            const questionId = parseInt(questionIdString, 10);
            const answer = studentAnswers[questionIdString]; // The answer state for this question
            const question = evaluation.preguntas.find(q => q.id === questionId);

            if (!question) return; // Should not happen

            const type = question.tipo_pregunta.nombre_tipo;

            if (type === 'texto') {
                // For text, submit one record if text is not empty
                if (answer && typeof answer === 'string' && answer.trim()) {
                    submissionData.respuestas.push({
                        pregunta_id: questionId,
                        texto_respuesta: answer.trim(),
                        opcion_respuesta_id: null
                    });
                }
            } else if (type === 'radio') {
                // For radio, submit one record if an option is selected
                if (answer !== null) { // answer is the selected option ID
                    submissionData.respuestas.push({
                        pregunta_id: questionId,
                        texto_respuesta: null,
                        opcion_respuesta_id: parseInt(answer, 10)
                    });
                }
            } else if (type === 'checkbox') {
                // For checkbox, submit one record for each selected option
                if (Array.isArray(answer)) { // answer is an array of selected option IDs
                    answer.forEach(optionId => {
                        submissionData.respuestas.push({
                            pregunta_id: questionId,
                            texto_respuesta: null,
                            opcion_respuesta_id: parseInt(optionId, 10)
                        });
                    });
                }
            }
            // Note: If a question of type radio/checkbox has no option selected, it's skipped here.
            // You might want to submit a record indicating no answer if that's a requirement.
        });

        console.log("Datos de respuesta a enviar:", submissionData); // Log data structure

        try {
            // Backend endpoint to submit answers for a specific student attempt
            const response = await axios.post(`/api/evaluaciones-estudiantes/${evaluacionEstudianteId}/submit-answers`, submissionData);

            Swal.fire(
                '¡Evaluación Finalizada!',
                isAutoSubmit ? 'El tiempo se agotó. Tus respuestas han sido guardadas.' : 'Tus respuestas han sido enviadas.',
                'success'
            ).then(() => {
                // Redirect student after submission (e.g., to results page or dashboard)
                navigate('/dashboard'); // Adjust redirect path as needed
            });


        } catch (err) {
            console.error("Error submitting evaluation:", err.response || err);
            setIsSubmitted(false); // Allow resubmission if error wasn't critical
            let errorMessage = "Hubo un error al enviar tus respuestas.";
            if(err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.errors) {
                errorMessage = "Error de validación en las respuestas.";
                Object.values(err.response.data.errors).forEach(messages => {
                    messages.forEach(message => toast.error(message));
                });
            }

            Swal.fire(
                '¡Error!',
                errorMessage,
                'error'
            );
            // Re-start timer if it wasn't an auto-submit that failed
            if (!isAutoSubmit && timeRemaining > 0) {
                timerRef.current = setInterval(() => {
                    setTimeRemaining(prevTime => prevTime - 1);
                }, 1000);
            }
        }
    };


    if (isLoading) {
        return (
            <section className="section">
                <div className="container">
                    <div className="box">
                        <p className="title is-4">Cargando evaluación...</p>
                        <progress className="progress is-primary" max="100">Loading</progress> {/* Bulma progress bar */}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="section">
                <div className="container">
                    <div className="notification is-danger"> {/* Bulma error notification */}
                        <button className="delete"></button>
                        {error}
                        <br />
                        <Link to="/dashboard">Volver al Dashboard</Link> {/* Example link */}
                    </div>
                </div>
            </section>
        );
    }

    if (!evaluation || !evaluationAttempt) {
        return (
            <section className="section">
                <div className="container">
                    <div className="notification is-warning">
                        <button className="delete"></button>
                        No se encontró la evaluación o el intento.
                        <br />
                        <Link to="/dashboard">Volver al Dashboard</Link>
                    </div>
                </div>
            </section>
        );
    }


    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <section className="section">
                <div className="container">
                    <div className="box mb-5"> {/* Box for evaluation header */}
                        <h1 className="title">{evaluation.titulo}</h1>
                        <p className="subtitle is-6">{evaluation.descripcion}</p>
                        <hr />
                        <div className="level is-mobile"> {/* Bulma level for alignment */}
                            <div className="level-left">
                                <div className="level-item">
                                    <p className="has-text-weight-bold">Tiempo Restante:</p>
                                </div>
                            </div>
                            <div className="level-right">
                                <div className="level-item">
                                     <span className={`tag is-large ${timeRemaining <= 60 ? 'is-danger' : 'is-info'}`}> {/* Timer tag */}
                                         {formatTime(timeRemaining)}
                                     </span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <form onSubmit={(e) => { e.preventDefault(); handleSubmitEvaluation(); }}> {/* Prevent default form submission */}
                        {evaluation.preguntas.map((question, qIndex) => (
                            <div key={question.id} className="box mb-4"> {/* Box for each question */}
                                <p className="has-text-weight-bold mb-2">
                                    {qIndex + 1}. {question.enunciado}
                                    <span className="tag is-light ml-2">{question.puntaje} puntos</span> {/* Points tag */}
                                </p>
                                <div className="content"> {/* Bulma content class for rich text */}
                                    {/* Render options based on question type */}
                                    {question.tipo_pregunta.nombre_tipo === 'radio' && (
                                        <div className="field"> {/* Use a field for radio group */}
                                            {question.opciones.map(option => (
                                                <label key={option.id} className="radio">
                                                    <input
                                                        type="radio"
                                                        name={`question_${question.id}`} // Name groups radios for this question
                                                        value={option.id}
                                                        checked={studentAnswers[question.id] === option.id}
                                                        onChange={() => handleAnswerChange(question.id, option.id)}
                                                        disabled={isSubmitted} // Disable inputs after submission
                                                    />
                                                    {option.texto_opcion}
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {question.tipo_preguntas && question.tipo_preguntas.nombre_tipo === 'checkbox' && (
                                        <div className="field"> {/* Use a field for checkbox group */}
                                            {question.opciones.map(option => (
                                                <label key={option.id} className="checkbox">
                                                    <input
                                                        type="checkbox"
                                                        value={option.id}
                                                        checked={studentAnswers[question.id]?.includes(option.id) || false} // Ensure default is false if array is empty/null
                                                        onChange={(e) => handleCheckboxChange(question.id, option.id, e.target.checked)}
                                                        disabled={isSubmitted}
                                                    />
                                                    {option.texto_opcion}
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {question.tipo_pregunta.nombre_tipo === 'texto' && (
                                        <div className="field">
                                            <div className="control">
                                                <textarea
                                                    className="textarea"
                                                    placeholder="Escribe tu respuesta aquí..."
                                                    rows="3"
                                                    value={studentAnswers[question.id] || ''} // Ensure value is not null/undefined for controlled input
                                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                    disabled={isSubmitted}
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}

                                    {/* Add other question types here if needed */}

                                </div>
                            </div>
                        ))}

                        {/*<div className="field mt-5">*/}
                        {/*    <div className="control">*/}
                        {/*        <button*/}
                        {/*            type="submit"*/}
                        {/*            className={`button is-success is-large is-fullwidth ${isSubmitted ? 'is-loading' : ''}`}  is-loading class */}
                        {/*            disabled={isLoading || isSubmitted || timeRemaining <= 0} // Disable if loading, submitted, or time is zero*/}
                        {/*        >*/}
                        {/*            {isSubmitted ? 'Enviando...' : 'Finalizar Evaluación'}*/}
                        {/*        </button>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </form>
                </div>
            </section>
        </>
    );
}
