import React, { useEffect } from 'react';
import {Outlet, Link, useLocation, useParams} from "react-router-dom";
export default function TabsPersona () {

    const location = useLocation();
    const {id} = useParams();
    const isActiveRoute = (route) => {
        return location.pathname === route ? 'is-active' : '';
    };

    return (
        <>
            <div className="tabs is-centered">
                <ul>
                    <li className={isActiveRoute('/persona/editar/'+id)}>
                        <Link to={`/persona/editar/${id}`}>
                            <span className="icon is-small"><i className="fa-regular fa-pen"></i></span>
                            <span> Editar Persona</span>
                        </Link>
                    </li>
                  {/*  <li className={isActiveRoute('/persona/editar/'+id+'/asignar-bien')}>
                        <Link to={`/persona/editar/${id}/asignar-bien`}>
                            <span className="icon is-small"><i className="fa-regular fa-edit"></i></span>
                            <span>[Asignar/Reposición] Bienes</span>
                        </Link>
                    </li>*/}
                </ul>
            </div>
            <main>
                <Outlet />
            </main>
        </>);
}
