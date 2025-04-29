import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import {Navigate, Outlet, NavLink, Link, useNavigate} from 'react-router-dom';

export default function PageResumenComidaFecha() {
    const [comidas, setComidas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Asumiendo que tu API puede filtrar por 'id' si es necesario,
            // o simplemente trae todos si 'id' no se usa aquí.
            const resp = await axios.get(`/api/resumen-comidas/listar`); // Ajusta la URL si es necesario
            setComidas(resp.data);
            console.log(resp.data);

        } catch (err) {
            console.error("Error fetching data:", err);
            setError("No se pudieron cargar los registros de comidas.");
            // Opcional: Mostrar notificación de error
            // toast.error("Error al cargar datos");
        } finally {
            setIsLoading(false);
        }
    }, []); // Sin dependencias si no usa 'id'

    const convertirFecha = (fecha) => {
        // fecha: "12/12/2025"
        const [dia, mes, anio] = fecha.split('/');
        return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (<>
        <div className="container mb-4 pb-5">
            <h1 className="is-size-5 mt-5 mb-5"><strong>RESUMEN DE CONSUMO GENERAL</strong></h1>
            <table className="table is-narrow is-fullwidth is-striped">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>DESAYUNO</th>
                    <th>REFRIGERIO MAÑANA</th>
                    <th>ALMUERZO</th>
                    <th>REFRIGERIO TARDE</th>
                    <th>CENA</th>
                </tr>
                </thead>
                <tbody>
                {comidas.map((comida, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{comida.fecha}</td>
                        <td>{comida.desayuno} <Link to={`/registro/comida/edit/${convertirFecha(comida.fecha)}/1`}><i
                            className="far fa-edit"></i></Link></td>
                        <td>{comida.ref1} <Link to={`/registro/comida/edit/${convertirFecha(comida.fecha)}/2`}><i
                            className="far fa-edit"></i></Link></td>
                        <td>{comida.almuerzo} <Link to={`/registro/comida/edit/${convertirFecha(comida.fecha)}/3`}><i
                            className="far fa-edit"></i></Link></td>
                        <td>{comida.ref2} <Link to={`/registro/comida/edit/${convertirFecha(comida.fecha)}/4`}><i
                            className="far fa-edit"></i></Link></td>
                        <td>{comida.cena} <Link to={`/registro/comida/edit/${convertirFecha(comida.fecha)}/5`}><i
                            className="far fa-edit"></i></Link></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

    </>);
}
