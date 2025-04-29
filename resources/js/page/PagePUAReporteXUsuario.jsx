import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PagePUAReporteXUsuario() {
    const [asistencia, setAsistencia] = useState([]);

    useEffect(() => {
        axios.get(route('api.asistencia.postulantes.user')) // Cambia la URL si es necesario
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
            <h1 className="is-size-4 mb-3">Relación de asistencias que registraste [ {asistencia.length} ]</h1>
            <table border="1" className="table is-fullwidth">
                <thead>
                <tr>
                    <th>NRO</th>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Pabellón</th>
                    <th>Piso</th>
                    <th>Aula</th>
                    <th>Fecha de asistencia</th>
                    <th></th>
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
                        <td>{item.user.username}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
