import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from "react-router-dom";
import {toast} from "react-toastify";
import axios from "axios";

// Componente para la celda de fecha editable (tu código ya existente)
const EditableDateCell = ({ value, registro_comida_id, onDateChange }) => {
    // ... [código que ya tienes para EditableDateCell] ...
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    const formatDateTimeLocal = (dateInput) => {
        if (!dateInput) return '';
        try {
            const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
            if (isNaN(date.getTime())) {
                console.warn("Invalid Date object received:", dateInput);
                return '';
            }
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');

            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (e) {
            console.error("Error formatting date for datetime-local:", dateInput, e);
            return '';
        }
    };

    const handleDoubleClick = () => {
        setCurrentValue(formatDateTimeLocal(value));
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setCurrentValue(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        try {
            const dateObject = new Date(currentValue);
            if (isNaN(dateObject)) throw new Error("Invalid Date");
            if (dateObject.toISOString() !== new Date(value).toISOString()) {
                onDateChange(registro_comida_id, dateObject.toISOString());
            }
        } catch(e) {
            console.error("Invalid date value entered:", currentValue);
        }
    };

    const formatDisplayDate = (isoString) => {
        if (!isoString) return 'N/A';
        try {
            return new Date(isoString).toLocaleString();
        } catch(e) {
            return 'Fecha inválida';
        }
    };

    return (
        <td onDoubleClick={handleDoubleClick}>
            {isEditing ? (
                <input
                    type="datetime-local"
                    step="1"
                    className="input"
                    value={currentValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                    style={{width: '100%', boxSizing: 'border-box'}}
                />
            ) : (
                formatDisplayDate(value)
            )}
        </td>
    );
};

export default function PageRegistroComidaEdit() {
    const { fecha, tipo_comida_id } = useParams();
    const [comidas, setComidas] = useState([]);
    const [originalComidas, setOriginalComidas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [changes, setChanges] = useState({ updates: {}, deletes: new Set() });

    // Estados para el modal de personas
    const [showModal, setShowModal] = useState(false);
    const [personas, setPersonas] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState(null);
    const [selectedPersons, setSelectedPersons] = useState([]);

    // Función para convertir fecha de YYYY-mm-dd a dd/mm/YYYY
    const convertirFecha = (fecha) => {
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
    };

    // Fetch inicial de datos (comidas)
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const resp = await axios.get(`/api/registro/comidas-e/${fecha}/${tipo_comida_id}`);
            setComidas(resp.data);
            setOriginalComidas(JSON.parse(JSON.stringify(resp.data)));
            setChanges({ updates: {}, deletes: new Set() });
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("No se pudieron cargar los registros de comidas.");
        } finally {
            setIsLoading(false);
        }
    }, [fecha, tipo_comida_id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Función para manejar el cambio de fecha en EditableDateCell (ya existente)
    const handleDateChange = async (registro_comida_id, newDateISO) => {

        const originalValue = originalComidas.find(c => c.registro_comida_id === registro_comida_id)?.hora_registro;
        setComidas(prevComidas =>
            prevComidas.map(comida =>
                comida.registro_comida_id === registro_comida_id
                    ? { ...comida, hora_registro: newDateISO }
                    : comida
            )
        );
        setChanges(prevChanges => ({
            ...prevChanges,
            updates: { ...prevChanges.updates, [registro_comida_id]: newDateISO },
            deletes: prevChanges.deletes?.delete(registro_comida_id) ? prevChanges.deletes : new Set(prevChanges.deletes)
        }));
        try {
            const url = `/api/registro/comidas/update/${registro_comida_id}`;
            const payload = { hora_registro: new Date(newDateISO).toLocaleString() };
            const response = await axios.patch(url, payload);
            console.log(`Registro ${registro_comida_id} actualizado OK:`, response.data);
            setOriginalComidas(prevOriginales =>
                prevOriginales.map(comida =>
                    comida.registro_comida_id === registro_comida_id
                        ? { ...comida, hora_registro: newDateISO }
                        : comida
                )
            );
            setChanges(prev => {
                const newUpdates = { ...prev.updates };
                delete newUpdates[registro_comida_id];
                return { ...prev, updates: newUpdates };
            });

            toast.success("El registro se actualizo correctamente.", {position: "top-right", theme: "colored"});

        } catch (error) {
            console.error(`Error al actualizar registro ${registro_comida_id}:`, error);
            let errorMessage = 'No se pudo actualizar el registro.';
            if (error.response) {
                errorMessage = error.response.data?.error || error.response.data?.message || `Error ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'Sin respuesta del servidor.';
            }
            setComidas(prevComidas =>
                prevComidas.map(comida =>
                    comida.registro_comida_id === registro_comida_id
                        ? { ...comida, hora_registro: originalValue }
                        : comida
                )
            );
            setChanges(prev => {
                const newUpdates = { ...prev.updates };
                delete newUpdates[registro_comida_id];
                return { ...prev, updates: newUpdates };
            });
            toast.error("El registro no pudo actualizarce.", {position: "top-right", theme: "colored"});
        }
    };

    // Funciones para el Modal de Personas

    // Abrir el modal y cargar la lista de personas
    const openModal = async () => {
        setShowModal(true);
        setModalLoading(true);
        setModalError(null);
        try {
            // Ajusta la URL según tu API que lista las personas
            const response = await axios.get('/api/consumos/prueba/'+fecha+'/'+ tipo_comida_id);
            setPersonas(response.data);
        } catch (err) {
            console.error("Error fetching personas:", err);
            setModalError("Error al cargar las personas.");
        } finally {
            setModalLoading(false);
        }
    };

    // Cerrar el modal y reiniciar selección
    const closeModal = () => {
        setShowModal(false);
        setSelectedPersons([]);
    };

    // Alterna la selección de una persona
    const togglePersonSelection = (id) => {
        setSelectedPersons(prev =>
            prev.includes(id)
                ? prev.filter(pid => pid !== id)
                : [...prev, id]
        );
    };

    // Función para agregar las personas seleccionadas
    const handleAddSelected = async () => {
        // Aquí defines la lógica para agregar los nuevos registros usando los IDs en selectedPersons.
        // Por ejemplo, podrías llamar a un endpoint que cree registros en lote.
        try {
            const payload = { personas: selectedPersons, fecha, tipo_comida_id };
            const response = await axios.post('/api/registro/comidas/add-personas', payload);
            console.log("Nuevos registros agregados:", response.data);
            // Tras agregar, recarga los registros
            toast.success("Nuevos registros agregados correctamente.", {theme: 'colored'});
            fetchData();

            closeModal();
        } catch (err) {
            console.error("Error agregando registros:", err);

            toast.error("Error agregando registros.", {theme: 'colored'});
        }
    };

    const eliminarRegistroComida  = async (registro_comida_id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta comida?")) return;

        try {
            await axios.delete(`/api/registro/comidas/eliminar/${registro_comida_id}`);
            // Opcional: actualiza el estado local para remover la fila eliminada
            //fetchData();
            // If the API call is successful, update the local state
            setComidas(prevComidas => prevComidas.filter(comida => comida.registro_comida_id !== registro_comida_id));
            // Optionally, update originalComidas as well if you use it elsewhere
            setOriginalComidas(prevOriginales => prevOriginales.filter(comida => comida.registro_comida_id !== registro_comida_id));
            toast.success("El registro se eliminó correctamente.", {position: "top-right", theme: "colored"});
        } catch (error) {
            toast.error("Hubo un error al eliminar el registro.", {position: "top-right", theme: "colored"});
        }
    };
    // Render principal
    return (
        <div className="container">
            <p className="mt-4">
                <Link to="/registro/comida/resumen-listar">
                    <i className="far fa-chevron-left"></i> <strong>Retornar atrás</strong>
                </Link>
            </p>

            {isLoading && <p>Cargando...</p>}
            {error && <p className="has-text-danger">{error}</p>}

            {!isLoading && !error && (
                <>


                    {/* Botón para abrir el modal */}
                  <div className="columns">
                      <div className="column">
                          <h1 className="is-size-5 mt-4 has-text-weight-bold">
                              {(() => {
                                  const tipo = parseInt(tipo_comida_id, 10);
                                  switch (tipo) {
                                      case 1:
                                          return "DESAYUNO, ";
                                      case 2:
                                          return "REFRIGERIO MAÑANA, ";
                                      case 3:
                                          return "ALMUERZO, ";
                                      case 4:
                                          return "REFRIGERIO TARDE, ";
                                      case 5:
                                          return "CENA, ";
                                      default:
                                          return "Tipo de comida desconocido";
                                  }
                              })()}{" "}
                              {convertirFecha(fecha)}
                          </h1>
                      </div>
                      <div className="column has-text-right">
                          <button className="button is-link pt-0 pb-0 is-right" onClick={openModal}>
                              <i className="far fa-add pr-2"></i> Agregar consumos
                          </button>
                      </div>
                  </div>
                    <table className="table mb-4 is-narrow is-fullwidth is-bordered is-striped is-hoverable is-fullwidth">
                        <thead>
                        <tr>
                            <th></th>
                            <th>DNI</th>
                            <th>NOMBRES</th>
                            <th>APELLIDO_PATERNO</th>
                            <th>APELLIDO_MATERNO</th>
                            <th>GRADO</th>
                            <th>SECCION</th>
                            <th>FECHA REGISTRO <span className="tag is-link is-light has-text-weight-bold">Doble clic para editar</span></th>
                            <th>*</th>
                        </tr>
                        </thead>
                        <tbody>
                        {comidas.length > 0 ? (
                            comidas.map((comida, index) => (
                                <tr key={comida.registro_comida_id}>
                                    <td>{index + 1}</td>
                                    <td>{comida.nro_documento}</td>
                                    <td>{comida.nombres}</td>
                                    <td>{comida.apellido_paterno}</td>
                                    <td>{comida.apellido_materno}</td>
                                    <td>{comida.grado}</td>
                                    <td>{comida.seccion}</td>
                                    <EditableDateCell
                                        value={comida.hora_registro}
                                        registro_comida_id={comida.registro_comida_id}
                                        onDateChange={handleDateChange}
                                    />
                                    <td>
                                        <button
                                            className="button is-danger is-small"
                                            onClick={() => eliminarRegistroComida(comida.registro_comida_id)}
                                            title="Eliminar fila"
                                            disabled={isLoading}
                                        >
                                            <i className="fa fa-remove"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="has-text-centered">
                                    No hay registros para mostrar.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </>
            )}

            {/* Modal para seleccionar personas */}
            {showModal && (
                <div className={`modal ${showModal ? 'is-active' : ''}`}>
                    <div className="modal-background" onClick={closeModal}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Seleccionar Estudiantes</p>
                            <button className="delete" aria-label="close" onClick={closeModal}></button>
                        </header>
                        <section className="modal-card-body">
                            {modalLoading && <p>Cargando personas...</p>}
                            {modalError && <p className="has-text-danger">{modalError}</p>}
                            {!modalLoading && !modalError && (
                                <table className="table is-narrow is-fullwidth is-striped is-size-7">
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>DNI</th>
                                        <th>NOMBRES</th>
                                        <th>PATERNO</th>
                                        <th>MATERNO</th>
                                        <th colspan="2">GRAD./SEC</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {personas.map(person => (
                                        <tr key={person.persona_id}
                                            className={selectedPersons.includes(person.persona_id) ? 'is-selected' : ''}
                                            onClick={() => togglePersonSelection(person.persona_id)}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPersons.includes(person.persona_id)}
                                                    //onChange={() => togglePersonSelection(person.persona_id)}
                                                />
                                            </td>
                                            <td  style={{color: person.activo_comida ? 'black' : 'red'}}>{person.nro_documento}</td>
                                            <td style={{color: person.activo_comida ? 'black' : 'red'}}>
                                                {person.nombres}
                                            </td>
                                            <td style={{color: person.activo_comida ? 'black' : 'red'}}>{person.apellido_paterno}</td>
                                            <td style={{color: person.activo_comida ? 'black' : 'red'}}>{person.apellido_materno}</td>
                                            <td style={{color: person.activo_comida ? 'black' : 'red'}}>{person.grado}</td>
                                            <td style={{color: person.activo_comida ? 'black' : 'red'}}>{person.seccion}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button is-success" onClick={handleAddSelected}>
                                Agregar
                            </button>
                            <button className="button" onClick={closeModal}>
                                Cancelar
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}
