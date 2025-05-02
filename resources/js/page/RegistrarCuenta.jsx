import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useForm} from "react-hook-form";
import axios from "axios";
import Swal from 'sweetalert2';
import {toast, ToastContainer} from 'react-toastify';
const RegistrarCuenta = () => {
    document.title = 'Registro de usuario';
    const {register, setValue, handleSubmit, formState: { errors }, watch} = useForm();
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const RegistrarCuenta = async (data) => {
        setIsSubmitting(true);

        try {
            const response = await axios.post('/api/user/registro-usuario', data);
            Swal.fire({
                icon: "success",
                title: "Su registro se realizó correctamente",
                // text: "Something went wrong!",
            }).then((result) => {
                navigate('/login'); // <<< Reemplaza '/ruta-a-donde-redirigir' con tu URL real
            });
        } catch  (error) {
            toast.error("Ocurrio un error en el registro", {position: "bottom-right", theme: "colored"}); // Esto usa react-toastify

        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {

    }, []);

    return (
        <>
            <ToastContainer />
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
                                        <label htmlFor="" className="label">Tipo de usuario</label>
                                        <div className="control">
                                            <label className="mr-4"> {/* Added some margin for spacing */}
                                                <input
                                                    type="radio"
                                                    name="tipo_usuario"
                                                    value="docente" // Add this value prop
                                                    {...register('tipo_usuario', {required: true})} // Added required validation
                                                /> Docente
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="tipo_usuario"
                                                    value="estudiante" // Add this value prop
                                                    {...register('tipo_usuario', {required: true})} // Added required validation
                                                /> Estudiante
                                            </label>
                                        </div>
                                        {errors.tipo_usuario &&
                                            <span
                                                className="has-text-danger">El campo Tipo de usuario es requerido.</span>}
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
                                                   className="input" {...register('nro_documento', {required: true})}
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
                                    <div className="field">
                                        <label htmlFor="" className="label">Contraseña</label>
                                        <div className="control">
                                            <input type="password"
                                                   className="input" {...register('password', {required: true})}
                                                   placeholder="" autoFocus={true}/>
                                        </div>
                                        {errors.password &&
                                            <span className="has-text-danger">El campo password es requerido.</span>}
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
