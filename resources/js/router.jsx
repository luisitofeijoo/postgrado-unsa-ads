import {createBrowserRouter} from 'react-router-dom';
import MesaVirtual from './page/MesaVirtual';
import Login from './page/Login';
import Inbox from './page/Inbox';
import EditarPerfil from './page/EditarPerfil';
import TabsCuenta from './components/TabsCuenta';
import AjusteCuenta from './page/AjusteCuenta';
import ProtectedLayout from './components/ProtectedLayout';
import GuestLayout from './components/GuestLayout';
import PagePersonas from "./page/PagePersonas";
import PageEditarPersona from "./page/PageEditarPersona";
import PageProductos from "@/page/PageProductos";
import PageEditarProducto from "./page/PageEditarProducto";
import PageReniec from "@/page/PageReniec";
import PageDeuda from "@/page/PageDeuda";
import GoogleCallback from "@/components/GoogleCallback";
import PageProductoAsignacion from "@/page/PageProductoAsignacion";
import TabsPersona from "@/components/TabsPersona";
import SelectUbicacion from "@/components/SelectUbicacion";
import PageBienesRegistrarSalida from "@/page/PageBienesRegistrarSalida";
import PageRptSalidaBienes from "@/page/PageRptSalidaBienes";
import PageEstudiantes from "@/page/PageEstudiantes";
import PagePaletaSalida from "@/page/PagePaletaSalida";
import Areas from "@/page/Areas";
import RptIngresoSalidaBienes from "@/page/Rpt/RptIngresoSalidaBienes";
import PagePUAAsistenciaPostulante from "@/page/PagePUAAsistenciaPostulante";
import PagePUAPotulantes from "@/page/PagePUAPostulantes";
import PagePUAReporteXUsuario from "@/page/PagePUAReporteXUsuario";
import PagePUAAsistenciasEliminados from "@/page/PagePUAAsistenciasEliminados";
import PageRegistroComidaEdit from "@/page/PageRegistroComidaEdit";
import PageResumenComidaFecha from "@/page/PageResumenComidaFecha";
import RegistrarCuenta from "@/page/RegistrarCuenta";
import PageCrearCurso from "@/page/PageCrearCurso";
import PageCrearPreguntaRespuesta from "@/page/PageCrearPreguntaRespuesta";
import PageTomarEvaluacion from "@/page/PageTomarEvaluacion";

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
    /*
    * MENU PUA
    * */
    {
        element: <ProtectedLayout/>,
        children: [
            {
                path: 'pua/postulantes',
                element: <PagePUAPotulantes/>
            },

            {
                path: '/pua/registro-asistencia/postulante',
                element: <PagePUAAsistenciaPostulante/>
            },
            {
                path: '/pua/registro-asistencia/eliminados',
                element: <PagePUAAsistenciasEliminados/>
            },
            {
                path: '/pua/reporte/usuario',
                element: <PagePUAReporteXUsuario/>
            },
            {
                path: '/registro/comida/resumen-listar',
                element: <PageResumenComidaFecha/>
            },
            {
                path: '/registro/comida/edit/:fecha/:tipo_comida_id',
                element: <PageRegistroComidaEdit/>
            },
            {
                path: 'curso/crear',
                element: <PageCrearCurso/>
            },
            {
                path: 'evaluacion/crear',
                element: <PageCrearPreguntaRespuesta/>
            },
            {
                path: 'evaluacion/tomar/:id',
                element: <PageTomarEvaluacion/>
            },
        ]
    },
    {
        element: <ProtectedLayout/>,
        children: [
            {
                path: '/doc/registro',
                element: <MesaVirtual/>,
            },
            {
                path: '/doc/listar',
                element: <Inbox/>,
            },
            {
                path: '/doc/areas',
                element: <Areas/>,
            },
            {
                path: '/bienes/rpt-ingreso-salida',
                element: <RptIngresoSalidaBienes/>
            }
        ]
    },
 /*   {
        path: '/app/reniec',
        element: <PageReniec/>,
    },*/
    {
        path: '/',
        element: <ProtectedLayout/>,
        children: [
            {
                path: 'select',
                element: <SelectUbicacion/>
            },
            {
                path: 'admin',
                element: 'Hola, Bienvenido.',
            },
            {
                path: 'deudas',
                element: <PageDeuda/>,
            },
            {
                path: 'reniec',
                element: <PageReniec/>
            },
            {
                path: 'estudiantes',
                element: <PageEstudiantes/>,
            },
            {
                path: 'personas',
                element: <PagePersonas/>,
            },
            {
                path: 'productos',
                element: <PageProductos/>
            },
            {
                path: 'producto/editar/:id',
                element: <PageEditarProducto/>
            },
            {
                path: 'bienes/registro-salida',
                element: <PageBienesRegistrarSalida />,
            },
            {
                path: 'reporte/salida-bienes',
                element: <PageRptSalidaBienes />,
            },
            {
                path: 'page/papeleta-salida',
                element: <PagePaletaSalida />,
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
                    {
                        path: 'persona/editar/:id/asignar-bien',
                        element: <PageProductoAsignacion/>
                    },
                ]
            }
        ],
    },
]);

export default router;
