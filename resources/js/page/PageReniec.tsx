// @ts-ignore
import React, {useEffect, useState} from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import axios from "axios";
// @ts-ignore
import LoadingButton from "../components/LoadingButton";
// @ts-ignore
import route from "ziggy-js";
import {toast} from "react-toastify";
function PageReniec() {

    interface Persona {
        dni: number,
        nombres: string,
        apellido_paterno: string,
        apellido_materno: string,
        direccion: string,
        domicilio_ubigeo: string,
        restriccion: string,
        foto: string,
    }

    interface FormData {
        dni: string,
        // Agrega otras propiedades según tus necesidades
    }
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit} = useForm<FormData>();
    const [persona, setPersona] = useState<Persona | null>(null);

/*    const [usuario, setUsuario] = useState<Usuario>();*/

    // @ts-ignore
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        try {
            const response = await axios.get(route("api.cloud.reniec", data.dni));
            setPersona(response.data);
            response.data.dni = data.dni;
        } catch (e) {
            toast.error('Ocurrio un error en el servidor, intente consultar nuevamente.');
        } finally {
            setLoading(false);
        }
    }

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <div className="container p-2">
            <div className="columns is-centered">
                <div className="column is-three-fifths pt-5">
                    <div className="has-text-centered">
                        <img src="/img/icons/logo_reniec.png" className="mt-4 mb-4" alt="Logo reniec" style={{maxWidth: "250px"}}/>
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <input className="input has-text-centered" type="text"
                                   {...register("dni", {required: true})}
                                   placeholder="Ingrese DNI"
                                   style={{maxWidth: '400px'}} autoComplete="off" />
                            <div className="is-flex is-justify-content-center">
                                <LoadingButton
                                    type="submit"
                                    className="button is-link m-4"
                                    isLoading={loading}
                                    text="Consultar"
                                    loadingText="Consultando..."
                                    disabled={loading}
                                />
                            </div>
                        </form>
                    </div>
                    {persona && (
                        <div className="columns">
                            <div className="column is-3 has-text-centered">
                                <p className="is-block">Foto</p>
                                <img src={'data:image/jpeg;base64,'+persona["foto"]} alt="" className="p-1"/>
                            </div>
                            <div className="column">
                                <div className="content">
                                    <table className="table is-fullwidth is-narrow">
                                        <thead>
                                        <tr>
                                            <th>DETALLES</th>
                                            <th>INFORMACIÓN PERSONAL</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(persona).map((key:string) => (key !== "foto") && (
                                                <tr key={key}>
                                                    <td className="is-link">{key}</td>
                                                    <td>{persona[key]}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default PageReniec;
