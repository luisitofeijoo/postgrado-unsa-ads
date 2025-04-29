import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function RptIngresoSalidaBienes() {
    const [registros, setRegistros] = useState([]);

    useEffect(() => {
        axios.get(route('api.movimiento.mostrar_registros')).then((r) => {
            const registrosConEstado = r.data.map((registro) => ({
                ...registro,
                editMode: false, // Agregamos una propiedad para controlar la edición
            }));
            setRegistros(registrosConEstado);
        });
    }, []);

    // Función para habilitar la edición del registro
    const handleEditarRegistro = (index) => {
        setRegistros(prev =>
            prev.map((r, i) => (i === index ? { ...r, editMode: true } : r))
        );
    };

    // Función para actualizar el registro
    const handleActualizarRegistro = async (registro, nuevoMovimiento) => {
        try {
            const response = await axios.post(route('api.movimiento.actualizar_registro'), {
                id: registro.id, // Asegúrate de tener un campo de identificación
                tipo_movimiento: nuevoMovimiento
            });

            toast.success('El registro ha sido actualizado correctamente');

            console.log(response.data);

            // Actualizar el estado de registros localmente para reflejar el cambio
            setRegistros(prev =>
                prev.map(r =>
                    r.id === registro.id
                        ? { ...r, tipo_movimiento: nuevoMovimiento, editMode: false }  // Deshabilitar edición después de actualizar
                        : r
                )
            );
        } catch (error) {
            console.error("Error actualizando el registro:", error);
        }
    };

    function Test(propss) {
        return <h1>Hola, {propss.name}</h1>
    }

    return (
        <>
            <div className="container">
                <div className="content mt-5">
                    <h2>Historial de registro de movimiento de Equipos tecnológicos/Instrumentos</h2>
                    <p><strong>Ultimos 100 registros</strong></p>
                </div>
                <br />
                <table className="table is-fullwidth">
                    <thead>
                    <tr>
                        <th>Dni</th>
                        <th>Nombres</th>
                        <th>Bien en movimiento</th>
                        <th>Fecha de movimiento</th>
                        <th className="has-text-centered">Tipo de movimiento</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {registros.map((registro, index) => (
                        <tr key={index}>
                            <td>{registro.persona?.nro_documento}</td>
                            <td>{registro.persona?.nombres} {registro.persona?.apellido_paterno} {registro.persona?.apellido_materno}</td>
                            <td>{registro.bien?.nombre}</td>
                            <td>{registro.fecha_movimiento}</td>
                            <td className="has-text-centered">
                                <div className="select">
                                    <select
                                        defaultValue={registro.tipo_movimiento}
                                        onChange={(e) => registro.nuevoMovimiento = e.target.value} // Almacenar temporalmente el nuevo valor en el objeto
                                        disabled={!registro.editMode} // Habilitar solo si está en modo edición
                                    >
                                        <option value="salida">Salida</option>
                                        <option value="ingreso">Ingreso</option>
                                    </select>
                                </div>
                            </td>
                            <td>
                                {registro.editMode ? (
                                    // Botón para actualizar y guardar cambios
                                    <a onClick={() => handleActualizarRegistro(registro, registro.nuevoMovimiento || registro.tipo_movimiento)}>
                                        <strong>Actualizar</strong>
                                    </a>
                                ) : (
                                    // Botón para habilitar la edición
                                    <a onClick={() => handleEditarRegistro(index)}>
                                        <strong>Editar</strong>
                                    </a>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
