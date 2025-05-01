import React, {useEffect, useState, useRef} from 'react';
import {Navigate, Outlet, NavLink, Link, useNavigate} from 'react-router-dom';
import {useAuth} from "../context/AuthContext";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingFullscreen from "@/components/Loading/LoadingFullscreen";
import axios from 'axios';
import {role} from "@/utils/utils";

export default function ProtectedLayout() {

    const {user, setUser} = useAuth();
    const [loading, setLoading] = useState(false);

    const [isActiveDropdown, setIsActiveDropdown] = useState(false);
    const [isActiveDropdownBien, setIsActiveDropdownBien] = useState(false);
    const [isActiveDropdownDocumento, setIsActiveDropdownDocumento] = useState(false);
    const [isActiveDropdownPUA, setIsActiveDropdownPUA] = useState(false);
    const dropdownRef = useRef(null);
    const dropdownBienRef = useRef(null);
    const dropdownDocumentoRef = useRef(null);
    const dropdownPUARef = useRef(null);
    const navigate = useNavigate();
    const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuActive(!isMobileMenuActive);
    };

    const toggleNavbar = () => {
        setIsActiveDropdown(!isActiveDropdown);
    };

    const togglePUA = () => {
        setIsActiveDropdownPUA(!isActiveDropdownPUA);
    }

    const toggleNavbarBienes = () => {
        setIsActiveDropdownBien(!isActiveDropdownBien);
    }

    const toggleNavbarDocumento = () => {
        setIsActiveDropdownDocumento(!isActiveDropdownDocumento);
    }

    const closeDropdown = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsActiveDropdown(false);
        }
        if (dropdownBienRef.current && !dropdownBienRef.current.contains(event.target)) {
            setIsActiveDropdownBien(false);
        }
        if (dropdownDocumentoRef.current && !dropdownDocumentoRef.current.contains(event.target)) {
            setIsActiveDropdownDocumento(false);
        }
        if (dropdownPUARef.current && !dropdownPUARef.current.contains(event.target)) {
            setIsActiveDropdownPUA(false);
        }
    };

    const handleDropdownItemClick = () => {
        setIsMobileMenuActive(false); // Cierra el menú al hacer clic en un item
        setIsActiveDropdown(false); // Cierra el dropdown al hacer clic en una opción
        setIsActiveDropdownBien(false); // Cierra el dropdown al hacer clic en una opción
        setIsActiveDropdownDocumento(false);
        setIsActiveDropdownPUA(false);
    };



    useEffect(() => {

        (async () => {
            try {
                const resp = await axios.get('/api/user');
                if (resp.status === 200) {
                    console.log('acceso');
                    setUser(resp.data.user);
                }
            } catch (error) {
                console.log(error);
                if (error.response?.status === 401) {
                    console.log('error');
                    localStorage.removeItem('user');
                    navigate("login");
                }
            }
        })();

        document.addEventListener('click', closeDropdown);
        return () => {
            document.removeEventListener('click', closeDropdown);
        };
    }, []);

    // Si no esta autentificado retornamos a página de login
    if (!user) {
        return <Navigate to="/"/>;
    }

    const logout = async () => {
        setLoading(true);
        try {
            const resp = await axios.post('/api/logout', null, {
                withCredentials: true,
            });

            if (resp.status === 200) {
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (<>
        <nav className="navbar is-black">
            <div className="navbar-brand">
                <a className="navbar-item" href="/admin">
                    <img src="/img/empresa/navbar_logo.png" alt="Sistemas Net Perú E.I.R.L." className="logo-platform"/>
                </a>
                <div
                    className={`navbar-burger burger ${isMobileMenuActive ? "is-active" : ""}`}
                    data-target="navbar-menu-toggle"
                    onClick={toggleMobileMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div id="navbar-active-mobile" className={`navbar-menu ${isMobileMenuActive ? "is-active" : ""}`}>
                <div className="navbar-start">
                </div>
                <div className="navbar-end">

                    <div className={`navbar-item has-dropdown ${isActiveDropdownPUA ? 'is-active' : ''}`}
                         ref={dropdownPUARef}>
                        {/*<a className="navbar-link" onClick={togglePUA}>*/}
                        {/*    Consumos*/}
                        {/*</a>*/}
                        <div className="navbar-dropdown ">
                            {/*<Link className="navbar-item" to="/pua/registro-asistencia/postulante/"
                                  onClick={handleDropdownItemClick}>Registro de comedor</Link>*/}

                           <a className="navbar-item"  href="/registro/comida/resumen-listar" onClick={handleDropdownItemClick}>
                                  Modo edición
                           </a>
                            {/*
                            <Link className="navbar-item" to="/pua/postulantes"
                                  onClick={handleDropdownItemClick}>Postulantes</Link>*/}

                          {/*  {role("admin") && (
                                <>
                                    <a className="navbar-item" onClick={handleDropdownItemClick} href="/pua/reporte">Reporte PDF
                                        general</a>
                                    <a className="navbar-item" onClick={handleDropdownItemClick} href="/pua/reporte/mesas">Reporte de mesas</a>
                                    <Link className="navbar-item" to="/pua/registro-asistencia/eliminados"
                                          onClick={handleDropdownItemClick}>Asistencias eliminadas</Link></>
                            )}*/}
                        </div>
                    </div>

                    {role("admin") && (<> <Link className="navbar-item" to="estudiantes">Administrador</Link></>)}
                    {role("docente") && (<> <Link className="navbar-item" to="estudiantes">Docente</Link></>)}
                    {role("estudiante") && (<> <Link className="navbar-item" to="estudiantes">Estudiante</Link></>)}


                    <Link className="navbar-item" to="estudiantes">Estudiantes</Link>

                   {/* <div className={`navbar-item has-dropdown ${isActiveDropdownBien ? 'is-active' : ''}`}
                         ref={dropdownBienRef}>
                        <a className="navbar-link" onClick={toggleNavbarBienes}>
                            Inventario
                        </a>
                        <div className="navbar-dropdown ">
                            <Link className="navbar-item" to="productos"
                                  onClick={handleDropdownItemClick}>Bienes</Link>
                            <Link className="navbar-item" to="bienes/registro-salida"
                                  onClick={handleDropdownItemClick}>Ingreso/Salida de bienes</Link>
                            <Link className="navbar-item" to="reporte/salida-bienes"
                                  onClick={handleDropdownItemClick}>Reporte Ingreso/Salida</Link>
                             <Link className="navbar-item" to="page/papeleta-salida" onClick={handleDropdownItemClick}>Papeleta de salida</Link>
                            <Link className="navbar-item" to="/bienes/rpt-ingreso-salida"
                                  onClick={handleDropdownItemClick}>Historial de movimientos</Link>
                        </div>
                    </div>*/}



                    <div className={`navbar-item has-dropdown ${isActiveDropdown ? 'is-active' : ''}`}
                         ref={dropdownRef}>
                        <a className="navbar-link" onClick={toggleNavbar}>
                            <figure className="image is-24x24">
                                <img src={user.avatar} className="is-rounded"/>
                            </figure>
                            <span className="pl-2">{user.nombres}</span>
                        </a>
                        <div className="navbar-dropdown is-right">
                            <Link
                                to="/editar-perfil"
                                className="navbar-item"
                                onClick={handleDropdownItemClick}
                            >
                                Editar mi perfil
                            </Link>
                            {/*   <NavLink to="" className="navbar-item">Soporte</NavLink>*/}
                            <a className="navbar-item" onClick={() => {
                                handleDropdownItemClick();
                                logout();
                            }}>
                                Cerrar sesión
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <main>
            <div className="has-background-all vh-100">
            <Outlet/>
            </div>
        </main>
        <ToastContainer/>
        <LoadingFullscreen loading={loading} background="rgba(240,240,255,0.8)" loaderColor="#3498db"/>
    </>);
}
