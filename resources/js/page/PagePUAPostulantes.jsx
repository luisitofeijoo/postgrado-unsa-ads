import React, {useEffect, useState, useRef} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircleSpinnerOverlay, FerrisWheelSpinner } from 'react-spinner-overlay'
import $ from "jquery";
export default  function PagePUAPotulantes () {
    const tableRef = useRef(null);
    const [dataTable, setDataTable] = useState(null);
    const [openModalRegistroProducto, setOpenModalRegistroProducto] = useState(false);
    const {register, setValue, getValues, handleSubmit, reset, formState: {errors}, watch} = useForm();
    const [loading, setLoading] = useState(false);

    let tableInstance;

    useEffect(() => {
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
            $(tableRef.current).DataTable().destroy();
        }

        tableInstance = $(tableRef.current).DataTable({
            language: {
                url: '/json/datatable/es-ES.json',
            },
            processing: true,
            serverSide: true,
            ajax: {
                url: route('postulantes' +
                    '.index'),
            },
            error: function(xhr, error, thrown) {
                console.error('Error en la solicitud AJAX:', error);
            },
            columns: [
                {data: 'id', name: 'id'},
                {data: 'dni', name: 'dni'},
                {data: 'apellidos', name: 'apellidos'},
                {data: 'nombres', name: 'nombres'},
                {data: 'pabellon', name: 'pabellon'},
                {data: 'aula', name: 'aula'},
                {data: 'piso', name: 'piso'}
            ],
        });

        setDataTable(tableInstance);
    }, []);

    return <>
        <div className="container pt-5">
            <strong className="is-size-4">Lista de postulantes</strong>
            <table
                className="table table-bordered is-striped data-table display"
                style={{width: '100%'}}
                ref={tableRef}
            >
                <thead>
                <tr>
                    <th>NRO</th>
                    <th>DNI</th>
                    <th>Descripción</th>
                    <th>Apellidos</th>
                    <th>Nombres</th>
                    <th>Pabellón</th>
                    <th>Aula</th>
                    <th>Piso</th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            <ToastContainer/>
        </div>
    </>;
}
