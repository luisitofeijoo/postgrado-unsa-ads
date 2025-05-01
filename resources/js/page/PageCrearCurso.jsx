import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {useForm} from "react-hook-form";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';
import Swal from 'sweetalert2';

export default function PageCrearCurso () {
    document.title = 'Crear curso';
    const {register, setValue, handleSubmit, formState: { errors }, watch, reset} = useForm();
    const [cursos, setCursos] = useState([]);
    const guardarCurso = function (data) {
        const res = axios.post('/api/curso/store', data).then((r) => {

            Swal.fire({
                icon: "success",
                title: "El curso se registro correctamente",
                // text: "Something went wrong!",
            });

            reset({nombre_curso: ''});
            setCursos(prev => [r.data, ...prev]);
        });
    }

    useEffect(() => {
        axios.get('/api/cursos') // Asegúrate de que esta ruta exista en tu backend
            .then(response => {
                setCursos(response.data); // Ajusta según la estructura de tu respuesta
            })
            .catch(error => {
                console.error('Error al obtener cursos:', error);
            });
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="container pt-5">
                <div className="columns is-centered">
                    <div className="column is-half">
                        <form onSubmit={handleSubmit(guardarCurso)}>
                            <div className="content">
                                <h1>Crear curso</h1>
                                <div>
                                    Nombre <input type="text" {...register('nombre_curso')}/>
                                    <button>Crear curso</button>
                                </div>
                            </div>
                        </form>
                        <table border="1">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cursos.map(curso => (
                                <tr key={curso.id}>
                                    <td>{curso.id}</td>
                                    <td>{curso.nombre_curso}</td>
                                    <td><a href="">Crear evaluación</a></td>
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
