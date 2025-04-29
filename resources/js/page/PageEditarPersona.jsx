import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import RegistrarActualizarPersona from "@/page/RegistrarActualizarPersona";

export default function PageEditarPersona () {
    const {id} = useParams();

    return (
        <>
            <div className="container pt-5">
                <div className="columns is-centered">
                    <div className="column is-half">
                        <div className="content has-text-centered">
                            <h1 className="has-text-weight-bold">Editar Persona</h1>
                        </div>
                        <RegistrarActualizarPersona action="editar" id={id}/>
                    </div>
                </div>
            </div>
        </>
    );
}
