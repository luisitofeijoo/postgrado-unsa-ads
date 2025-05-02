import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import {AuthProvider} from "@/context/AuthContext";
import router from "./router";
import axiosInterceptors from "../js/services/axiosInterceptors" // Importa los interceptores de Axios

import AjusteCuenta from "@/page/AjusteCuenta";

ReactDOM.createRoot(document.getElementById('root')).render(
        <AuthProvider>
            <RouterProvider router={router}/>
        </AuthProvider>
);
