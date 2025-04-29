import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import LoadingButton from "@/components/LoadingButton";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import UploadFotoPersona from "@/components/UploadFotoPersona";

export default function RegistrarActualizarPersona({action = "crear", id = undefined, onComplete}) {

    const {register, setValue, getValues, handleSubmit, reset, formState: {errors}, watch} = useForm();
    const [loading, setLoading] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const input_estado_civil = watch('estado_civil');

    useEffect(() => {
        if (id !== null && id !== undefined) {
            axios.get(route('persona.show', id)).then((response) => {
                reset(response.data);
            });
        } else {
            reset({
                estado_civil: '-',
                sexo: '-',
                estudiante: {
                    grado: '-',
                    seccion: '-'
                }
            });
        }
    }, [id]);

    const reniec = async () => {
        if (getValues("nro_documento").length === 8) {
            setLoadingSearch(true);
            try {
                let reniec = await axios.get(route('api.reniec.server', [getValues("nro_documento"), 1]));
                reset(reniec.data);
            } catch (e) {

            } finally {
                setLoadingSearch(false);
            }
        } else {
            toast.error("Debe ingresar un DNI para proceder con la búsqueda.");
        }
    }

    const actualizarPersona = async (data) => {

        const formData = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key] === null || data[key] === undefined ? null : data[key];

                if (key === "avatar") {
                    const dataUrl = value;

                    if (/^data:image\/\w+;base64,/.test(dataUrl)) {
                        // Convierte el bloque síncrono en una función asincrónica
                        const result = await fetch(dataUrl);
                        const blob = await result.blob();
                        const file = new File([blob], "imagen.png", {type: blob.type});
                        formData.append(key, file);
                    }
                }
                else if (typeof value === 'object' && value !== null && !(value instanceof File)) {
                    // Si el valor es un objeto (y no null ni un File), iteramos por sus propiedades
                    for (const nestedKey in value) {
                        if (value.hasOwnProperty(nestedKey)) {
                            formData.append(`${key}[${nestedKey}]`, value[nestedKey]);
                        }
                    }
                }
                else {
                    formData.append(key, value);
                }
            }
        }



        try {
            setLoading(true);
            switch (action) {
                case 'crear':
                    const response = await axios.post(route('persona.store'), formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    reset()
                    onComplete(false);
                    toast.success('Registro guardado correctamente.');
                    break;
                default:
                    setLoading(true);

                    const response2 = await axios.post(route('persona.update', id), formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    setValue("avatar", response2.data);
                    toast.success('Tu información a sido actualizada correctamente.');
                    break;
            }

        } catch (e) {
            toast.error('Ocurrio algunos problemas');
        } finally {
            setLoading(false);
        }

    }

    return (
        <>
            <div className="card">
                <div className="card-content">
                    <form onSubmit={handleSubmit(actualizarPersona)}>
                        <div className="container is-fluid  has-text-centered">
                            {action === "editar" && (
                                <p className="" style={{position: "absolute", left: 0}}><Link to="/estudiantes"><i
                                    className="fa fa-arrow-left"></i> Regresar</Link></p>
                            )}
                            <UploadFotoPersona
                                borderRadius={60}
                                imagenPredeterminada={getValues("avatar")}
                                onImageCropped={(img) => {
                                    setValue("avatar", img)
                                }}/>
                        </div>
                        <div className="columns is-flex-wrap-wrap">
                            <div className="column is-half">
                                <label className="label">DNI *</label>
                                <div className="field has-addons">
                                    <div className="control is-expanded">
                                        <input className="input"
                                               type="text" {...register('nro_documento', {required: true})}
                                               disabled={action !== "crear"} placeholder='Nro de documento'/>
                                    </div>
                                    {
                                        action === "crear" && (
                                            <div className="control">
                                                <button className={`button is-info ${loadingSearch ? 'is-loading' : ''}`}
                                                        onClick={reniec} disabled={loadingSearch}>
                                                    <i className="fa fa-search"></i>
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Nombres *</label>
                                    <input className="input" type="text" {...register('nombres', {required: true})} />
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Apellido paterno *</label>
                                    <input className="input"
                                           type="text" {...register('apellido_paterno', {required: true})} />
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Apellido materno *</label>
                                    <input className="input"
                                           type="text"  {...register('apellido_materno', {required: true})} />
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Fecha de nacimiento</label>
                                    <input className="input"
                                           type="date" {...register('fecha_nacimiento', {value: ''})} />
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Dirección</label>
                                    <input className="input" type="text" {...register('direccion')} />
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Celular</label>
                                    <input className="input" type="text" {...register('celular')} />
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field ">
                                    <label className="label">Lugar (Distrito / Provincia / Dpto)</label>
                                    <input className="input" type="text" {...register('lugar_domicilio')} />
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Género</label>
                                    <div className="control">
                                        <div className="select is-fullwidth">
                                            <select  {...register('sexo')} >
                                                <option disabled value="-">—Seleccionar—</option>
                                                <option value="M">Masculino</option>
                                                <option value="F">Femenino</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Estado Civil</label>
                                    <div className="control">
                                        <div className="select is-fullwidth">
                                            <select {...register('estado_civil')}>
                                                <option disabled value="-">—Seleccionar—</option>
                                                <option value="soltero/a">Soltero/a</option>
                                                <option value="casado/a">Casado/a</option>
                                                <option value="viudo/a">Viudo/a</option>
                                                <option value="divorciado/a">Divorciado/a</option>
                                                <option value="conviviente">Conviviente</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Grado</label>
                                    <div className="control">
                                        <div className="select is-fullwidth">
                                            <select {...register('estudiante.grado')}>
                                                <option disabled value="-">—Seleccionar—</option>
                                                <option value="3">Tercero</option>
                                                <option value="4">Cuarto</option>
                                                <option value="5">Quinto</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Sección</label>
                                    <div className="control">
                                        <div className="select is-fullwidth">
                                            <select {...register('estudiante.seccion')}>
                                                <option disabled value="-">—Seleccionar—</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {(input_estado_civil === 'casado/a' || input_estado_civil === 'conviviente') && (
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Datos del {input_estado_civil} (opcional)</label>
                                        <textarea className="textarea" {...register('info_pareja')} rows="2"/>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="has-text-centered">
                            <LoadingButton
                                type="submit"
                                className="button is-link"
                                isLoading={loading}
                                text={action === "crear" ? 'Registrar' : 'Actualizar registro'}
                                loadingText="Guardando..."
                                disabled={loading}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>);
}
