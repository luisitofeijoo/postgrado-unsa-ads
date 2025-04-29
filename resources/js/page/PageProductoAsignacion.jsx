import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import FormRegEditarProducto from "@/components/FormRegEditarProducto";
import $ from "jquery";

export default function PageProductoAsignacion() {
    const {id} = useParams();
    const [prestamos, setPrestamos] = useState([]);
    const [reposiciones, setReposiciones] = useState([]);
    const [productos, setProductos] = useState([]);
    const [openModalAsignarProducto, setOpenModalAsignarProducto] = useState(false);
    const [openModalReposicion, setOpenModalReposicion] = useState(false);
    const [formReposicion, setFormReposicion] = useState({reposicion: "", motivo: '',prestamoId: null, persona_id: id});
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingProduct, setLoadingProduct] = useState({});
    const [productosAgregados, setProductosAgregados] = useState([]);
    const [isNuevoBien, setIsNuevoBien] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const resp = await axios.get(`/api/productos/prestamos/${id}`);
                if (resp.status === 200) {
                    setPrestamos(resp.data);
                }
            } catch (error) {
                console.error(error);
            }
        })();

        (async () => {
            try {
                const resp = await axios.get(`/api/productos/reposiciones/${id}`);
                setReposiciones(resp.data);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [id]);

    const handleSearch = async () => {
        setIsNuevoBien(false);
        try {
            const response = await axios.get(`/api/productos/search?searchTerm=${searchTerm}`);
            setProductos(response.data);
            setProductosAgregados([]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAgregarClick = async (index, producto_id, propiedad) => {
        try {
            setLoadingProduct(prevState => ({
                ...prevState,
                [index]: true
            }));

            let motivo = "USO PERSONAL";
            if(propiedad === 'INSTITUCION') {
               motivo = prompt("MOTIVO DE ASIGNACIÓN: ");

                if (motivo === null) {
                    // El usuario presionó "Cancelar"
                    console.log("El usuario canceló la operación");
                    return;
                }
            }

            const response = await axios.post(`/api/productos/prestamos/asignar/${id}/${producto_id}`, {
                motivo,
            });

            setPrestamos(response.data);
            setProductosAgregados(prevState => [...prevState, index]);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        } finally {
            setLoadingProduct(prevState => ({
                ...prevState,
                [index]: false
            }));
        }
    };

    const handleRegistrarReposicion = async () => {
        try {
            const r = await axios.post('/api/productos/registrar/reposicion', formReposicion);
            setPrestamos(r.data.prestamos);
            setReposiciones(r.data.reposiciones);
        } catch (error) {

        } finally {
            setOpenModalReposicion(false);
        }
    }

    const handleLiberarReposicion = async (reposicion_id)  => {
        try {
            let confirmacion = confirm('¿Esta seguro de liberar la reposición?');
            if(confirmacion) {
                const r = await axios.post('/api/productos/liberar/reposicion', {
                    reposicion_id
                });
                setReposiciones(r.data);
            }
        } catch (error) {

        }
    }

    const renderAgregarLinkOrMessage = (index, producto_id, propiedad) => {
        if (productosAgregados.includes(index)) {
            return <span className="tag is-primary is-light has-text-weight-semibold"><i
                className="fa fa-check pr-2"></i>Asignado</span>;
        } else if (loadingProduct[index]) {
            return "Cargando...";
        } else {
            return <a href="#" onClick={() => handleAgregarClick(index, producto_id, propiedad)}>Agregar</a>;
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormReposicion(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleOpenModalReposicion = (prestamoId) => {
        // Al abrir el modal de reposición, establecer el prestamoId en reposicionData
        setFormReposicion(prevState => ({
            ...prevState,
            prestamoId: prestamoId
        }));
        setOpenModalReposicion(true);
    };

    const registrarProducto = (value) => {
        setIsNuevoBien(false);
        setProductos([value, ...productos]);
        handleAgregarClick(0, value.id, value.propiedad);
    }

    return (
        <>
            <div className="container">
                <section className="content">
                    <p className="has-text-right">
                        <button className="button is-link" onClick={() => setOpenModalAsignarProducto(true)}>
                            <i className="fa fa-add pr-2"></i> Asignar nuevo
                        </button>
                    </p>
                    <p><strong>EN PRÉSTAMOS</strong></p>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>N°</th>
                            <th>CÓDIGO SBN</th>
                            <th>NOMBRE DEL BIEN</th>
                            <th>MARCA</th>
                            <th>MODELO</th>
                            <th>SERIE</th>
                            <th>FECHA PRESTAMO</th>
                            <th>MOTIVO PRESTAMO</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {prestamos.map((prestamo, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{prestamo.codigo_patrimonial}</td>
                                <td>{prestamo.nombre}</td>
                                <td>{prestamo.marca}</td>
                                <td>{prestamo.modelo}</td>
                                <td>{prestamo.serie}</td>
                                <td>{prestamo.fecha_prestamo}</td>
                                <td>{prestamo.motivo}</td>
                                <td>
                                    <Link title="Editar" className="button is-warning is-inline py-1 px-2 mr-2" to={"/producto/editar/"+prestamo.producto_id}><i className="fa-solid fa-edit"></i></Link>
                                    <a title="Archivar" className="button is-danger is-inline py-1 px-2" onClick={ () => handleOpenModalReposicion(prestamo.prestamo_id)}><i className="fa-solid fa-remove"></i></a>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {prestamos.length === 0 && (
                        <p className="has-text-centered"><i>No hay registro de prestamos</i></p>
                    )}
                    <p><strong>EN REPOSICIONES</strong></p>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>N°</th>
                            <th>CÓDIGO</th>
                            <th>NOMBRE DEL BIEN</th>
                            <th>MARCA</th>
                            <th>MODELO</th>
                            <th>SERIE</th>
                            <th>MOTIVO DE REPOSICIÓN</th>
                            <th>ESTADO</th>
                        </tr>
                        </thead>
                        <tbody className="has-background-danger-light">
                            {reposiciones.map((reposicion, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{reposicion.codigo_patrimonial}</td>
                                    <td>{reposicion.producto_nombre}</td>
                                    <td>{reposicion.producto_marca}</td>
                                    <td>{reposicion.producto_modelo}</td>
                                    <td>{reposicion.producto_serie}</td>
                                    <td>{reposicion.reposicion_motivo}</td>
                                    <td><span className="tag is-danger">{reposicion.reposicion_estado}</span></td>
                                    <td><a title="Archivar" onClick={() => handleLiberarReposicion(reposicion.reposicion_id)}><i className="fa-solid fa-down-to-bracket"></i></a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {reposiciones.length === 0 && (
                        <p className="has-text-centered"><i>No hay registro de reposiciones</i></p>
                    )}
                </section>
            </div>
            <div className={`modal ${openModalAsignarProducto ? 'is-active' : ''}`}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head modal-title-card">
                        <p className="modal-card-title">Bienes</p>
                        <a onClick={() => setOpenModalAsignarProducto(false)}>
                            <i className="far fa-xmark has-text-white"></i>
                        </a>
                    </header>
                    <section className="modal-card-body">
                        <div className="field has-addons">
                            <div className="control is-expanded">
                                <input
                                    className="input"
                                    type="text"
                                    name="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar por código | Nombre"
                                />
                            </div>
                            <div className="control">
                                <a className="button is-info" onClick={handleSearch}>
                                    <i className="fa fa-search"></i>
                                </a>
                            </div>
                            <div className="control ml-4">
                                <a className="button is-link" onClick={() => setIsNuevoBien(true)}>
                                    Nuevo
                                    <i className="pl-1 fa fa-add"></i>
                                </a>
                            </div>
                        </div>
                        <div style={{minHeight: '300px', overflowY: 'auto'}}>
                            {!isNuevoBien ? (
                                <table className="table is-striped is-narrow is-fullwidth">
                                <thead>
                                <tr>
                                    <th>CÓDIGO</th>
                                    <th>NOMBRE</th>
                                    <th>MODELO</th>
                                    <th>SERIE</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {productos.map((producto, index) => (
                                    <>
                                        <tr key={index}>
                                            <td>{producto.codigo_patrimonial}</td>
                                            <td>{producto.nombre}</td>
                                            <td>{producto.modelo}</td>
                                            <td>{producto.serie}</td>
                                            <td>
                                                {/* Aquí se renderiza el enlace o el mensaje */}
                                                {renderAgregarLinkOrMessage(index, producto.id, producto.propiedad)}
                                            </td>
                                        </tr>
                                    </>
                                ))}
                                </tbody>
                            </table>
                                ): (<FormRegEditarProducto onComplete={(value) => registrarProducto(value)} /> )}
                        </div>
                    </section>
                </div>
            </div>
            <div className={`modal ${openModalReposicion ? 'is-active' : ''}`}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head modal-title-card">
                        <p className="modal-card-title">REPOSICIÓN</p>
                        <a onClick={() => setOpenModalReposicion(false)}>
                            <i className="far fa-xmark has-text-white"></i>
                        </a>
                    </header>
                    <section className="modal-card-body">
                        <strong>¿El bien es para reposición?</strong>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="reposicion"
                                    value="si"
                                    checked={formReposicion.reposicion === 'si'}
                                    onChange={handleInputChange}
                                />
                                Si
                            </label>
                            <br />
                            <label>
                                <input
                                    type="radio"
                                    name="reposicion"
                                    value="no"
                                    checked={formReposicion.reposicion === 'no'}
                                    onChange={handleInputChange}
                                />
                                No
                            </label>
                        </div>
                        {formReposicion.reposicion === "si" && (
                            <>
                                <strong>Detalle motivo de reposición</strong>
                                <textarea
                                    className="input"
                                    rows="5"
                                    name="motivo"
                                    value={formReposicion.motivo}
                                    onChange={handleInputChange}></textarea>
                            </>
                        )}
                        <p className="has-text-centered">
                            <button className="button is-link mt-2" onClick={handleRegistrarReposicion}><span className="fa fa-check mr-2"></span> Registrar</button>
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
}
