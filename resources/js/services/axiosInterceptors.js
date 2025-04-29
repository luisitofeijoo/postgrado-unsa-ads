// services/axiosInterceptors.js
import axios from 'axios';

// Configurar el interceptor de respuestas
axios.interceptors.response.use(
    function(response) {
        // Hacer algo con la respuesta recibida, por ejemplo, realizar algún procesamiento
        console.log('Respuesta recibida:', response);
        if (response.data) {
            response.data = convertNullValuesToNull(response.data);
        }
        return response;
    },
    function(error) {
        // Manejar errores de respuesta
        if (error.response.status === 401) {
            // Aquí puedes redirigir al usuario a la página de inicio de sesión o mostrar un mensaje de error
            console.error('Error 401: No autorizado');
            window.location.href = '/login'; // Redirigir al usuario a la página de inicio de sesión
        }
        return Promise.reject(error);
    }
);

// Configurar el interceptor de solicitudes
axios.interceptors.request.use(
    function(config) {
        // Convertir valores null a "null" en los datos de la solicitud
        if (config.data) {
            config.data = convertNullValuesToNull(config.data);
        }
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

// Función recursiva para convertir valores null a '' en los datos anidados
function convertNullValuesToNull(data) {
    if (typeof data === 'object' && data !== null) {
        Object.keys(data).forEach(key => {
            if (data[key] === 'null' || data[key] === null) {
                data[key] = '';
            } else if (typeof data[key] === 'object') {
                convertNullValuesToNull(data[key]);
            }
        });
    }
    return data;
}

export default axios;
