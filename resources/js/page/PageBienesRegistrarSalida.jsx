import React, {useEffect, useState, useRef} from 'react';
import {format} from 'date-fns';
import {useForm} from 'react-hook-form';
import LoadingButton from "@/components/LoadingButton";
import {toast} from "react-toastify";
import {CircleSpinnerOverlay, FerrisWheelSpinner} from 'react-spinner-overlay';

export default function PageBienesRegistrarSalida() {

    const {register, setValue, getValues, handleSubmit, reset, formState: {errors}, watch} = useForm();

    const inputSearchRef = useRef(null);
    const [isLoading, setLoading] = useState(false);
    const [fecha, setFecha] = useState(format(new Date(), 'dd/MM/yyyy'));
    const [tipoRegistro, setTipoRegistro] = useState('salida');
    const [bien, setBien] = useState({});
    const [persona, setPersona] = useState({});
    const [movimiento, setMovimiento] = useState({})
    const [inputSearch, setInputSearch] = useState('');
    const [message, setMessage] = useState({});
    const [bienesSeleccionados, setBienesSeleccionados] = useState([]);
    const [isActiveAlertPage, setIsActiveAlertPage] = useState(false);
    const [openModalAdd, setOpenModelAdd] = useState(false);
    const [showPersonaBienes, setShowPersonaBienes] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [bienesEditados, setBienesEditados] = useState(null); // Estado para rastrear cambios

    const nombreBien = watch('nombre_bien');

    const handleEditClick = (event, index) => {
        event.stopPropagation();
        setEditIndex(index);
    };

    const handleInputChange = (index, field, value) => {
        const updatedBienes = bienesEditados.map((bien, i) =>
            i === index ? {...bien, [field]: value} : bien
        );
        setBienesEditados(updatedBienes);
    };

    const handleSaveClick = async (index) => {
        // Aquí puedes manejar la lógica para guardar los cambios
        const updatedBien = bienesEditados[index];
        try {
            const response = await axios.post(route('producto.update.light'), {
                codigo_patrimonial: updatedBien.codigo_patrimonial,
                serie: updatedBien.serie,
                marca: updatedBien.marca,
                bien_id: updatedBien.bien_id,
            });
            if (response.status === 200) {
                toast.success('Registro actualizado correctamente.', {
                    position: "top-right",
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
                setEditIndex(null);
            } else {
                toast.success('No se ha podido actualizar el registro.', {
                    position: "top-right",
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
            }
        } catch (error) {
            toast.error('Ocurrio un error inesperado.', {
                position: "top-right",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        }

    };
    const handleChangeSearch = (event) => {
        setInputSearch(event.target.value);
    };

    const onBuscar = () => {
        registroMovimientoBien(inputSearch);
    }

    const onEnterKeypress = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            registroMovimientoBien(inputSearch);
        }
    }

    const handleChangeTipoRegistro = (event) => {
        const nuevoTipoRegistro = event.target.value;
        setTipoRegistro(nuevoTipoRegistro);
        // Aquí puedes guardar el nuevo tipo de registro en algún lugar, como en el estado local o en un sistema de gestión de estado
        // Por ejemplo, si quieres guardarlo en el estado local del componente:
        localStorage.setItem('tipoRegistro', nuevoTipoRegistro);
    };

    const registroMovimientoBien = async (codigo_bien, isDocument = true) => {
        setShowPersonaBienes(false);
        setIsActiveAlertPage(false);
        if (codigo_bien.length === 8 && isDocument) {
            buscarBienesPersona(codigo_bien);
            return;
        }
        inputSearchRef.current.focus();
        inputSearchRef.current.value = "";
        setInputSearch("");
        setLoading(true);

        try {
            const response = await axios.post(route('registro.movimiento.bien', {
                codigo_bien: codigo_bien,
                tipo_movimiento: tipoRegistro,
            }));

            if (response.status === 200) {
                setIsActiveAlertPage(true);
                setMessage({
                    status: 'is-primary',
                    text: response.data.message,
                });
            }

            if (response.data.status === 409) {
                setIsActiveAlertPage(true);
                setMessage({
                    status: 'is-warning',
                    text: response.data.message,
                });
            }

            if (response.data.status === 500) {
                setIsActiveAlertPage(true);
                setMessage({
                    status: 'is-danger is-light',
                    text: response.data.message,
                });
            }
            setBienesEditados([]);
            setBien(response.data.bien);
            setPersona(response.data.persona);
            setMovimiento(response.data.movimiento);

        } catch (error) {
            setIsActiveAlertPage(false);
            if (error.response && error.response.status === 404) {
                toast.error('El código ingresado no esta registrado en nuestra base de datos.', {
                    position: "top-right",
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });

                setBien({});
                setPersona({});
                setMovimiento({})
                setBienesEditados([]);
            }
        } finally {
            setLoading(false);
        }
    }
    const buscarBienesPersona = async (nro_documento) => {
        setLoading(true);
        setBienesSeleccionados([]);
        setBienesEditados([]);
        setBien({});
        setPersona({});
        setMovimiento({});
        inputSearchRef.current.value = "";
        setInputSearch("");
        inputSearchRef.current.focus();
        setIsActiveAlertPage(false);

        try {
            const response = await axios.get(route('api.persona.bienes', nro_documento));

            setShowPersonaBienes(true);
            setBienesEditados(response.data.bienes);
            setPersona(response.data.persona);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                registroMovimientoBien(nro_documento, false);
            }
        } finally {
            setLoading(false);
        }
    }
    const anularRegistro = () => {
        if (confirm('Al anular este registro nose guardara la/el ' + tipoRegistro + ' del bien. ¿Desea continuar?')) {
            axios.delete(route('api.movimiento.eliminar', movimiento.id)).then((r) => {
                toast.success('El registro fue eliminado correctamente.', {
                    position: "top-right",
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
                inputSearchRef.current.focus();
                setBien({});
                setPersona({});
                setMovimiento({})
            });
            setIsActiveAlertPage(false);
        }
    }
    const handleRowClick = (index, editIndex) => {
        if(editIndex === index) return;
        const selectedIndex = bienesSeleccionados.indexOf(index);
        if (selectedIndex === -1) {
            setBienesSeleccionados([...bienesSeleccionados, index]);
        } else {
            const newSelected = [...bienesSeleccionados];
            newSelected.splice(selectedIndex, 1);
            setBienesSeleccionados(newSelected);
        }
    };

    const registrarBien = (data) => {
        setLoading(true);
        axios.post(route('registro_rapido_bien', {persona_id: persona.id}), data).then((response) => {

            setBienesEditados(response.data);
            toast.success('Se ha agregado correctamente el/la ' + data.nombre_bien + " lista.", {
                position: "top-right",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });

            setOpenModelAdd(false);
            reset();
        }).catch(() => {
            toast.error('Ocurrio un error al registrar el/la ' + data.nombre_bien + " lista.", {
                position: "top-right",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        }).finally(() => {
            inputSearchRef.current.value = "";
            setInputSearch("");
            inputSearchRef.current.focus();
            setLoading(false);
        });

    }
    const registrarPersonasBienesSalida = async () => {
        setIsActiveAlertPage(false);
        if (bienesSeleccionados.length === 0) {
            alert("No hay seleccionado ningun bien");
            return;
        }

        if (bienesSeleccionados.length === 1) {
            bienesSeleccionados.map((index) => {
                return registroMovimientoBien(parseInt(bienesEditados[index].codigo_patrimonial), false);
            });
            return;
        }

        setLoading(true);

        const id_bienes = bienesSeleccionados.map((index) => {
            return parseInt(bienesEditados[index].bien_id);
        });


        try {
            const response = await axios.post(route('registro.movimiento.bienes'), {
                id_bienes: id_bienes,
                tipo_movimiento: tipoRegistro,
                id_persona: persona.id,
            });


            if (response.data.length > 0) {
                setIsActiveAlertPage(true);
                setMessage({
                    status: 'is-primary',
                    text: 'Todos los bienes seleccionados fueron registrados correctamente.',
                });
            } else {
                setIsActiveAlertPage(true);
                setMessage({
                    status: 'is-warning',
                    text: 'Los bienes seleccionados ya tienen registro.',
                });
            }

        } catch (e) {
            setIsActiveAlertPage(true);
            setMessage({
                status: 'is-danger',
                text: 'No se ha podido registrar ningún registro, intentelo nuevamente..',
            });

        } finally {
            inputSearchRef.current.focus();
            setLoading(false);
        }

    }

    useEffect(() => {
        inputSearchRef.current.focus();
        const tipoRegistroGuardado = localStorage.getItem('tipoRegistro');
        if (tipoRegistroGuardado) {
            setTipoRegistro(tipoRegistroGuardado);
        }
    }, []);

    return (
        <>
            <CircleSpinnerOverlay
                loading={isLoading}
                overlayColor="rgba(255,255,255,0.8)"
                message={"Procesando, espere un momento porfavor..."}
            />

            <div className="container">
                <div className="content">
                    <h4 className="has-text-centered mt-5">Registro de Salida/Ingreso de bienes - {fecha}</h4>
                </div>
                <div className="columns is-centered">
                    <div className="column is-three-fifths pt-3">
                        <div className="has-text-centered mt-2">
                            <div className="field has-addons">
                                <p className="control">
                                    <span className="select">
                                        <select value={tipoRegistro} onChange={handleChangeTipoRegistro}>
                                            <option value="salida">Salida</option>
                                            <option value="ingreso">Ingreso</option>
                                        </select>
                                    </span>
                                </p>
                                <p className="control is-expanded mr-3">
                                    <input
                                        className="input"
                                        type="text"
                                        onChange={handleChangeSearch}
                                        onKeyDown={onEnterKeypress}
                                        ref={inputSearchRef}
                                        placeholder="Ingrese código del bien o ingrese número de documento..."/>
                                </p>
                                <p className="control">
                                    <LoadingButton
                                        type="submit"
                                        className="button is-warning"
                                        onClick={onBuscar}
                                        isLoading={isLoading}
                                        text="Buscar"
                                        loadingText="Consultando..."
                                        disabled={isLoading}
                                    />
                                </p>
                               {/* <p className="control">
                                    <div className="dropdown is-hoverable">
                                        <div className="dropdown-trigger">
                                            <button className="button" aria-haspopup="true" aria-controls="dropdown-menu4">
                                                <span>
                                                    <i className="fa fa-ellipsis-verticalphp "></i>
                                                </span>
                                                <span className="icon is-small">
        <i className="fas fa-angle-down" aria-hidden="true"></i>
      </span>
                                            </button>
                                        </div>
                                        <div className="dropdown-menu" id="dropdown-menu4" role="menu">
                                            <div class="dropdown-content">
                                                <div class="dropdown-item">
                                                    <p>
                                                        You can insert <strong>any type of content</strong> within the
                                                        dropdown menu.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </p>*/}
                            </div>
                        </div>
                    </div>
                </div>
                {isActiveAlertPage && (
                    <section className="mt-0 pt-0 pb-0 section content">
                        <div className={`notification has-text-centered ${message.status}`}>
                            <span className="is-size-6">
                                <i className={`pr-3 fa ${message.status === 'is-primary' ? 'fa-check' : 'fa-close'} is-size-3`}></i>
                                <span dangerouslySetInnerHTML={{__html: message.text}}></span>
                            </span>
                        </div>
                    </section>
                )}
                {Object.keys(bien).length > 0 && (
                    <section className="mt-0 pt-0 section content">
                        <div className="container">
                            <div className="columns is-variable is-1">
                                <div className="column">
                                    <table className="table is-bordered">
                                        <tbody>
                                        <tr>
                                            <td className="has-text-weight-bold">Código:</td>
                                            <td>{bien.codigo_patrimonial}</td>
                                        </tr>
                                        <tr>
                                            <td className="has-text-weight-bold">Nombre del bien:</td>
                                            <td>{bien.nombre}</td>
                                        </tr>
                                        <tr>
                                            <td className="has-text-weight-bold">Marca:</td>
                                            <td>{bien.marca}</td>
                                        </tr>
                                        <tr>
                                            <td className="has-text-weight-bold">Modelo:</td>
                                            <td>{bien.modelo}</td>
                                        </tr>
                                        <tr>
                                            <td className="has-text-weight-bold">Serie:</td>
                                            <td>
                                                {bien.serie}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="has-text-weight-bold">Color:</td>
                                            <td>{bien.color}</td>
                                        </tr>
                                        <tr>
                                            <td className="has-text-weight-bold">Propiedad:</td>
                                            <td>{bien.propiedad}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="column is-narrow">
                                    <div className="card">
                                        <div className="card-content">
                                            <div className="media">
                                                <div className="media-left">
                                                    <figure className="image is-96x96 m-0">
                                                        <img
                                                            src={"/img/personas/default.jpg"}
                                                            alt="Placeholder image"
                                                        />
                                                    </figure>
                                                </div>
                                                <div className="media-content">
                                                    <p className="title is-size-4">{persona.nombres}
                                                        <br/> {persona.apellido_paterno} {persona.apellido_materno}</p>
                                                    <p className="subtitle is-6">
                                                        <strong>DNI: </strong> {persona.nro_documento} <br/>
                                                        <strong>Grado/Sección: </strong>
                                                        <span
                                                            className="is-size-4"> {persona.estudiante?.grado} {persona.estudiante?.seccion}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="has-text-right m-2"><a className="has-text-grey" onClick={anularRegistro}><i
                            className="fa fa-trash-alt"></i> <strong>Anular registro</strong></a></p>
                    </section>
                )}

                {showPersonaBienes && (
                    <section className="mt-0 pt-0 section content">
                        <div className="container">
                            <h5>Usuario</h5>
                            <div className="card mb-5">
                                <div className="card-content p-3">
                                    <div className="media">
                                        <div className="media-left">
                                            <figure className="image is-96x96 m-0">
                                                <img
                                                    src={"/img/personas/default.jpg"}
                                                    alt="Placeholder image"
                                                />
                                            </figure>
                                        </div>
                                        <div className="media-content">
                                            <p className="title is-size-4">{persona.nombres} {persona.apellido_paterno} {persona.apellido_materno}</p>
                                            <p className="subtitle">
                                                <strong>DNI: </strong> {persona.nro_documento} <br/>
                                                <strong>Grado/Sección: </strong>
                                                <span className="is-size-4">
                                                {persona.estudiante?.grado} {persona.estudiante?.seccion}
                                            </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="columns is-variable is-1">
                                <div className="column">
                                    <h5>
                                        Listado de bienes - <span className="has-text-grey">[Seleccione los elementos a registrar]</span>
                                        <button onClick={() => setOpenModelAdd(true)}
                                                className="is-pulled-right button is-black p-0 pr-2 pl-2"
                                                style={{height: "auto"}}>
                                            <i className="fa fa-add"></i>&nbsp; Añadir nuevo
                                        </button>
                                    </h5>
                                    <table className="table is-bordered is-hoverable">
                                        <tbody>
                                        <tr>
                                            <th></th>
                                            <th>CÓDIGO</th>
                                            <th>NOMBRE DEL BIEN</th>
                                            <th>MARCA</th>
                                            <th>SERIE</th>
                                            <th>PROPIEDAD</th>
                                        </tr>
                                        {bienesEditados.map((bien, index) => {
                                            let isChecked = bienesSeleccionados.includes(index);
                                            const rowStyle = isChecked ? {backgroundColor: '#E2DEFA'} : {};

                                            return (
                                                <tr key={index} onClick={() => handleRowClick(index, editIndex)}
                                                    style={rowStyle}>
                                                    <td><input type="checkbox" checked={isChecked} onChange={() => {
                                                    }}/></td>
                                                    <td>{editIndex === index ? (
                                                        <input
                                                            type="text" className="input has-background-warning-light"
                                                            value={bien.codigo_patrimonial}
                                                            onChange={(e) => handleInputChange(index, 'codigo_patrimonial', e.target.value)}
                                                        />
                                                    ) : (
                                                        bien.codigo_patrimonial
                                                    )}</td>
                                                    <td>{bien.nombre}</td>
                                                    <td>{editIndex === index ? (
                                                        <input
                                                            type="text" className="input has-background-warning-light"
                                                            value={bien.marca}
                                                            onChange={(e) => handleInputChange(index, 'marca', e.target.value)}
                                                        />
                                                    ) : (
                                                        bien.marca
                                                    )}</td>
                                                    <td>{editIndex === index ? (
                                                        <input
                                                            type="text" className="input has-background-warning-light"
                                                            value={bien.serie}
                                                            onChange={(e) => handleInputChange(index, 'serie', e.target.value)}
                                                        />
                                                    ) : (
                                                        bien.serie
                                                    )}</td>
                                                    <td>{bien.propiedad}</td>
                                                    <td>
                                                        {editIndex === index ? (
                                                            <button
                                                                className="button is-small is-link px-2 py-1 has-text-weight-bold"
                                                                onClick={() => handleSaveClick(index)}><i
                                                                className="fa fa-save pr-2"></i>GUARDAR</button>
                                                        ) : (
                                                            <button
                                                                className="button is-small is-default px-2 py-1 has-text-weight-bold"
                                                                onClick={(event) => handleEditClick(event, index)}><i
                                                                className="fa fa-pencil pr-2"></i>EDITAR</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                    {bienesSeleccionados.length > 0 && (
                                        <p className="has-text-centered">
                                            <button className="button is-link has-text-weight-semibold"
                                                    onClick={registrarPersonasBienesSalida}>
                                                <i className="fa fa-check"></i> &nbsp; Registrar
                                                ( {bienesSeleccionados.length} )
                                            </button>
                                    </p>)}
                                </div>
                            </div>
                        </div>
                        <div className={`modal ${openModalAdd ? 'is-active' : ''}`}>
                            <div className="modal-background"></div>
                            <div className="modal-card">
                                <header className="modal-card-head modal-title-card">
                                    <p className="modal-card-title">REGISTRO DE EQUIPO TECNOLÓGICO / MUSICAL</p>
                                    <a onClick={() => setOpenModelAdd(false)}>
                                        <i className="far fa-xmark has-text-white"></i>
                                    </a>
                                </header>
                                <section className="modal-card-body">
                                    <form onSubmit={handleSubmit(registrarBien)}>
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td><strong>Nombre del bien*</strong></td>
                                                <td>
                                                    <div className="select is-fullwidth">
                                                        <select {...register('nombre_bien', {
                                                            value: '',
                                                            required: true
                                                        })} required>
                                                            <option disabled value="">—Seleccionar—</option>
                                                            <option value="GUITARRA">GUITARRA</option>
                                                            <option value="PIANO">PIANO</option>
                                                            <option value="TABLET">TABLET</option>
                                                            <option value="COMPUTADORA PERSONAL PORTÁTIL">LAPTOP -
                                                                COMPUTADORA PERSONAL PORTATIL
                                                            </option>
                                                            <option value="COOLER DE LAPTOP">COOLER DE LAPTOP</option>
                                                            <option value="FLAUTA">FLAUTA</option>
                                                            <option value="QUENA">QUENA</option>
                                                            <option value="VIOLIN">VIOLIN</option>
                                                            <option value="CHARANGO">CHARANGO</option>
                                                            <option value="ZAMPOÑA">ZAMPOÑA</option>
                                                            <option value="UKELELE">UKELELE</option>
                                                            <option value="SAXÓFON">SAXÓFON</option>
                                                            <option value="TROMPETA">TROMPETA</option>
                                                            <option value="CLARINETE">CLARINETE</option>
                                                            <option value="ZAMPOÑA">ZAMPOÑA</option>
                                                            <option value="CHARANGO">CHARANGO</option>
                                                            <option value="OTRO">OTRO</option>
                                                        </select>
                                                    </div>
                                                    <hr className="mt-1 mb-1"/>
                                                    {nombreBien === 'OTRO' && (
                                                        <input
                                                            type="text"
                                                            placeholder="Escriba aquí el nombre del equipo/bien..."
                                                            className="input mt-10"
                                                            {...register('otro_nombre_bien', {required: nombreBien === 'OTRO'})}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Marca <small className="has-text-grey">[opcional]</small></strong></td>
                                                <td><input type="text"
                                                           className="input" {...register('marca', {required: false})}/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Serie <small className="has-text-grey">[opcional]</small></strong></td>
                                                <td><input type="text"
                                                           className="input" {...register('serie', {required: false})}/>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>

                                        <p className="has-text-right">
                                            <button type="submit" className="button is-primary">Agregar</button>
                                            <button type="button" className="button ml-2 is-default" onClick={() => {
                                                setOpenModelAdd(false);
                                                reset();
                                            }}>Cancelar
                                            </button>
                                        </p>
                                    </form>
                                </section>
                            </div>
                        </div>
                    </section>

                )}
            </div>
        </>
    );
}
