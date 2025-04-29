import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const SelectComponent = ({ name, options, defaultValue }) => {
    const { register, setValue } = useFormContext();
    const [selectedOption, setSelectedOption] = useState(defaultValue || '');

    useEffect(() => {
        register(name);
        setValue(name, defaultValue); // Establecer el valor inicial
    }, [name, register, setValue]);

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
        setValue(name, e.target.value);
    };

    return (
        <div className="select">
            <select name={name} onChange={handleSelectChange} value={selectedOption}>
                {defaultValue && (
                    <option value="" disabled hidden>
                        {defaultValue}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectComponent;
