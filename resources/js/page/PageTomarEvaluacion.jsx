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


    const { evaluacionEstudianteId } = useParams();
    const navigate = useNavigate();

    const [evaluationAttempt, setEvaluationAttempt] = useState(null);
    const [evaluation, setEvaluation] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [studentAnswers, setStudentAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const timerRef = useRef(null);

    useEffect(() => {
        const fetchEvaluationData = async () => {
            setIsLoading(true);
            setError(null);
            try {

                const response = await axios.get(`/api/evaluaciones-estudiantes/${evaluacionEstudianteId}/evaluation`);
                const data = response.data;

                setEvaluationAttempt(data.evaluationAttempt);
                setEvaluation(data.evaluation);
                setQuestions(data.evaluationAttempt.preguntas);


                const initialTime = data.evaluationAttempt?.time_remaining ?? (data.evaluation.tiempo * 60);
                setTimeRemaining(initialTime);

                const initialAnswers = {};

                data.evaluationAttempt.preguntas.forEach(question => { // <-- **CORRECTION HERE**
                    if (question.tipo_pregunta.nombre_tipo === 'checkbox') {
                        initialAnswers[question.id] = [];
                    } else {
                        initialAnswers[question.id] = null;
                    }
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

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };

    }, [evaluacionEstudianteId]);


    // Timer Effect
    useEffect(() => {

        if (timeRemaining > 0 && !isLoading && !error && !isSubmitted && questions.length > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);

            return () => clearInterval(timerRef.current);
        } else if (timeRemaining === 0 && !isLoading && !error && !isSubmitted && questions.length > 0) {
            // Time's up, auto-submit
            handleSubmitEvaluation(true);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };

    }, [timeRemaining, isLoading, error, isSubmitted, questions.length]); // Added questions.length to dependencies



    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${paddedMinutes}:${paddedSeconds}`;
    };


    const handleAnswerChange = (questionId, answer) => {
        setStudentAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    };


    const handleCheckboxChange = (questionId, optionId, isChecked) => {
        setStudentAnswers(prevAnswers => {
            const currentOptions = prevAnswers[questionId] || [];
            if (isChecked) {
                if (!currentOptions.includes(optionId)) {
                    return {
                        ...prevAnswers,
                        [questionId]: [...currentOptions, optionId],
                    };
                }
            } else {

                return {
                    ...prevAnswers,
                    [questionId]: currentOptions.filter(id => id !== optionId),
                };
            }
            return prevAnswers; // No change needed
        });
    };



    const handleSubmitEvaluation = async (isAutoSubmit = false) => {
        if (isSubmitted) return;

        setIsSubmitted(true);
        clearInterval(timerRef.current);

        const submissionData = {
            respuestas: []
        };

        Object.keys(studentAnswers).forEach(questionIdString => {
            const questionId = parseInt(questionIdString, 10);
            const answer = studentAnswers[questionIdString];

            const question = questions.find(q => q.id === questionId);

            if (!question) return;

            const type = question.tipo_pregunta.nombre_tipo;

            if (type === 'texto') {

                if (answer && typeof answer === 'string' && answer.trim()) {
                    submissionData.respuestas.push({
                        pregunta_id: questionId,
                        texto_respuesta: answer.trim(),
                        opcion_respuesta_id: null
                    });
                }
            } else if (type === 'radio') {

                if (answer !== null) {
                    submissionData.respuestas.push({
                        pregunta_id: questionId,
                        texto_respuesta: null,
                        opcion_respuesta_id: parseInt(answer, 10)
                    });
                }
            } else if (type === 'checkbox') {

                if (Array.isArray(answer)) {
                    answer.forEach(optionId => {

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
        });

        console.log("Datos de respuesta a enviar:", submissionData);

        try {
            const response = await axios.post(`/api/evaluaciones-estudiantes/${evaluacionEstudianteId}/submit-answers`, submissionData);

            Swal.fire(
                '¡Evaluación Finalizada!',
                isAutoSubmit ? 'El tiempo se agotó. Tus respuestas han sido guardadas.' : '<h1 class="is-size-3">Tu puntaje es: '+response?.data?.totalScore+'</h1> Tus respuestas han sido enviadas.',
                'success'
            ).then(() => {
                navigate('/');
            });


        } catch (err) {
            console.error("Error submitting evaluation:", err.response || err);
            setIsSubmitted(false);
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

            if (!isAutoSubmit && timeRemaining > 0) {
                timerRef.current = setInterval(() => {
                    setTimeRemaining(prevTime => prevTime - 1);
                }, 1000);
            }
        }
    };


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
                        <Link to="/admin">Volver al Inicio</Link> {/* Example link */}
                    </div>
                </div>
            </section>
        );
    }


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
                    <div className="box mb-5">
                        <h1 className="title">{evaluationTitle}</h1>
                        <p className="subtitle is-6">{evaluationDescription}</p>
                        <hr />
                        <div className="level is-mobile">
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



                    {questions.map((question, qIndex) => (
                        <div key={question.id} className="box mb-4">
                            <p className="has-text-weight-bold mb-2">
                                {qIndex + 1}. {question.enunciado}
                                <span className="tag is-light ml-2">{question.puntaje} puntos</span>
                            </p>
                            <div className="content">

                                {question.tipo_pregunta?.nombre_tipo === 'radio' && (
                                    <div className="field">
                                        {question.opciones?.map(option => (
                                            <label key={option.id} className="radio">
                                                <input
                                                    type="radio"
                                                    name={`question_${question.id}`}
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


                                {question.tipo_pregunta?.nombre_tipo === 'checkbox' && (
                                    <div className="field">
                                        {question.opciones?.map(option => (
                                            <label key={option.id} className="checkbox">
                                                <input
                                                    type="checkbox"

                                                    value={option.id}

                                                    checked={Array.isArray(studentAnswers[question.id]) && studentAnswers[question.id].includes(option.id)} // <-- Correct check
                                                    onChange={(e) => handleCheckboxChange(question.id, option.id, e.target.checked)}
                                                    disabled={isSubmitted}
                                                />
                                                {option.texto_opcion}
                                            </label>
                                        ))}
                                    </div>
                                )}


                                {question.tipo_pregunta?.nombre_tipo === 'texto' && (
                                    <div className="field">
                                        <div className="control">
                                                <textarea
                                                    className="textarea"
                                                    placeholder="Escribe tu respuesta aquí..."
                                                    rows="3"

                                                    value={studentAnswers[question.id] || ''}

                                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                    disabled={isSubmitted}
                                                ></textarea>
                                        </div>
                                    </div>
                                )}


                            </div>
                        </div>
                    ))}

                    <div className="field mt-5">
                        <div className="control">
                            <button
                                type="button"
                                className={`button is-success is-large is-fullwidth ${isSubmitted ? 'is-loading' : ''}`}
                                onClick={() => handleSubmitEvaluation(false)}
                                disabled={isLoading || isSubmitted || timeRemaining <= 0}
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
