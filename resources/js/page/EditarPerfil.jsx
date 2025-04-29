import LoadingButton from "@/components/LoadingButton";
import React, {useState} from "react";
import {useAuth} from "../context/AuthContext";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import UploadFotoPersona from "@/components/UploadFotoPersona";

export default function EditarPerfil() {
    const [loading, setLoading] = useState(false);
    const {user, setUser} = useAuth();
    const {register, setValue, getValues , handleSubmit, formState: { errors }, watch} = useForm();

    const guardarUsuario = async (data) => {
        try {
            setLoading(true);
            const response = await axios.put(route('user.perfil'), data);
            setUser(response.data);
            toast.success('Tu información a sido actualizada correctamente.');
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <div className="container">
                <div className="columns is-mobile is-centered">
                    <div className="column is-half">
                        <div className="content has-text-centered">
                            <h1 className="has-text-weight-bold">Editar Perfil</h1>
                        </div>
                        <div className="card">
                            <div className="card-content">
                                <form onSubmit={handleSubmit(guardarUsuario)}>
                                <div className="content">
                                    <div className="has-text-centered">
                                        {/*<figure className="image is-128x128 is-inline-block border-photo-editar-perfil">
                                            <img className="is-rounded" src={user.avatar} />
                                        </figure>*/}
                                        <UploadFotoPersona
                                            borderRadius={60}
                                            imagenPredeterminada={user.avatar}
                                            onImageCropped={(img) => {
                                                setValue("avatar", img)
                                            }}/>
                                    </div>

                                    <div className="columns is-flex-wrap-wrap">
                                        <div className="column is-half">
                                            <div className="field">
                                                <label className="label">Nombres*</label>
                                                <input className="input" type="text" {...register("nombres", {required: 'El campo nombres es obligatorio.'})} defaultValue={user.nombres}/>
                                                <p className="help is-danger">{errors.nombres?.message}</p>
                                            </div>
                                        </div>
                                        <div className="column is-half">
                                            <div className="field">
                                                <label className="label">Apellido Paterno*</label>
                                                <input className="input" type="text"   {...register("apellidos", {required: 'El campo apellidos es obligatorio.'})} defaultValue={user.apellidos}/>
                                                <p className="help is-danger">{errors.apellidos?.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="has-text-centered">
                                        <LoadingButton
                                            type="submit"
                                            className="button is-link"
                                            isLoading={loading}
                                            text="Guardar cambios"
                                            loadingText="Guardando..."
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </>);
}
