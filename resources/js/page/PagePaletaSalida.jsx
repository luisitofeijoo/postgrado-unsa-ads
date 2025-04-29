import React, {useEffect, useState, useRef} from 'react';
import 'react-toastify/dist/ReactToastify.css';



export default function PagePaletaSalida() {
    return <>
        <div className="container mt-5">
            {/*<a href="/rpt/pdf/papeleta-salida">Papeleta</a>*/}
            <h4 className="is-size-4 mb-2">Generar papeleta de salida</h4>
            <div className="field has-addons">
                <div className="control">
                    <input className="input" type="text" placeholder="Dni" />
                </div>
                <div className="control">
                    <button className="button is-info">
                        <i className="fa fa-search"></i>
                    </button>
                </div>
            </div>
        </div>
    </>;
}
