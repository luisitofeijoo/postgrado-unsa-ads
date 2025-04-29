import React, {useEffect, useState, useRef, useCallback} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import route from 'ziggy-js';
import $ from "jquery";
import LoadingButton from "@/components/LoadingButton";
import {toast} from "react-toastify";
import {Link, useNavigate} from "react-router-dom";

function Inbox() {
    const {register, setValue, getValues, handleSubmit, reset, formState: {errors}, watch} = useForm();
    const navigate = useNavigate();
    const tableRef = useRef(null);
    const tableInstanceRef = useRef(null); // Cambiar la instancia de la tabla a un ref
    const [dataTable, setDataTable] = useState(null);
    const [modalCrearCuenta, setModalCrearCuenta] = useState(false);
    const [tipoApertura, setTipoApertura] = useState('');
    const [oficinas, setOficinas] = useState([]);

    const [openModalPersona, setOpenModalPersona] = useState(false);
    const [openModalDerivar, setOpenModalDerivar] = useState(false);

    const [isLoadingPersona, setIsLoadingPersona] = useState(false);
    const [isExpedienteSelected, setIsExpedienteSelected] = useState(false);
    const [isLoadingDerivar, setIsLoadingDerivar] = useState(false);
    const [expediente, setExpediente] = useState({});
    let tableInstance;

    const closeModal = useCallback(() => {
        setModalCrearCuenta(false);
    }, []);

    useEffect(() => {
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
            $(tableRef.current).DataTable().destroy();
        }

        let firstLoad = true; // Variable para controlar si es la primera carga

        tableInstanceRef.current = $(tableRef.current).DataTable({
            language: {
                url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
            },
            processing: true,
            serverSide: true,
            ajax: {
                url: route("expediente.index"),
                data: function (d) {
                    if (firstLoad) {
                        delete d.order;
                    }
                    firstLoad = false;
                },
            },
            columns: [
                { data: "codigo", name: "codigo" },
                { data: "created_at", name: "created_at" },
                { data: "nombre_razonsocial", name: "nombre_razonsocial" },
                { data: "tipo_documento.descripcion", name: "tipo_documento.descripcion" },
                { data: "asunto", name: "asunto" },
                { data: "oficina.descripcion", name: "oficina.descripcion" },
                {
                    data: "action",
                    name: "action",
                    orderable: false,
                    searchable: false,
                    className: "has-text-right",
                    createdCell: (td, cellData, rowData) => {
                        $(td).on("click", ".handle-eliminar", () => {
                            if (confirm("¿Está seguro de eliminar este registro?")) handleDeleteExpediente(rowData.id);
                        });
                        $(td).on("click", ".handle-ver", () => {
                            handleVerExpediente(rowData.id);
                        });
                        $(td).on("click", ".handle-derivar", () => {
                            handleDerivarExpediente(rowData.id);
                        });
                    },
                },
            ],
        });
    }, []);

    const handleDeleteExpediente = async (id) => {
        try {
            const response = await axios.delete(route('expediente.delete', id));
            if (tableInstanceRef.current) {
                tableInstanceRef.current.draw(); // Acceder a la instancia de la tabla a través del ref
            }
            toast.success("Registro eliminado correctamente.");
        } catch (error) {
            toast.error("No se ha podido eliminar el registro.");
        } finally {

        }
    }

    const handleVerExpediente = async (id) => {
        setOpenModalPersona(true);
        setIsLoadingPersona(true);
        try {
            let response = await axios.get(route('expediente.show', id));
            setExpediente(response.data);
        } catch (error) {
            setOpenModalPersona(false);
            toast.error("Ocurrio un error, vuelva  intentarlo");
        } finally {
            setIsLoadingPersona(false);
        }
    }

    const handleDerivarExpediente = async (id) => {
        setOpenModalDerivar(true);
        setIsLoadingDerivar(true);
        setIsExpedienteSelected((id));
        try {
            let response = await axios.get(route('oficina.index'));
            setOficinas(response.data.data);
        } catch (error) {
            setOpenModalDerivar(false);
            toast.error("Ocurrio un error, vuelva  intentarlo");
        } finally {
            setIsLoadingDerivar(false);
        }
    }
    const registrarMovimientoExpediente = async (data) => {
        try {
           const response = await axios.post(route('expediente.movimiento', [isExpedienteSelected]), data);
            setOpenModalDerivar(false);

            // Actualizar la tabla
            if (tableInstanceRef.current) {
                tableInstanceRef.current.draw(); // Acceder a la instancia de la tabla a través del ref
            }
            toast.success("Se ha derivado correctamente el expediente.");
        } catch (e) {
            toast.error("Ocurrió un error, vuelve a intentarlo.");
        }
    };


    return (
        <div>
            <div className="container pt-6">
                {/* Depósito de Cuenta */}
                <div className="columns">
                    <div className="column"><span className="is-size-3 mt-5 pb-3 pt-3">Registro de expedientes</span>
                    </div>
                    <div className="column has-text-right">
                        <a className="button is-success mr-2" target="_blank" href="/rpt/pdf/expedientes">
                            <i className="fa fa-print"></i><span className="pl-2">Imprimir</span>
                        </a>
                        <Link className="button is-link" to="/doc/registro">
                            <i className="fa fa-plus"></i> Registrar expediente
                        </Link>
                    </div>
                </div>
                <table className="table is-fullwidth" ref={tableRef}>
                    <thead>
                    <tr>
                        <th>N° REG.</th>
                        <th>FECHA DE REG.</th>
                        <th>REMITENTE</th>
                        <th>TIPO DOC.</th>
                        <th>ASUNTO</th>
                        <th>OFICINA</th>
                        <th style={{width:'150px'}}></th>
                    </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
            <div className={`modal ${openModalPersona ? 'is-active' : ''}`}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head modal-title-card">
                        <p className="modal-card-title">Expediente</p>
                        <a onClick={() => setOpenModalPersona(false)}>
                            <i className="far fa-xmark has-text-white"></i>
                        </a>
                    </header>
                    <section className="modal-card-body">
                        {isLoadingPersona ? (
                            <div className="has-text-centered"> Cargando...</div>
                        ) : (
                            <div className="columns">
                                <div className="column">
                                    <table className="table is-striped is-bordered is-fullwidth">
                                        <tbody>
                                        <tr>
                                            <td><strong>NRO: </strong></td>
                                            <td className="has-text-weight-semibold">{expediente.codigo}</td>
                                            <td><strong>NRO DE FOLIO: </strong></td>
                                            <td className="has-text-weight-semibold">{expediente.folio}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>FECHA DE INGRESO: </strong></td>
                                            <td colSpan="3">{expediente.created_at}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>TIPO DOCUMENTO: </strong></td>
                                            <td colSpan="3">{expediente?.tipo_documento?.descripcion}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>ASUNTO: </strong></td>
                                            <td colSpan="3">{expediente.asunto}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>DETALLE DEL DOCUMENTO: </strong></td>
                                            <td colSpan="3">{expediente.descripcion}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>REMITENTE: </strong></td>
                                            <td colSpan="3">{expediente.nro_documento} - {expediente.nombre_razonsocial}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>CELULAR: </strong></td>
                                            <td colSpan="3">{expediente.celular}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>DIRECCIÓN: </strong></td>
                                            <td colSpan="3">{expediente.direccion}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>CELULAR: </strong></td>
                                            <td colSpan="3">{expediente.email}</td>
                                        </tr>
                                        <tr className="has-background-warning-light">
                                            <td><strong>OFICINA: </strong></td>
                                            <td colSpan="3">{expediente.oficina?.descripcion}</td>
                                        </tr>

                                        <tr className="has-background-warning-light">
                                            <td><strong>TRAMITE: </strong></td>
                                            <td colSpan="3">{expediente.detalle_derivado}</td>
                                        </tr>

                                        <tr className="has-background-warning-light">
                                            <td><strong>FECHA DE ENVIO: </strong></td>
                                            <td colSpan="3">{expediente.fecha_derivado}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
            <form onSubmit={handleSubmit(registrarMovimientoExpediente)}>
                <div className={`modal ${openModalDerivar ? 'is-active' : ''}`}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head modal-title-card">
                            <p className="modal-card-title">Derivar Expediente</p>
                            <a onClick={() => setOpenModalDerivar(false)}>
                                <i className="far fa-xmark has-text-white"></i>
                            </a>
                        </header>
                        <section className="modal-card-body">
                            {isLoadingDerivar ? (
                                <div className="has-text-centered"> Cargando...</div>
                            ) : (
                                <div className="columns">
                                    <div className="column">
                                        <table className="table is-striped is-bordered is-fullwidth">
                                            <tbody>
                                            <tr>
                                                <td><strong>ÁREA DESTINO: </strong></td>
                                                <td className="has-text-weight-semibold">
                                                    <div className="control">
                                                        <div className="select is-fullwidth">
                                                            <select {...register('oficina_id', {
                                                                value: '',
                                                                required: true
                                                            })} required>
                                                                <option disabled value="">—Seleccionar—</option>
                                                                {oficinas.map((oficina, index) => (
                                                                    <option key={index} value={oficina.id}>
                                                                        {oficina.descripcion}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>DESCRIPCIÓN:</strong></td>
                                                <td>
                                                    <textarea
                                                        {...register('detalle_derivado')}
                                                        className="input" style={{height:'100px'}} placeholder="Escribe aqui..." required>
                                                    </textarea>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </section>
                        <footer className="modal-card-foot">
                            <div className="buttons">
                                <button type="submit" className="button is-link">Derivar</button>
                                <button className="button is-danger" onClick={() => setOpenModalDerivar(false)}>Cancelar</button>
                            </div>
                        </footer>
                    </div>
                </div>
            </form>
        </div>

    );
}

export default Inbox;
