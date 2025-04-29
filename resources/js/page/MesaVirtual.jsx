import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
export default function MesaVirtual () {

    const { register, setValue, getValues, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            tipoPersona: 1,  // Establece el valor predeterminado de tipoPersona a 1
        }
    });

    const tipoPersona = watch('tipoPersona');


    const [fileName, setFileName] = useState("Ningun archivo seleccionado.");
    const [listTipoDocumentos, setListTipoDocumentos] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expedienteCodigo, setExpedienteCodigo] = useState("");
    const [alertExpedienteRegistrado, setAlertExpedienteRegistrado] = useState(false);

    const consultaPersona  =  () => {
        const tipoUrlPersona = getValues("tipoPersona")==1?"reniec":"sunat";
        axios.get(route('api.'+tipoUrlPersona, watch('nroDocumento'))).then( (response) => {
            if(getValues("tipoPersona") == 1) {
                setValue("nombre_razon_social",response.data[0] + " " + response.data[1] + " " + response.data[2]);
            } else {
                setValue("nombre_razon_social",response.data[0]);
            }
        });
    }

    const registrarExpediente = async (data) => {

        setIsSubmitting(true);
        const _formData = new FormData();
        Object.keys(data).forEach((key) => {
           if(key == "archivo") {
               _formData.append(key, data[key][0]);
           }else {
               _formData.append(key, data[key]);
           }
        });



        try {
            const response = await axios.post(route('crear.expediente'), _formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if(response.data.success) {
                setAlertExpedienteRegistrado(true);
                setExpedienteCodigo(response.data.codigo);
            } else {
                alert(response.data.message);
            }

        }
        catch (error){
            throw error;
        }
        finally {
            setIsSubmitting(false);
        }
    }

    const procesarArchivo = (event) => {
        const MAX_FILE_SIZE = 10 * 1024 * 1024; //Maximo 10MB de subida
        const archivo_expediente = event.target.files[0];

        if (archivo_expediente.type === 'application/pdf') {
            if(archivo_expediente.size <= MAX_FILE_SIZE) {
                console.log('Archivo aceptado'+MAX_FILE_SIZE);
            } else {
                alert("El archivo seleccionado supera los 10MB");
            }
        } else {
            alert('El documento o archivo seleccionado no es un formato PDF');
            return false;
        }
    }

    useEffect(() => {
        axios.get('/api/list/tipo-documentos').then((response) => {
            setListTipoDocumentos(response.data);
        });
    }, []);

        console.log("MPV");

    return (
        <>
            <div className={`modal ${alertExpedienteRegistrado ? 'is-active' : ''}`}>
                <div className="modal-background"></div>
                <div className="modal-content">
                    <div className="card">
                        <header className="card-header">
                            <p className="card-header-title">
                                Expediente registrado
                            </p>
                        </header>
                        <div className="card-content">
                            <div className="content">
                                ¡Su documento ha sido registrado correctamente!.<br/>
                                Se le asignó el expediente N° <strong>2024 - {expedienteCodigo}</strong>
                            </div>
                        </div>
                        <footer className="card-footer">
                            <p className="has-text-right m-3" style={{width:'100%'}}>
                                <a className="button is-link" href="/doc/listar">Aceptar</a>
                            </p>
                        </footer>
                    </div>
                </div>
            </div>

            {/*<div className="container">*/}
        <form onSubmit={handleSubmit(registrarExpediente)}>
            <div className="has-background-light p-4">
                <div className="container">
                    <div className="content pt-4 pb-4">
                        <h2 className="has-text-weight-bold has-text-centered">Recepción de documentos</h2>
                    </div>
                    <div className="card">
                        <header className="card-header">
                            <p className="card-header-title is-dark">
                                DATOS DEL CIUDADANO O ENTIDAD
                            </p>
                        </header>
                        <div className="card-content">
                            <div className="content">
                                <div className="columns">
                                    <div className="column">
                                        <div className="field">
                                            <label className="label">Persona (*)</label>
                                            <div className="control">
                                                <div className="select is-link is-fullwidth">
                                                    <select {...register('tipoPersona', {required: 'Seleccione una opción'})} defaultValue="">
                                                        <option disabled value="">—Por favor, elige una opción—</option>
                                                        <option value="1">Persona Natural</option>
                                                        <option value="2">Persona Juridica</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="help is-danger">{errors.tipoPersona?.message}</p>
                                    </div>
                                </div>
                                {(tipoPersona == 1 || tipoPersona == 2) && (
                                    <div className="columns">
                                        <div className="column is-two-fifths">
                                            <label className="label">{tipoPersona == 1 ? ('Documento de identidad (DNI)') : ('Registro Unico del Contribuyente  (RUC)')} (*)</label>
                                            <div className="field has-addons">
                                                <div className="control is-expanded">
                                                    <input type="number" {...register('nroDocumento', {required: 'Este campo es obligatorio'})} className="input" />
                                                </div>
                                                <div className="control">
                                                    <a className="button is-info" onClick={consultaPersona}>
                                                        <i className="fa fa-search"></i>
                                                    </a>
                                                </div>

                                            </div>
                                            <p className="help is-danger">{errors.nroDocumento?.message}</p>
                                        </div>
                                        <div className="column">
                                            <div className="field">
                                                <label className="label">{tipoPersona == 1 ? ('Nombres y apellidos') : ('Nombre o razón social')} (*)</label>
                                                <div className="control">
                                                    <input className="input" type="text" {...register('nombre_razon_social', {required: 'Este campo es obligatorio'})} />
                                                </div>
                                                <p className="help is-danger">{errors.nombre_razon_social?.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="columns">
                                    <div className="column">
                                        <div className="field">
                                            <label className="label">Correo electrónico </label>
                                            <div className="control">
                                                <input className="input" type="email" {...register('email')}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column">
                                        <div className="field">
                                            <label className="label">Celular</label>
                                            <div className="control">
                                                <input className="input" type="text" {...register('celular')}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column">
                                        <div className="field">
                                            <label className="label">Dirección</label>
                                            <div className="control">
                                                <input className="input" type="text" {...register('direccion')}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                   <div className="container mt-3">
                       <div className="card">
                           <header className="card-header">
                               <p className="card-header-title is-dark">
                                   DATOS DEL DOCUMENTO
                               </p>
                           </header>
                           <div className="card-content">
                               <div className="content">
                                   <div className="columns">
                                       <div className="column is-one-fifth">
                                           <div className="field">
                                               <label className="label">Tipo de documento (*)</label>
                                               <div className="control">
                                                   <div className="select is-link is-fullwidth">
                                                       <select {...register('tipoDocumento', {required: 'Seleccione una opción'})} defaultValue="">
                                                           <option disabled value="">—Por favor, elige una opción—</option>
                                                           {listTipoDocumentos.map(item => (
                                                               <option key={item.id} value={item.id}>{item.descripcion}</option>
                                                           ))}
                                                       </select>
                                                   </div>
                                               </div>
                                               <p className="help is-danger">{errors.tipoDocumento?.message}</p>
                                           </div>
                                       </div>
                                       <div className="column is-two-fifths">
                                           <div className="field">
                                               <label className="label">Asunto (*)</label>
                                               <div className="control">
                                                   <input className="input" type="text" {...register('asunto', {required: 'Este campo es obligatorio'})}/>
                                               </div>
                                               <p className="help is-danger">{errors.asunto?.message}</p>
                                           </div>
                                       </div>
                                       <div className="column is-one-fifth">
                                           <div className="field">
                                               <label className="label">Nro. doc.</label>
                                               <div className="control">
                                                   <input className="input" type="number" {...register('nro_expediente')}/>
                                               </div>
                                           </div>
                                       </div>
                                       <div className="column is-one-fifth">
                                           <div className="field">
                                               <label className="label">Folio</label>
                                               <div className="control">
                                                   <input className="input" type="number" {...register('folio')}/>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                                   <div className="columns">
                                       <div className="column">
                                           <div className="field">
                                               <label className="label">Descripción de la solicitud o tramite</label>
                                               <div className="control">
                                                   <textarea className="textarea" {...register('descripcion', {required: 'Debe ingresar el asunto relacionado al documento.'})}></textarea>
                                               </div>
                                               <p className="help is-danger">{errors.descripcion?.message}</p>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
                    <div className="has-text-centered m-4">
                        <button type="submit" className="button is-link" disabled={isSubmitting}>
                            { isSubmitting == true ?
                            <span className="loader-wrapper pr-2">
                                <span className="loader is-loading"></span>
                            </span> : ""
                            }
                            Registrar expediente
                        </button>
                    </div>
                </div>
            </div>
        </form>
        </>
    );
}
