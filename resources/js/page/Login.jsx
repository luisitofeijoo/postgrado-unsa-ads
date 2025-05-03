import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useForm} from "react-hook-form";
import {useAuth} from '@/context/AuthContext';

const Login = () => {
    document.title = 'Login';
    const {register, setValue, handleSubmit, formState: { errors }, watch} = useForm();

    const navigate = useNavigate();
    const {setUser} = useAuth();
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginUrlGoogle, setLoginUrlGoogle] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const Auth = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('api/login', data);
            if(response.status === 200) {
                setUser(response.data.user);
                navigate("/admin");
            }
        } catch  (error) {
            if (error.response.status === 401) {
                setError(error.response.data.message);
                setValue('password', null);
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        fetch('http://localhost:8000/api/auth/google', {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong!');
            })
            .then((data) => setLoginUrlGoogle( data.url ))
            .catch((error) => console.error(error));

        // Mostrar modal SOLO UNA VEZ
        const modalShown = localStorage.getItem('modalShown');
        if (!modalShown) {
            setShowModal(true);
            localStorage.setItem('modalShown', 'true');
        }
    }, []);

    return (
        <>
            <section className="hero is-fullheight" style={{ backgroundImage: "url('./img/bg_login.jpg')" }}>
                <div className="hero-body">
                    <div className="container">
                        <div className="columns is-centered">
                            <div className="column is-4">
                                <p className="has-text-centered">
                                    <img src="/img/empresa/navbar_logo.png"  width="100px" className="mb-4"/>
                                </p>
                                <div className="content has-text-centered"><h3 className="has-text-white">Sistema de evaluaciones</h3></div>
                                <form  className="box" onSubmit={handleSubmit(Auth)}>

                                    <br/>
                                    <span className="has-text-danger">{error}</span>
                                    <div className="field">
                                        <label htmlFor="" className="label">Correo electrónico o usuario</label>
                                        <div className="control">
                                            <input type="text" className="input" { ...register('username', {required: true}) } placeholder="Usuario" autoFocus={true}/>
                                        </div>
                                        {errors.username && <span className="has-text-danger">El campo usuario es requerido.</span>}
                                    </div>
                                    <div className="field">
                                        <label htmlFor="" className="label">Contraseña</label>
                                        <div className="control">
                                            <input type="password" placeholder="Escribe tu contraseña" { ...register('password', {required: true}) } className="input"/>
                                        </div>
                                        {errors.password && <span className="has-text-danger">El campo contraseña es requerido.</span> }
                                    </div>
                                    <div className="field has-text-centered">
                                        <button className="button is-link is-fullwidth" disabled={isSubmitting}>
                                            { isSubmitting == true ?
                                                <span className="loader-wrapper pr-2">
                                                <span className="loader is-loading"></span>
                                                </span> : null
                                            }
                                            Iniciar sesión
                                        </button>
                                    </div>
                                    <div className="field">
                                        ¿No tienes una cuenta? <a href="/registrar/cuenta">Regístrate aquí</a>
                                    </div>

                                    <div className="is-size-7 has-text-right">
                                        De.
                                         <span>Grupo 3 - ADS Postgrado UNSA</span>

                                    </div>

                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* MODAL DE SCRUM */}
            <div className={`modal ${showModal ? 'is-active' : ''}`}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Integrantes del proyecto</p>
                        <button className="delete" aria-label="close" onClick={() => setShowModal(false)}></button>
                    </header>
                    <section className="modal-card-body">
                        <p><strong>Proyecto Scrum - Grupo 3</strong></p>
                        <ul>

                            <li>✅Carrasco Reynoso Alcira Angela</li>
                            <li>✅Feijoo Valeriano Luis Miguel</li>
                            <li>✅Huanca Serruto David Alonso</li>
                            <li>✅Pacco Huamani Gabriela</li>
                            <li>✅Pantaleón Ccoa Arturo H.</li>
                            <li>✅Vilca Quispe Ronal Ever</li>
                            <li>✅ Vizcarra Ylaquita Jenifer Stephanie</li>
                        </ul>
                        <p className="mt-4">¡Gracias por revisar nuestro trabajo!</p>
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-success" onClick={() => setShowModal(false)}>Cerrar</button>
                    </footer>
                </div>
            </div>
        </>
    );
}

export default Login;
