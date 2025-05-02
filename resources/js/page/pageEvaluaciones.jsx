import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {useForm} from "react-hook-form";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';

import Swal from 'sweetalert2';
import {useAuth} from "@/context/AuthContext";

export default function PageEvaluaciones() {
    document.title = 'Mis cursos';
    const {user_id} = useParams();
    const {register, setValue, handleSubmit, formState: {errors}, watch, reset} = useForm();
    const [evaluaciones, setEvaluaciones] = useState([]);

    useEffect(() => {
        axios.get('/api/docente/evaluaciones/'+user_id) // Asegúrate de que esta ruta exista en tu backend
            .then(response => {
                setEvaluaciones(response.data); // Ajusta según la estructura de tu respuesta
            })
            .catch(error => {
                console.error('Error al obtener cursos:', error);
            });



    }, []);

    return (
        <>
            <ToastContainer/>
            <div className="container pt-5">
                <div className="columns is-centered">
                    <div className="column">
                        <h3 className="is-size-3" ><strong>Evaluaciones generadas</strong></h3>
                        <table className="table is-fullwidth">
                            <thead>
                            <tr>
                                <th>Titulo</th>
                                <th>Tiempo</th>
                                <th>Curso</th>
                                <th>Fecha creada</th>
                            </tr>
                            </thead>
                            <tbody>
                            {evaluaciones.map(e => (
                                <tr key={e.id}>
                                    <td>{e.titulo}</td>
                                    <td>{e.tiempo} minutos</td>
                                    <th>{e.curso?.nombre_curso}</th>
                                    <th>{e.created_at}</th>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
