import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import FormRegEditarProducto from "@/components/FormRegEditarProducto";

export default function pageEditarProducto () {
    const {id} = useParams();

    return (
        <>
            <div className="container pt-5">
                <div className="columns is-centered">
                    <div className="column is-three-fifths">
                        <div className="content has-text-centered">
                            <h1 className="has-text-weight-bold">Editar Bien</h1>
                        </div>
                        <FormRegEditarProducto action="editar" id={id}/>
                    </div>
                </div>
            </div>
        </>
    );
}
