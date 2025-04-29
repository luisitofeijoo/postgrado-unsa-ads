import React, { useEffect, useState } from "react";
import axios from "axios";
import SelectComponent from "@/components/Form/SelectComponent";
import { FormProvider, useForm } from 'react-hook-form';

export default function SelectUbicacion() {
    const [data, setData] = useState([]);
    const [selectedId, setSelectedId] = useState(null); // Estado para el id seleccionado
    const methods = useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(route('ubicacion.index'));
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Simular la selección del ID 3 después de que se obtengan los datos
        setSelectedId(3); // Aquí establecemos el ID predeterminado como 3
    }, []);

    const handleSelect = (id) => {
        setSelectedId(id);
    };

    return (
        <FormProvider {...methods}>
            <form>
                <SelectComponent
                    name="selectOption"
                    options={data}
                    defaultValue="Seleccionar"
                    selectedOption={selectedId} // Pasa el id seleccionado como prop
                    onSelect={handleSelect} // Maneja la selección de la opción
                />
            </form>
        </FormProvider>
    );
}
