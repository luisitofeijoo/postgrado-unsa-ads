import {createBrowserRouter} from 'react-router-dom';
import Login from './page/Login';
import EditarPerfil from './page/EditarPerfil';
import TabsCuenta from './components/TabsCuenta';
import AjusteCuenta from './page/AjusteCuenta';
import ProtectedLayout from './components/ProtectedLayout';
import GuestLayout from './components/GuestLayout';
import PagePersonas from "./page/PagePersonas";
import PageEditarPersona from "./page/PageEditarPersona";
import GoogleCallback from "@/components/GoogleCallback";
import TabsPersona from "@/components/TabsPersona";

import PageUsuarios from "@/page/PageUsuarios";
import RegistrarCuenta from "@/page/RegistrarCuenta";
import PageCrearCurso from "@/page/PageCrearCurso";
import PageCrearPreguntaRespuesta from "@/page/PageCrearPreguntaRespuesta";
import PageTomarEvaluacion from "@/page/PageTomarEvaluacion";
import PageDocenteCursos from "@/page/PageDocenteCursos";
import PageEvaluaciones from "@/page/pageEvaluaciones";
import PageCursoEvaluaciones from "@/page/PageCursoEvaluaciones";

const router = createBrowserRouter([
    {
      path: '/',
        element: <ProtectedLayout><Login/></ProtectedLayout>,
    },
    {
        path: 'registrar/cuenta',
        element: <RegistrarCuenta/>,
    },
    {
        path: '/',
        element: <GuestLayout/>,
        children: [
            {
                path: 'login',
                element: <Login/>,
            },
            {
                path: 'auth/google/callback',
                element: <GoogleCallback/>
            }
        ],
    },

    {
        element: <ProtectedLayout/>,
        children: [
            {
                path: 'curso/crear',
                element: <PageCrearCurso/>
            },
            {
                path: 'curso/evaluaciones',
                element: <PageCursoEvaluaciones/>
            },
            {
                path: 'evaluacion/crear/:id',
                element: <PageCrearPreguntaRespuesta/>
            },
            {
                path: 'evaluacion/tomar/:evaluacionEstudianteId',
                element: <PageTomarEvaluacion/>
            },
        ]
    },
    {
        path: '/',
        element: <ProtectedLayout/>,
        children: [
            {
                path: 'admin',
                element: 'Hola, Bienvenido.',
            },
            {
                path: 'docente/cursos/:user_id',
                element: <PageDocenteCursos/>,
            },
            {
                path: 'docente/evaluaciones/:user_id',
                element: <PageEvaluaciones/>,
            },
            {
                path: 'usuarios',
                element: <PageUsuarios/>,
            },
            {
                path: 'personas',
                element: <PagePersonas/>,
            },
            {
                path: '',
                element: <TabsCuenta/>,
                children: [
                    {
                        path: 'editar-perfil',
                        element: <EditarPerfil/>,
                    },
                    {
                        path: 'ajustes',
                        element: <AjusteCuenta/>,
                    },
                ],
            },
            {
                path: '',
                element: <TabsPersona/>,
                children: [
                    {
                        path: 'persona/editar/:id',
                        element: <PageEditarPersona/>
                    },
                ]
            }
        ],
    },
]);

export default router;
