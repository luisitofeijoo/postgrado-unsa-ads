import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {useForm} from "react-hook-form";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';

import Swal from 'sweetalert2';
import {useAuth} from "@/context/AuthContext";

export default function PageDocenteCursos() {
    document.title = 'Mis cursos';
    const {user_id} = useParams();
    const {register, setValue, handleSubmit, formState: {errors}, watch, reset} = useForm();
    const [cursos, setCursos] = useState([]);

    useEffect(() => {
        axios.get('/api/docente/cursos/'+user_id) // Asegúrate de que esta ruta exista en tu backend
            .then(response => {
                setCursos(response.data); // Ajusta según la estructura de tu respuesta
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
                        <h3 className="is-size-3" ><strong>Mis cursos</strong></h3>
                        <table className="table is-fullwidth">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Cant. Créditos</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cursos.map(curso => (
                                <tr key={curso.id}>
                                    <td>{curso.id}</td>
                                    <td>{curso.nombre_curso}</td>
                                    <td>{curso.creditos}</td>
                                    <td>
                                        <Link to={'/evaluacion/crear/' + curso.id}>Crear evaluación</Link>
                                    </td>
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
