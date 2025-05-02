import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {useForm} from "react-hook-form";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';
import Swal from 'sweetalert2';

export default function PageCrearCurso() {
    document.title = 'Crear curso';
    const {register, setValue, handleSubmit, formState: {errors}, watch, reset} = useForm();
    const [cursos, setCursos] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const guardarCurso = function (data) {
        const res = axios.post('/api/curso/store', data).then((r) => {

            Swal.fire({
                icon: "success",
                title: "El curso se registro correctamente",
                // text: "Something went wrong!",
            });

            reset({nombre_curso: '', creditos: '', user_id: '-'});
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


            // Llama a la API para obtener docentes
            axios.get('/api/docentes/listar')
                .then(response => {
                    setDocentes(response.data);
                })
                .catch(error => {
                    console.error('Error al cargar docentes:', error);
                });


    }, []);

    return (
        <>
            <ToastContainer/>
            <div className="container pt-5">
                <div className="columns is-centered">
                    <div className="column">
                        <h3 className="has-text-weight-bold is-size-3">Crear curso</h3>
                        <form onSubmit={handleSubmit(guardarCurso)}>
                            <div className="field">
                                <p className="control">
                                    Nombre del curso <input type="text" {...register('nombre_curso')}
                                                            className="input"/>
                                </p>
                            </div>
                            <div className="field">
                                <label className="label">Seleccione docente</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select {...register('user_id')} defaultValue="-">
                                            <option disabled value="-">—Seleccionar—</option>
                                            {docentes.map(docente => (
                                                <option key={docente.id} value={docente.id}>
                                                    {docente.nombres} {docente.apellidos}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Numeró de creditos</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                    <select {...register('creditos')}>
                                            <option disabled value="-">—Seleccionar—</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <p className="control">
                                    <button className="button is-success">
                                        Crear curso
                                    </button>
                                </p>
                            </div>
                        </form>
                        <br/>
                        <h3 className="is-size-3" ><strong>Lista de cursos</strong></h3>
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
                                    {/*<td>*/}
                                    {/*    <Link to={'/evaluacion/crear/' + curso.id}>Crear evaluación</Link>*/}
                                    {/*</td>*/}
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
