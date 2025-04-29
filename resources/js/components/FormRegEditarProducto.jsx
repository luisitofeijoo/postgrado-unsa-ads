import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import LoadingButton from "@/components/LoadingButton";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";

export default function FormRegEditarProducto({action = "crear", id = undefined, onComplete}) {

    const {register, setValue, getValues, handleSubmit, reset, formState: {errors}, watch} = useForm();
    const [loading, setLoading] = useState(false);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [ubicacion_id, setUbicacionId] = useState(0);

    useEffect(() => {

        if (id !== null && id !== undefined) {

            axios.get(route('producto.show', id)).then((response) => {
                reset(response.data);
                setUbicacionId(response.data.ubicacion_id || 0);
            });
        }

        axios.post(route('ubicacion.index')).then((r) => {
            const opcionesUbicacion = [
                {
                    id: "",
                    nombre: "—Seleccionar—",
                },
                ...r.data,
            ];
            setUbicaciones(opcionesUbicacion);
        });
    }, [id]);

    const actualizarProducto = async (data) => {

        try {
            setLoading(true);
            switch (action) {
                case 'crear':
                    const response = await axios.post(route('producto.store', id), data);
                    reset()
                    onComplete(response.data);
                    toast.success('Registro guardado correctamente.');
                    break;
                default:
                    setLoading(true);
                    const response2 = await axios.post(route('producto.update', id), data);
                    setValue("avatar", response2.data);
                    toast.success('Tu información a sido actualizada correctamente.');
                    break;
            }

        } catch (e) {
            toast.error('Ocurrio algunos problemas');
            console.log(e);
        } finally {
            setLoading(false);
        }

    }

    return (
        <>
            <div className="card">
                <div className="card-content">
                    <form onSubmit={handleSubmit(actualizarProducto)}>
                        <div className="has-text-left mb-5 ml-0">
                            {action === "editar" && (
                                <p className=""><Link to="/productos"><i
                                    className="fa fa-arrow-left"></i> <strong>Regresar</strong></Link></p>
                            )}
                        </div>
                        <div className="ml-0 content">
                            <strong>Propiedad (*):</strong>
                                <div className="control">
                                    <label className="radio">
                                        <input type="radio" className="mr-2" value="INSTITUCION" name="propiedad" {...register('propiedad', { required: true })} required/>
                                         Institución
                                    </label>
                                    <label className="radio">
                                        <input type="radio" className="mr-2" value="PERSONAL" name="propiedad" {...register('propiedad', { required: true })} required/>
                                         Personal (tercero)
                                    </label>
                                </div>
                            <hr/>
                        </div>
                        <div className="columns is-flex-wrap-wrap">
                            <div className="column is-half has-background-grey-lighter">
                                <div className="field">
                                    <label className="label">Código Patrimonial(*)</label>
                                    <input className="input"
                                           type="text" {...register('codigo_patrimonial', {required: true, value: action==="crear"?Math.floor(Date.now() / 1000):null})} required/>
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Codigo Interno</label>
                                    <input className="input"
                                           type="text" {...register('codigo_interno', {required: false})}  />
                                </div>
                            </div>
                            <div className="column is-full">
                                <div className="field ">
                                    <label className="label">Denominación del bien (*)</label>
                                    <input className="input" type="text" {...register('nombre', {required: true})} required/>
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Marca</label>
                                    <input className="input" type="text" {...register('marca', {required: false})} />
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Modelo</label>
                                    <input className="input" type="text" {...register('modelo')} />
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Serie/Dimensión</label>
                                    <input className="input" type="text" {...register('serie')} />
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Color</label>
                                    <input className="input" type="text" {...register('color')} />
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Situación</label>
                                    <div className="control">
                                        <div className="select is-fullwidth">
                                            <select {...register('situacion', {value: ''})} required>
                                                <option disabled value="">—Seleccionar—</option>
                                                <option value="U">Uso</option>
                                                <option value="D">Desuso</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column is-half">
                                <div className="field">
                                    <label className="label">Estado</label>
                                    <div className="control">
                                        <div className="select is-fullwidth">
                                            <select {...register('estado', {value: ''})} >
                                                <option disabled value="">—Seleccionar—</option>
                                                <option value="BUENO">Bueno</option>
                                                <option value="REGULAR">Regular</option>
                                                <option value="MALO">Malo</option>
                                                <option value="RAEE">RAEE</option>
                                                <option value="CHATARRA">Chatarra</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div className="field">
                                    <label className="label">Ubicación del bien</label>
                                    <div className="control">
                                        <div className="select is-fullwidth">
                                            <select {...register('ubicacion_id')} value={ubicacion_id}
                                                    onChange={(e) => setUbicacionId(e.target.value)} >
                                                {ubicaciones.map((ubicacion, index) => (
                                                    <option key={index} value={ubicacion.id}>
                                                        {ubicacion.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Detalle</label>
                                    <textarea className="textarea"
                                              rows="2" {...register('detalle', {required: false})}/>
                                </div>
                                <div className="field">
                                    <label className="label">Observación</label>
                                    <textarea className="textarea"
                                              rows="2" {...register('observacion', {required: false})}/>
                                </div>
                                <div className="field">
                                    <label className="label">Comentario</label>
                                    <textarea className="textarea"
                                              rows="2" {...register('comentario', {required: false})}/>
                                </div>
                            </div>
                        </div>
                        <div className="has-text-centered">
                            <LoadingButton
                                type="submit"
                                className="button is-link"
                                isLoading={false}
                                loadingText="Guardando..."
                                text={action === "crear" ? 'Registrar' : 'Actualizar registro'}
                                disabled={false}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
