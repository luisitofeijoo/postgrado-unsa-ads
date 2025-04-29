import React, {useEffect, useState, useRef} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CircleSpinnerOverlay, FerrisWheelSpinner} from 'react-spinner-overlay';
import Swal from 'sweetalert2';
import {role} from "@/utils/utils";

export default function PagePUAAsistenciasEliminados() {
    const [asistencia, setAsistencia] = useState([]);

    useEffect(() => {
        axios.get(route('pua.asistencias.eliminadas')) // Cambia la URL si es necesario
            .then(response => {
                setAsistencia(response.data);
            })
            .catch(error => {
                console.error("Error al obtener los datos", error);
            });
    }, []);


    return (
        <div className="container">
            <hr/>
            <h1 className="is-size-4 mb-3"><strong>Relación de asistencias eliminadas</strong> [ {asistencia.length} ]</h1>
            <table border="1" className="table is-fullwidth">
                <thead>
                <tr>
                    <th></th>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Pabellón</th>
                    <th>Piso</th>
                    <th>Aula</th>
                    <th>Fecha de asistencia</th>
                    <th></th>
                    <th>Fecha eliminada</th>
                    <th>Usuario</th>
                </tr>
                </thead>
                <tbody>
                {asistencia.map((item, index) => (
                    <tr key={index}>
                        <td>{++index}</td>
                        <td>{item.postulante.nombres}</td>
                        <td>{item.postulante.apellidos}</td>
                        <td>{item.postulante.pabellon}</td>
                        <td>{item.postulante.piso}</td>
                        <td>{item.postulante.aula}</td>
                        <td>{item.fecha_asistencia}</td>
                        <td>{item.dj === 1 && (<span className="tag is-link is-light">Declaración jurada</span>)}</td>
                        <td><article class="pt-0 pb-0 message is-danger">
                            <div class="pt-0 pb-0 message-body">{item.deleted_at}</div>
                        </article>
                        </td>
                        <td>{item.user.username}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
