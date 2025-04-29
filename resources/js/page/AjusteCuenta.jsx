import { useAuth } from '../context/AuthContext';
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import LoadingButton from "../components/LoadingButton";
import { toast } from 'react-toastify';
export default function AjusteCuenta() {

    const {user, setUser} = useAuth();
    const {register, setValue, getValues , handleSubmit, formState: { errors }, watch} = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setValue("username", user.username);
    }, [setValue, user.username]);

    const actualizarCuenta = async (data) => {
        /*if (data.password !== data.password_repeat) {
            return;
        }*/
        try {
            setLoading(true);
            const response = await axios.put(route('user.ajustes'), data);
            setUser(response.data);
            toast.success('Tu información a sido actualizada correctamente.');
        } catch (e) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        register("password", {
            validate: (value) =>
                value === watch("password_repeat") || "Las contraseñas no coinciden",
        });
    }, [register, getValues]);


    return (<>
        <div className="container">
            <div className="columns is-mobile is-centered">
                <div className="column is-half">
                    <div className="content has-text-centered">
                        <h1 className="has-text-weight-bold">Ajustes de la cuenta</h1>
                    </div>
                    <div className="card">
                        <div className="card-content">
                            <div className="content">
                                <form onSubmit={handleSubmit(actualizarCuenta)}>
                                    <div className="columns is-flex-wrap-wrap">
                                        <div className="column is-half">
                                            <div className="field">
                                                <label className="label">Correo electrónico</label>
                                                <input className="input" type="text" defaultValue={user.email} disabled/>
                                                {/*<p className="help is-danger">This email is invalid</p>*/}
                                            </div>
                                        </div>
                                        <div className="column is-half">
                                            <div className="field">
                                                <label className="label">Nombre de usuario</label>
                                                <input className="input" type="text" {...register('username', {required: "Este campo es obligatorio."})} autoComplete="new-password"/>
                                                <p className="help is-danger">{errors.username?.message}</p>
                                            </div>
                                        </div>
                                        <div className="column is-half">
                                            <div className="field">
                                                <label className="label">Nueva contraseña</label>
                                                <input className="input" type="password"  {...register('password')} autoComplete="off"/>
                                            </div>
                                            <p className="help has-text-grey-light">Si no quieres cambiar tu contraseña deja esto en blanco.</p>
                                        </div>
                                        <div className="column is-half">
                                            <div className="field">
                                                <label className="label">Repetir contraseña</label>
                                                <input className="input" type="password" {...register('password_repeat')} autoComplete="off"/>
                                            </div>
                                            <p className="help is-danger">{errors.password?.message}</p>
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
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}
