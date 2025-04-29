import React, {useEffect, useState, useRef} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import $ from "jquery";
import axios from "axios";
import {useForm} from "react-hook-form";
import LoadingButton from "@/components/LoadingButton";

export default function Areas() {
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
                url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
            },
            processing: true,
            serverSide: true,
            ajax: {
                url: route('oficina.index'),
            },
            error: function(xhr, error, thrown) {
                console.error('Error en la solicitud AJAX:', error);
            },
            columns: [
                {data: 'id', name: 'id'},
                {data: 'descripcion', name: 'descripcion'},
                {
                    data: 'action',
                    name: 'action',
                    orderable: false,
                    searchable: false,
                    className: 'has-text-right',
                    createdCell: (td, cellData, rowData, row, col) => {
                        $(td).on('click', '.eliminar-categoria', () => {
                            if (confirm("¿Esta seguro de elimnar este bien?")) eliminarCategoria(rowData.id);
                        });
                    },
                }
            ],
        });

        setDataTable(tableInstance);
    }, []);
    const eliminarCategoria = async (id) => {
        try {
            await axios.delete(route('oficina.destroy', id));
            tableInstance.draw();
            toast.success("Registro eliminado correctamente.");
        } catch (error) {
            toast.error("No se ha podido eliminar el registro.");
        }
    }
    const guardarCategoria = async (data) => {
        try {
            setLoading(true);
            const response = await axios.post(route('oficina.store'), data);
            reset()
            setOpenModalRegistroProducto(false);
            if (tableRef.current) {
                const dataTableInstance = $(tableRef.current).DataTable();
                dataTableInstance.draw();
            }
            toast.success('Registro guardado correctamente.');

        } catch (e) {
            toast.error('Ocurrio algunos problemas');
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    return <>
        <div className="container">
            <br/>
            <div className="has-text-right mb-5">
                <button className="button is-link" onClick={() => setOpenModalRegistroProducto(true)}>
                    <i className="fa fa-add pr-2"></i>Nueva Oficina
                </button>
            </div>
            <table
                className="table table-bordered is-striped data-table display"
                style={{width: '100%'}}
                ref={tableRef}
            >
                <thead>
                <tr>
                    <th>id</th>
                    <th>Descripción</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            <ToastContainer />
            <div className={`modal ${openModalRegistroProducto ? 'is-active' : ''}`}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <form onSubmit={handleSubmit(guardarCategoria)}>
                        <header className="modal-card-head modal-title-card">
                            <p className="modal-card-title">Registro de Oficinas</p>
                            <a onClick={() => setOpenModalRegistroProducto(false)}>
                                <i className="far fa-xmark has-text-white"></i>
                            </a>
                        </header>
                        <section className="modal-card-body p-5">
                            <label htmlFor="titulo">Descripción</label>
                            <input type="text" className="input" {...register('descripcion')}  placeholder="Escriba la categoria" required/>
                        </section>
                        <section className="modal-card-foot">
                            <LoadingButton
                                type="submit"
                                className="button is-link"
                                isLoading={loading}
                                loadingText="Guardando..."
                                text='Crear'
                                disabled={loading}
                            />
                        </section>
                    </form>
                </div>
            </div>
        </div>
    </>;
}
