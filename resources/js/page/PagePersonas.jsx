import React, {useEffect, useState, useRef} from 'react';
import $ from "jquery";
import DataTable from 'datatables.net-dt';
import 'datatables.net-bm';
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import RegistrarActualizarPersona from "@/page/RegistrarActualizarPersona";
import {role} from "@/utils/utils";

export default function () {
    const tableRef = useRef(null);
    const navigate = useNavigate();
    const [openModalPersona, setOpenModalPersona] = useState(false);
    const [modalTransaccionPersona, setModalTransaccionPersona] = useState(false);
    const [openModalRegistroPersona, setModalRegistroPersona] = useState(false);
    const [persona, setPersona] = useState({
        avatar: ''
    });
    const [isLoadingPersona, setIsLoadingPersona] = useState(false);
    const [isLoadingTransaccion, setIsLoadingTransaccion] = useState(false);

    let dataTable;

    useEffect(() => {
        dataTable = $(tableRef.current).DataTable({
            language: {
               // url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
            },
            processing: true,
            serverSide: true,
            ajax: route('persona.index'),
            error: function (xhr, error, thrown) {
                // Manejo de errores aquí
                console.error('Error en la solicitud AJAX:', error);
            },
            columns: [
                {
                    data: null,
                    name: 'checkbox',
                    orderable: false,
                    searchable: false,
                    render: function (data, type, row) {
                        return '<label class="checkbox"><input type="checkbox" class="table-item-checkbox" data-id="' + row.id + '"></label>';
                    }
                },
                {
                    data: 'DT_RowIndex',
                    name: 'DT_RowIndex',
                    render: (data) => String(data).padStart(3, '0'),
                    searchable: false
                },
                {data: 'nro_documento', name: 'nro_documento'},
                {data: 'apellido_paterno', name: 'apellido_paterno'},
                {data: 'apellido_materno', name: 'apellido_materno'},
                {data: 'nombres', name: 'nombres'},
                {
                    data: 'action',
                    name: 'action',
                    orderable: false,
                    searchable: false,
                    className: 'has-text-right',
                    createdCell: (td, cellData, rowData, row, col) => {
                        //Editar persona
                        $(td).on('click', '.edit-persona', () => {
                            navigate('/persona/editar/' + rowData.id);
                        });

                        $(td).on('click', '.add-bien', () => {
                            navigate('/persona/editar/'+ rowData.id + '/asignar-bien');
                        });

                        //Ver persona
                        $(td).on('click', '.view-persona', () => {
                            verPersona(rowData.id);
                        });

                        //Eliminar persona
                        $(td).on('click', '.delete-persona', () => {
                            if (confirm("¿Esta seguro de elimnar este registro?")) deletePersona(rowData.id);
                        });
                    },
                },
            ],

        });

    }, []);

    const procesarReporte = () => {
        let tableItemCheckbox = $(".table-item-checkbox:checked");
        if (tableItemCheckbox.length > 0) {
            let personasCheckbox = Array.from(tableItemCheckbox).map((checkbox) => checkbox.getAttribute('data-id'));
            const width = 750;
            const height = 550;
            const left = window.innerWidth / 2 - width / 2;
            const top = window.innerHeight / 2 - height / 2;
            window.open('/reporte/pdf-fotocheck?selected=' + personasCheckbox, 'Reporte ' + Date.now(), `width=${width}, height=${height}, left=${left}, top=${top}`);
        } else {
            toast.warning("No ha seleccionado ninguna persona.", {position: "bottom-right", theme: "colored"});
        }
    }

    const verPersona = async (id) => {
        setOpenModalPersona(true);
        setIsLoadingPersona(true);
        try {
            let response = await axios.get(route('persona.show', id));
            setPersona(response.data);
        } catch (error) {
            setOpenModalPersona(false);
            /* .: toast.error("Ocurrio un error, vuelva  intentarlo");*/
        } finally {
            setIsLoadingPersona(false);
        }
    }

    const verTransaccion = async (id) => {
        setModalTransaccionPersona(true);
        setIsLoadingTransaccion(true);
        try {
        } catch (error) {
            setIsLoadingTransaccion(false);
        } finally {
            setIsLoadingTransaccion(false);
        }
    }

    //Eliminar persona
    const deletePersona = async (id) => {
        try {
            const response = await axios.delete(route('persona.destroy', id));
            dataTable.draw();
            toast.success("Registro eliminado correctamente.");
        } catch (error) {
            toast.error("No se ha podido eliminar el registro.");
        } finally {

        }
    }

    const registrarPersona = (value) => {
        setModalRegistroPersona(value);
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
                        <h3 className="has-text-weight-bold mb-0">Personas</h3>
                    </div>
                    <div className="column has-text-right is-inline-block">
                        <div className="field">
                            <button type="submit" className="button is-warning" onClick={procesarReporte}>
                                <i className="fa fa-send"></i>
                            </button>
                            <button className="button is-primary ml-2">
                                <i className="fa fa-file-excel pr-1"></i>Excel
                            </button>
                            <button className="button is-link ml-2" onClick={() => setModalRegistroPersona(true)}>
                                <i className="fa fa-add pr-1"></i>Nueva persona
                            </button>
                        </div>
                    </div>
                </div>
                <table
                    className="table table-sisnperu table-bordered is-striped data-table display"
                    style={{width: '100%'}}
                    ref={tableRef}
                >
                    <thead>
                    <tr>
                        <th></th>
                        <th>#</th>
                        <th>Dni</th>
                        <th>A. paterno</th>
                        <th>A. materno</th>
                        <th>Nombres</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>

                {/* ************************************* Crear persona +++++++++++++++++++++++++++++++++++++++++++++++ */}
                <div className={`modal ${openModalRegistroPersona ? 'is-active' : ''}`}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head modal-title-card">
                            <p className="modal-card-title">Registro persona</p>
                            <a onClick={() => setModalRegistroPersona(false)}>
                                <i className="far fa-xmark has-text-white"></i>
                            </a>
                        </header>
                        <section className="modal-card-body p-0">
                            <RegistrarActualizarPersona onComplete={(value) => registrarPersona(value)}/>
                        </section>
                    </div>
                </div>

                {/* ************************************ Ver persona ++++++++++++++++++++++++++++++++++++++++++++++++++ */}
                <div className={`modal ${openModalPersona ? 'is-active' : ''}`}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head modal-title-card">
                            <p className="modal-card-title">Persona</p>
                            <a onClick={() => setOpenModalPersona(false)}>
                                <i className="far fa-xmark has-text-white"></i>
                            </a>
                        </header>
                        <section className="modal-card-body">
                            {isLoadingPersona ? (
                                <div className="has-text-centered"> Cargando...</div>
                            ) : (
                                <div className="columns">
                                    <div className="column is-one-third">
                                        <div className="has-text-centered">
                                            <strong className=" has-text-danger">Foto</strong>
                                            <figure className="image is-fullwidth">
                                                <img src={persona.avatar}
                                                     className="is-responsive" alt="imagen"/>
                                            </figure>
                                        </div>
                                    </div>
                                    <div className="column">
                                        <table className="table is-striped is-bordered is-fullwidth">
                                            <tbody>
                                            <tr>
                                                <td><strong>Doc. identidad: </strong></td>
                                                <td className="has-text-weight-semibold">{persona.nro_documento}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Nombres: </strong></td>
                                                <td>{persona?.nombres?.toUpperCase()}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Apellidos paterno: </strong></td>
                                                <td>{persona?.apellido_paterno?.toUpperCase()}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Apellidos materno: </strong></td>
                                                <td>{persona?.apellido_materno?.toUpperCase()}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Fecha de nacimiento: </strong></td>
                                                <td>{persona.fecha_nacimiento}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Lugar de nacimiento: </strong></td>
                                                <td>{persona.lugar_domicilio}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Celular: </strong></td>
                                                <td>{persona.celular}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Estado civil: </strong></td>
                                                <td>{persona.estado_civil}<br/><small>{persona.info_pareja}</small></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Sexo: </strong></td>
                                                <td>{persona.sexo}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Ultima actualización: </strong></td>
                                                <td>{persona.updated_at}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </>);
}
