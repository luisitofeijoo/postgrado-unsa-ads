import React, { useEffect } from 'react';
import {Outlet, Link, useLocation} from "react-router-dom";
export default function TabsCuenta () {

    const location = useLocation();
    const isActiveRoute = (route) => {
        return location.pathname === route ? 'is-active' : '';
    };

    return (
        <>
            <div className="tabs is-centered">
                <ul>
                    <li className={isActiveRoute('/editar-perfil')}>
                        <Link to="/editar-perfil">
                            <span className="icon is-small"><i className="fa-regular fa-pen"></i></span>
                            <span> Editar Perfil</span>
                        </Link>
                    </li>
                    <li className={isActiveRoute('/ajustes')}>
                        <Link to="/ajustes">
                            <span className="icon is-small"><i className="fa-regular fa-gear"></i></span>
                            <span>Ajustes de cuenta</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <main>
                <Outlet />
            </main>
         </>);
}
