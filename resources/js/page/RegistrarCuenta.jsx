import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useForm} from "react-hook-form";
import {useAuth} from '@/context/AuthContext';
import axios from "axios";
const RegistrarCuenta = () => {
    document.title = 'Registro de usuario';
    const {register, setValue, handleSubmit, formState: { errors }, watch} = useForm();
    const navigate = useNavigate();
    const {setUser} = useAuth();
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const RegistrarCuenta = async (data) => {
        setIsSubmitting(true);

        try {
            const response = await axios.post('/api/user/registro-usuario', data);

            alert('registrado');
        } catch  (error) {

        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {

    }, []);

    return (
        <>
            <section className="hero has-background-black-ter is-fullheight">
                <div className="hero-body">
                    <div className="container">
                        <div className="columns is-centered">
                            <div className="column is-4">
                                <p className="has-text-centered">
                                    <img src="/img/empresa/navbar_logo.png"  width="100px" className="mb-4"/>
                                </p>
                                <div className="content has-text-centered"><h3 className="has-text-white">Registro de usuario</h3></div>
                                <form className="box" onSubmit={handleSubmit(RegistrarCuenta)}>
                                    {/* <a href={loginUrlGoogle} className="mt-2 button is-fullwidth is-danger">
                                        <span className="icon">
                                            <i className="fab fa-google"></i>
                                        </span>
                                        <span><strong>Inicia sesión con Google</strong></span>
                                    </a>*/}
                                    <br/>
                                    <span className="has-text-danger">{error}</span>
                                    <div className="field">
                                        <label htmlFor="" className="label">Nombres</label>
                                        <div className="control">
                                            <label><input type="radio" name="tipo_usuario" {...register('tipo_usuario') } /> Docente</label>
                                            <label><input type="radio" name="tipo_usuario" {...register('tipo_usuario') } /> Estudiante</label>
                                        </div>
                                        {errors.nombres &&
                                            <span className="has-text-danger">El campo nombres es requerido.</span>}
                                    </div>
                                    <div className="field">
                                        <label htmlFor="" className="label">Nombres</label>
                                        <div className="control">
                                            <input type="text"
                                                   className="input" {...register('nombres', {required: true})}
                                                   placeholder="" autoFocus={true}/>
                                        </div>
                                        {errors.nombres &&
                                            <span className="has-text-danger">El campo nombres es requerido.</span>}
                                    </div>
                                    <div className="field">
                                        <label htmlFor="" className="label">Apellidos</label>
                                        <div className="control">
                                            <input type="text"
                                                   className="input" {...register('apellidos', {required: true})}
                                                   placeholder="" autoFocus={true}/>
                                        </div>
                                        {errors.apellidos &&
                                            <span className="has-text-danger">El campo apellidos es requerido.</span>}
                                    </div>
                                    <div className="field">
                                        <label htmlFor="" className="label">Dni</label>
                                        <div className="control">
                                            <input type="text"
                                                   className="input" {...register('dni', {required: true})}
                                                   placeholder="" autoFocus={true}/>
                                        </div>
                                        {errors.dni &&
                                            <span className="has-text-danger">El campo dni es requerido.</span>}
                                    </div>
                                    <div className="field">
                                        <label htmlFor="" className="label">Correo electronico</label>
                                        <div className="control">
                                            <input type="text"
                                                   className="input" {...register('email', {required: true})}
                                                   placeholder="" autoFocus={true}/>
                                        </div>
                                        {errors.email &&
                                            <span className="has-text-danger">El campo email es requerido.</span>}
                                    </div>
                                    <div className="field has-text-centered">
                                        <button className="button is-link is-fullwidth" disabled={isSubmitting}>
                                            {isSubmitting == true ?
                                                <span className="loader-wrapper pr-2">
                                                <span className="loader is-loading"></span>
                                                </span> : null
                                            }
                                            Registrar
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default RegistrarCuenta;
