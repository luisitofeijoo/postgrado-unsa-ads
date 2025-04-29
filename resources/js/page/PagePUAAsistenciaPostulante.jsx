import React, {useEffect, useState, useRef} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CircleSpinnerOverlay, FerrisWheelSpinner} from 'react-spinner-overlay';
import Swal from 'sweetalert2';
import {role} from "@/utils/utils";
export default function PagePUAAsistenciaPostulante() {

    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        reset,
        formState: {errors},
        watch,
    } = useForm();


    const [search, setSearch] = useState('');
    const [asistencia, setAsistencia] = useState(null);
    const [busquedaEnProceso, setBusquedaEnProceso] = useState(false);
    const [isActiveDelete, setIsActiveDelete] = useState(false);
    const [isDJ, setIsDJ] = useState(false);
    const [tipoRegistro, setTipoRegistro] = useState('salida');
    const inputBuscarRef = useRef(null);

    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleBtnBuscar = () => {
        setSearch((prevSearch) => {
            if (prevSearch.trim() !== '') {
                buscarPersona(prevSearch);
            }
            return prevSearch;
        });
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            setSearch((prevSearch) => {
                if (prevSearch.trim() !== '') {
                    buscarPersona(prevSearch);
                }
                return prevSearch;
            });
        }
    };

    const handleEliminarRegistro = async () => {

        const result = await Swal.fire({
            title: "¡CUIDADO!",
            text: 'Esta apunto de eliminar el registro de comedor del estudiante: [ ' + asistencia.persona.nro_documento + ' ] ' + asistencia.persona.nombres + ' ' + asistencia.persona.apellido_paterno + ' '+ asistencia.persona.apellido_materno + ', ¿Desea continuar?',
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#6f7280",
            confirmButtonText: "Si",
            cancelButtonText: "No",
        });

        if (result.isConfirmed) {

            setIsActiveDelete(true);

            try {
                const response = await axios.post('/api/asistencia/eliminar/' + asistencia.asistencia.id);
                const data = response.data;
                setAsistencia(null);
                inputBuscarRef.current.focus();

                toast.success('Registro del postulante eliminado correctamente.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });

            } catch (error) {

                toast.error('Ocurrio un error, nose pudo eliminar el registro de asistencia del postulante.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });

            } finally {
                setIsActiveDelete(false);
            }

        }
    }

    const buscarPersona = async (dni) => {

        // Verificar si la búsqueda ya está en proceso
        if (busquedaEnProceso) {
            return;
        }

        // Actualizar el estado para indicar que la búsqueda está en proceso
        setAsistencia(null);
        setBusquedaEnProceso(true);

        inputBuscarRef.current.focus();
        inputBuscarRef.current.value = "";
        setSearch("");

        try {
            // Realiza la solicitud GET al servidor utilizando Axios
            const response = await axios.get(`/api/asistencia/guardar/${dni}`, {
                params: {tipoRegistro}
            });
            const data = response.data;
            console.log(response);
            //Actualiza el estado con los datos obtenidos
            setAsistencia(data);
        } catch (error) {
            setAsistencia(null);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Postulante no encontrado.",
            });
        } finally {
            // Restablecer el estado después de que la función haya terminado
            setBusquedaEnProceso(false);
            setIsDJ(false);
        }
    };

    const estadoClases = {
        nuevo: 'is-success',
        registrado: 'is-danger',
        no_encontrado: 'is-danger',
        turno_incorrecto: 'is-warning'
    }

    useEffect(() => {
        inputBuscarRef.current.focus();
    }, []);

    const handleCheckboxChange = (event) => {
        setIsDJ(event.target.checked);
        // Aquí puedes agregar cualquier otra lógica que necesites cuando el checkbox cambie
    };

    const handleChangeTipoRegistro = (event) => {
        const nuevoTipoRegistro = event.target.value;
        setTipoRegistro(nuevoTipoRegistro);
        // Aquí puedes guardar el nuevo tipo de registro en algún lugar, como en el estado local o en un sistema de gestión de estado
        // Por ejemplo, si quieres guardarlo en el estado local del componente:
        localStorage.setItem('tipoRegistro', nuevoTipoRegistro);
    };

    useEffect(() => {
        const tipoRegistroGuardado = localStorage.getItem('tipoRegistro');
        if (tipoRegistroGuardado) {
            setTipoRegistro(tipoRegistroGuardado);
        }


    }, []);

    return (
        <>
            <br/>

            {isActiveDelete && (<>
                    <CircleSpinnerOverlay
                        loading={isActiveDelete}
                        overlayColor="rgba(255,255,255,0.8)"
                        message={"Procesando, espere un momento porfavor..."}
                    /></>
            )}
            <ToastContainer/>
            <div className="container">
                <h5 className="has-text-centered mb-2 is-size-4 has-text-weight-semibold">Registro de comedor 2025</h5>
                <div className="columns is-mobile">
                    <div className="column is-three-fifths is-offset-one-fifth">
                        <div className="field has-addons">
                            <p className="control">
                                    <div className="select is-primary ">
                                        <select value={tipoRegistro} onChange={handleChangeTipoRegistro}>
                                            <option value="1">DESAYUNO</option>
                                            <option value="2">REFRIGERIO MAÑANA</option>
                                            <option value="3">ALMUERZO</option>
                                            <option value="4">REFRIGERIO TARDE</option>
                                            <option value="5">CENA</option>
                                        </select>
                                    </div>
                            </p>
                            <div className="control is-expanded">
                                <input
                                    type="number"
                                    onChange={handleChangeSearch}
                                    onKeyDown={handleKeyPress}
                                    ref={inputBuscarRef}
                                    className="input"
                                    placeholder="Ingrese nro de DNI"
                                />
                            </div>
                            <div className="control">
                                <a className="button is-link" onClick={handleBtnBuscar}>
                                    <i className="far fa-search"></i>
                                </a>
                            </div>
                        </div>
                       {/* {role("admin") && (<>
                            <label className="checkbox mb-2">
                                <input type="checkbox" className="mr-1"
                                       checked={isDJ}
                                       onChange={handleCheckboxChange}
                                /> Con declaración jurada <strong> [opcional]</strong>
                            </label>
                        </>)}*/}
                        {busquedaEnProceso && (
                            <div className="has-text-centered">
                                <div className="lds-ellipsis">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {asistencia && (<>
                    <article className={"panel " + estadoClases[asistencia.estado]}>
                            <p className="panel-heading has-text-centered has-text-weight-normal is-size-6-mobile"
                               dangerouslySetInnerHTML={{__html: asistencia.mensaje + ' .:. <strong class="has-text-white">' + asistencia.asistencia?.fecha+ '<strong>'}}>
                            </p>
                            <div className="card">
                                <div className="card-content">
                                    <div className="content pb-5">
                                        <div className="columns is-vcentered">
                                            <div className="column">
                                                <div className="is-size-3">
                                                    <article className="media">
                                                        <figure className="media-left">
                                                            <p>
                                                                <img
                                                                    src={"/img/sexo/"+asistencia.persona?.sexo+".jpg"} width="200px"/>
                                                            </p>
                                                        </figure>
                                                        <div className="media-content">
                                                            <div className="content">
                                                                <p>
                                                                    <strong>DNI:</strong> {asistencia.persona?.nro_documento}
                                                                    <br/>
                                                                    <span
                                                                        className={"is-size-2 is-size-6-mobile is-uppercase is-block mt-3 mb-3"}>
                                                                        {asistencia.persona?.nombres}  {asistencia.persona?.apellido_paterno} {asistencia.persona?.apellido_materno}</span>
                                                                </p>
                                                                <div
                                                                    className="mt-5 box is-align-items-center is-full is-fullwidth">
                                                                    <p className="m-0 p-0 is-size-6">GRADO
                                                                        Y SECCIÓN</p>
                                                                    <p className="is-size-2 is-size-6-mobile has-text-weight-bold">
                                                                        {asistencia.persona?.estudiante?.grado} &nbsp;
                                                                        "{asistencia.persona?.estudiante?.seccion}"
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {/*  <nav className="level is-mobile">
                                                                <div className="level-left">
                                                                    <a className="level-item">
                                                                        <span className="icon is-small"><i
                                                                            className="fas fa-reply"></i></span>
                                                                    </a>
                                                                    <a className="level-item">
                                                                        <span className="icon is-small"><i
                                                                            className="fas fa-retweet"></i></span>
                                                                    </a>
                                                                    <a className="level-item">
                                                                        <span className="icon is-small"><i
                                                                            className="fas fa-heart"></i></span>
                                                                    </a>
                                                                </div>
                                                            </nav>*/}
                                                        </div>
                                                        <div className="media-right">

                                                        </div>
                                                    </article>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                      <div className='has-text-centered'>
                            {estadoClases[asistencia.estado] === 'is-success' && (<>
                                <article class="message is-warning">
                                    <div className="message-body">
                                        <i><strong>Nota:</strong> Solo utilizar el botón <em>eliminar</em> si tuvo una
                                            equivocación en el registro.</i>
                                        <a className='has-text-centered' onClick={handleEliminarRegistro}> <strong
                                            className='pl-2 has-text-link'>Eliminar</strong></a>
                                    </div>
                                </article>
                            </>)}
                        </div>
                    </>
                )}
            </div>
        </>);
}
