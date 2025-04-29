import React, {useEffect, useRef, useState} from 'react';
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import axios from 'axios';
import $ from "jquery";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import FormRegEditarProducto from "@/components/FormRegEditarProducto";

export default function PageProductos() {

    const tableRef = useRef(null);
    const navigate = useNavigate();
    const [dataTable, setDataTable] = useState(null);
    const [openModalRegistroProducto, setOpenModalRegistroProducto] = useState(false);
    let tableInstance;

    useEffect(() => {

          tableInstance = $(tableRef.current).DataTable({
            language: {
                //url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
            },
            processing: true,
            serverSide: true,
            ajax: {
                url:route('producto.index'),


            },

            error: function(xhr, error, thrown) {
                // Manejo de errores aquí
                console.error('Error en la solicitud AJAX:', error);
            },
            initComplete: function () {
            /*    // Crear el filtro de marca y agregarlo al encabezado de la tabla
                var select = $('<select id="marcaFilter" class="select"><option value="">Todas las marcas</option></select>')
                    .appendTo($(tableRef.current).closest('.dataTables_wrapper').find('.dataTables_filter'))
                    .on('change', function () {
                        dataTable.ajax.reload(); // Recargar la tabla cuando cambia el filtro de marca
                    });

                // Agregar las marcas predefinidas al filtro de marca
                marcas.forEach(function (marca) {
                    select.append('<option value="' + marca + '">' + marca + '</option>');
                });*/

            },
            columns: [
                {data: 'id', name: 'id'},
                {
                    data: 'disponible',
                    name: 'disponible',
                    render: function(data, type, full, meta) {
                        // Aquí puedes personalizar cómo se muestra la columna
                        if (data === 1) {
                            return '<i class="fas fa-check-circle has-text-success"></i>'; // Icono de check si está disponible
                        } else {
                            return '<i class="fas fa-times-circle has-text-danger"></i>'; // Icono de cross si no está disponible
                        }
                    }
                },
                {data: 'codigo_patrimonial', name: 'codigo_patrimonial'},
                {data: 'nombre', name: 'nombre'},
                {data: 'marca', name: 'marca'},
                {data: 'modelo', name: 'modelo'},
                {data: 'serie', name: 'serie'},
                {data: 'color', name: 'color'},
                {data: 'situacion', name: 'situacion'},
                {data: 'estado', name: 'estado'},
                {
                    data: 'action',
                    name: 'action',
                    orderable: false,
                    searchable: false,
                    className: 'has-text-right',
                    createdCell: (td, cellData, rowData, row, col) => {
                        //Eliminar persona
                        $(td).on('click', '.delete-producto', () => {
                            if (confirm("¿Esta seguro de elimnar este bien?")) deleteProducto(rowData.id);
                        });

                        $(td).on('click', '.edit-producto', () => {
                            navigate('/producto/editar/' + rowData.id);
                        });
                    },
                }
            ],

        });

        setDataTable(tableInstance);
    }, []);

    const deleteProducto = async (id) => {
        try {
            await axios.delete(route('producto.destroy', id));
            toast.success("Registro eliminado correctamente.");
            tableInstance.draw();
        } catch (error) {

            toast.error("No se ha podido eliminar el registro.");
        } finally {

        }
    }

    const registrarProducto = (value) => {
        setOpenModalRegistroProducto(false);
        if (tableRef.current) {
            const dataTableInstance = $(tableRef.current).DataTable();
            dataTableInstance.draw();
        }
    }

    return (
        <>
            <div className="container">
                <div className="columns content pt-3" style={{borderBottom: "1px solid #c6d4e1"}}>
                    <div className="column">
                        <h3 className="has-text-weight-bold mb-0">Bienes</h3>
                    </div>
                    <div className="column has-text-right is-inline-block">
                        <div className="field">
                            <button className="button is-link ml-2" onClick={() => setOpenModalRegistroProducto(true)}>
                                <i className="fa fa-add pr-1"></i>Nuevo bien
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <table
                        className="table table-bienes table-bordered is-striped data-table display"
                        style={{width: '100%'}}
                        ref={tableRef}
                    >
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th>CÓDIGO</th>
                                <th>NOMBRE</th>
                                <th>MARCA</th>
                                <th>MODELO</th>
                                <th>SERIE</th>
                                <th>COLOR</th>
                                <th>S</th>
                                <th>ESTADO</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
            {/* ************************************* Crear persona +++++++++++++++++++++++++++++++++++++++++++++++ */}
            <div className={`modal ${openModalRegistroProducto ? 'is-active' : ''}`}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head modal-title-card">
                        <p className="modal-card-title">Registro producto</p>
                        <a onClick={() => setOpenModalRegistroProducto(false)}>
                            <i className="far fa-xmark has-text-white"></i>
                        </a>
                    </header>
                    <section className="modal-card-body p-0">
                       <FormRegEditarProducto onComplete={(value) => registrarProducto(value)}/>
                    </section>
                </div>
            </div>
        </>
    );
}
