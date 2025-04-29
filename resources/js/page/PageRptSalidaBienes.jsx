import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import {toast} from "react-toastify";
export default function PageRptSalidaBienes() {

    const [selectAll, setSelectAll] = useState(false);
    const [checkboxes, setCheckboxes] = useState([
        { id: 1, label: "Tercero A", value: "3A", checked: false, group: "tercero" },
        { id: 2, label: "Tercero B", value: "3B", checked: false, group: "tercero" },
        { id: 3, label: "Tercero C", value: "3C", checked: false, group: "tercero" },
        { id: 4, label: "Tercero D", value: "3D", checked: false, group: "tercero" },
        { id: 5, label: "Cuarto A", value: "4A", checked: false, group: "cuarto" },
        { id: 6, label: "Cuarto B", value: "4B", checked: false, group: "cuarto" },
        { id: 7, label: "Cuarto C", value: "4C", checked: false, group: "cuarto" },
        { id: 8, label: "Cuarto D", value: "4D", checked: false, group: "cuarto" },
        { id: 9, label: "Quinto A", value: "5A", checked: false, group: "quinto" },
        { id: 10, label: "Quinto B", value: "5B", checked: false, group: "quinto" },
        { id: 11, label: "Quinto C", value: "5C", checked: false, group: "quinto" },
        { id: 12, label: "Quinto D", value: "5D", checked: false, group: "quinto" },
    ]);
    const [selectedValues, setSelectedValues] = useState([]);

    const [checkboxesChecked, setCheckboxesChecked] = useState({});
    const {register, setValue, getValues, handleSubmit, reset, formState: {errors}, watch} = useForm();
    const [tercerosSeleccionados, setTercerosSeleccionados] = useState([]);

    useEffect(() => {
        // Obtener la fecha actual en formato YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        // Establecer la fecha actual como valor por defecto en el input
        setValue('date_start', today);
        setValue('date_end', today);
    }, []);

    const openWindowPdf = (data) => {
        if(selectedValues.length === 0) {
            toast.error('Debe seleccionar al menos un grado y sección para continuar...', {
                position: "top-left",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
            return false;
        }
        const tercerosSeleccionadosUnificados = unificarNumeros(selectedValues);
        const width = 800;
        const height = 600;
        const left = window.innerWidth / 2 - width / 2;
        const top = window.innerHeight / 2 - height / 2;
        window.open('/reporte/salida-bienes-estudiantes?date_start=' + data.date_start + '&date_end=' + data.date_end + `&gs=${tercerosSeleccionadosUnificados}`, 'Floating Window', `width=${width}, height=${height}, left=${left}, top=${top}`);
    }

    // Función para manejar el cambio en el checkbox "Seleccionar Todos"
    const handleSelectAll = () => {
        const updatedCheckboxes = checkboxes.map(checkbox => ({
            ...checkbox,
            checked: !selectAll
        }));
        setCheckboxes(updatedCheckboxes);
        setSelectAll(!selectAll);
        setSelectedValues(!selectAll ? checkboxes.map(checkbox => checkbox.value) : []);
    };

    // Función para manejar el cambio en un checkbox individual
    const handleCheckboxChange = (id) => {
        const updatedCheckboxes = checkboxes.map(checkbox =>
            checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
        );
        setCheckboxes(updatedCheckboxes);
        setSelectAll(updatedCheckboxes.every(checkbox => checkbox.checked));

        const selected = updatedCheckboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
        setSelectedValues(selected);
    };

    const unificarNumeros = (array) => {
        const unificado = {};
        array.forEach(elemento => {
            const numero = elemento.charAt(0);
            const letra = elemento.substring(1);
            if (unificado[numero]) {
                unificado[numero] += letra;
            } else {
                unificado[numero] = numero + letra;
            }
        });
        return Object.values(unificado);
    }

    const renderCheckboxesByGroup = (groupName) => {
        return checkboxes.filter(checkbox => checkbox.group === groupName).map(checkbox => (
            <div key={checkbox.id}>
                <input
                    type="checkbox"
                    id={`checkbox-${checkbox.id}`}
                    checked={checkbox.checked}
                    onChange={() => handleCheckboxChange(checkbox.id)}
                    value={checkbox.value}
                />
                <label htmlFor={`checkbox-${checkbox.id}`}> {checkbox.label}</label>
            </div>
        ));
    };

    return <>
        <div className="container content">
            <br/>
                <h4>Reporte de Ingreso/Salida por Grado y sección </h4>
                <label>
                    <input type="checkbox"
                              checked={selectAll}
                              onChange={handleSelectAll}
                    />
                    &nbsp; Seleccionar todos
                </label>
            <table  className="is-fullwidth" style={{ width: 'auto' }}>
                <tbody>
                    <tr>
                        <td>
                            {renderCheckboxesByGroup('tercero')}</td>
                        <td>
                            {renderCheckboxesByGroup('cuarto')}</td>
                        <td>
                            {renderCheckboxesByGroup('quinto')}</td>
                    </tr>
                </tbody>
            </table>

                <form onSubmit={handleSubmit(openWindowPdf)}>
                    <div className="field is-grouped">
                        <p className="control"><input type="date" className="input" {...register('date_start')} style={{width: '200px'}}/></p>
                        <p className="control"><input type="date" className="input" {...register('date_end')} style={{width: '200px'}}/></p>
                        <p className="control"><button type="submit" className="button is-warning">Generar</button></p>
                    </div>
                </form>
        </div>
    </>;
}
