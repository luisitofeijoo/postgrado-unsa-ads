import React, { useState, useEffect, useRef } from 'react';
// Removed unused imports like Navigate, Outlet, NavLink
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
// Make sure Bulma CSS is imported in your project entry file


export default function PageTomarEvaluacion() {
    document.title = 'Tomar evaluación';

    // Correctly get evaluacionEstudianteId from URL params
    const { evaluacionEstudianteId } = useParams(); // <-- Make sure your route is /tomar-examen/:evaluacionEstudianteId



    const navigate = useNavigate();

    const [evaluationAttempt, setEvaluationAttempt] = useState(null); // Holds the evaluaciones_estudiantes record
    const [evaluation, setEvaluation] = useState(null); // Holds the basic evaluation template data
    const [questions, setQuestions] = useState([]); // State specifically for the questions list
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

                const response = await axios.get(`/api/evaluaciones-estudiantes/${evaluacionEstudianteId}/evaluation`);
                const data = response.data;

                setEvaluationAttempt(data.evaluationAttempt); // Save the attempt record
                setEvaluation(data.evaluation); // Save the basic evaluation template data
                setQuestions(data.evaluationAttempt.preguntas); // <-- **CORRECTION HERE** Save the questions nested in evaluationAttempt


                // Initialize time remaining (assuming time is in minutes from backend)
                // Use the time remaining from the attempt record if available, otherwise use evaluation template time
                const initialTime = data.evaluationAttempt?.time_remaining ?? (data.evaluation.tiempo * 60);
                setTimeRemaining(initialTime);

                // Initialize student answers state structure based on questions
                const initialAnswers = {};
                // Iterate over the questions array obtained from the backend response
                data.evaluationAttempt.preguntas.forEach(question => { // <-- **CORRECTION HERE**
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
                const errorMessage = err.response?.data?.message || "No se pudo cargar la evaluación. Inténtalo de nuevo.";
                setError(errorMessage);
                setIsLoading(false);
                toast.error(errorMessage);
            }
        };

        if (evaluacionEstudianteId) {
            fetchEvaluationData();
        } else {
            setError("ID de intento de evaluación no proporcionado en la URL.");
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
        // Only start timer if time > 0, not loading, no error, and not submitted
        if (timeRemaining > 0 && !isLoading && !error && !isSubmitted && questions.length > 0) { // Add check for questions loaded
            timerRef.current = setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);

            // Cleanup function to clear the interval
            return () => clearInterval(timerRef.current);
        } else if (timeRemaining === 0 && !isLoading && !error && !isSubmitted && questions.length > 0) { // Add check for questions loaded
            // Time's up, auto-submit
            handleSubmitEvaluation(true); // Pass true to indicate auto-submit
        }

        // Cleanup function to clear timer when dependencies change (e.g., time runs out, submitted)
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };

    }, [timeRemaining, isLoading, error, isSubmitted, questions.length]); // Added questions.length to dependencies


    // Format time for display (MM:SS)
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${paddedMinutes}:${paddedSeconds}`;
    };

    // Handle student answer changes (for radio and text)
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
            // Find the question object from the 'questions' state array
            const question = questions.find(q => q.id === questionId); // <-- Use 'questions' state here

            if (!question) return; // Should not happen if state is consistent

            const type = question.tipo_pregunta.nombre_tipo; // Access type_pregunta correctly

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
                        // Ensure optionId is not null/undefined before parsing
                        if (optionId !== null && optionId !== undefined) {
                            submissionData.respuestas.push({
                                pregunta_id: questionId,
                                texto_respuesta: null,
                                opcion_respuesta_id: parseInt(optionId, 10)
                            });
                        }
                    });
                }
            }
            // Note: If a question of type radio/checkbox has no option selected, it's skipped here.
            // This matches the backend structure for 'respuestas_estudiantes' where only *given* answers are stored.
        });

        console.log("Datos de respuesta a enviar:", submissionData); // Log data structure

        try {
            const response = await axios.post(`/api/evaluaciones-estudiantes/${evaluacionEstudianteId}/submit-answers`, submissionData);

            Swal.fire(
                '¡Evaluación Finalizada!',
                isAutoSubmit ? 'El tiempo se agotó. Tus respuestas han sido guardadas.' : '<h1 class="is-size-3">Tu puntaje es: '+response?.data?.totalScore+'</h1> Tus respuestas han sido enviadas.',
                'success'
            ).then(() => {
                navigate('/dashboard');
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
            // Re-start timer if it wasn't an auto-submit that failed AND time is remaining
            if (!isAutoSubmit && timeRemaining > 0) {
                timerRef.current = setInterval(() => {
                    setTimeRemaining(prevTime => prevTime - 1);
                }, 1000);
            }
        }
    };

    // Access evaluation details safely
    const evaluationTitle = evaluation?.titulo || 'Cargando Título...';
    const evaluationDescription = evaluation?.descripcion || 'Cargando Descripción...';
    const evaluationTimeLimit = evaluation?.tiempo; // Store in minutes


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

    // Check if both evaluation details AND questions are loaded
    if (!evaluation || !evaluationAttempt || questions.length === 0) {
        return (
            <section className="section">
                <div className="container">
                    <div className="notification is-warning">
                        <button className="delete"></button>
                        No se pudo cargar la evaluación o no contiene preguntas.
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
                        <h1 className="title">{evaluationTitle}</h1> {/* Use variable */}
                        <p className="subtitle is-6">{evaluationDescription}</p> {/* Use variable */}
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

                    {/* Removed the outer <form> tag. The submit button will trigger the handler directly. */}
                    {/* This avoids potential issues with browser's default form submission */}


                    {questions.map((question, qIndex) => ( // <-- Iterate over the 'questions' state
                        <div key={question.id} className="box mb-4"> {/* Box for each question */}
                            <p className="has-text-weight-bold mb-2">
                                {qIndex + 1}. {question.enunciado}
                                <span className="tag is-light ml-2">{question.puntaje} puntos</span> {/* Points tag */}
                            </p>
                            <div className="content"> {/* Bulma content class for rich text */}
                                {/* Render options based on question type */}
                                {/* Access tipo_pregunta correctly */}
                                {question.tipo_pregunta?.nombre_tipo === 'radio' && ( // <-- Safe navigation check (?)
                                    <div className="field"> {/* Use a field for radio group */}
                                        {question.opciones?.map(option => ( // <-- Safe navigation check (?)
                                            <label key={option.id} className="radio">
                                                <input
                                                    type="radio"
                                                    name={`question_${question.id}`} // Name groups radios for this question
                                                    // value should be the option ID (number)
                                                    value={option.id}
                                                    // Check if the stored answer (option ID) matches the current option ID
                                                    checked={studentAnswers[question.id] === option.id}
                                                    // Update state with the selected option ID
                                                    onChange={() => handleAnswerChange(question.id, option.id)}
                                                    disabled={isSubmitted} // Disable inputs after submission
                                                />
                                                {option.texto_opcion}
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {/* Access tipo_pregunta correctly */}
                                {question.tipo_pregunta?.nombre_tipo === 'checkbox' && ( // <-- Safe navigation check (?)
                                    <div className="field"> {/* Use a field for checkbox group */}
                                        {question.opciones?.map(option => ( // <-- Safe navigation check (?)
                                            <label key={option.id} className="checkbox">
                                                <input
                                                    type="checkbox"
                                                    // value should be the option ID (number)
                                                    value={option.id}
                                                    // Check if the option ID is in the array of selected answers for this question
                                                    checked={Array.isArray(studentAnswers[question.id]) && studentAnswers[question.id].includes(option.id)} // <-- Correct check
                                                    onChange={(e) => handleCheckboxChange(question.id, option.id, e.target.checked)}
                                                    disabled={isSubmitted}
                                                />
                                                {option.texto_opcion}
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {/* Access tipo_pregunta correctly */}
                                {question.tipo_pregunta?.nombre_tipo === 'texto' && ( // <-- Safe navigation check (?)
                                    <div className="field">
                                        <div className="control">
                                                <textarea
                                                    className="textarea"
                                                    placeholder="Escribe tu respuesta aquí..."
                                                    rows="3"
                                                    // Value is the string answer stored in state
                                                    value={studentAnswers[question.id] || ''} // Ensure value is not null/undefined for controlled input
                                                    // Update state with the textarea value
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

                    {/* Submit Button - Placed outside the loop and form */}
                    <div className="field mt-5">
                        <div className="control">
                            <button
                                type="button" // <-- Changed to type="button"
                                className={`button is-success is-large is-fullwidth ${isSubmitted ? 'is-loading' : ''}`}
                                onClick={() => handleSubmitEvaluation(false)} // <-- Call handler directly
                                disabled={isLoading || isSubmitted || timeRemaining <= 0} // Disable if loading, submitted, or time is zero
                            >
                                {isSubmitted ? 'Enviando...' : 'Finalizar Evaluación'}
                            </button>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}
