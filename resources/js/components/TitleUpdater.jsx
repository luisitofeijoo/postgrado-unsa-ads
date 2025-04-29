import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const titleMapping = {
    '/': 'Página de inicio',
    '/login': 'Iniciar sesión',
    '/mesa-de-partes': 'Mesa de partes',
    '/admin': 'Panel de administración',
    '/editar-perfil': 'Editar perfil',
    '/ajustes': 'Ajustes de cuenta',
};

const getTitle = (pathname) => titleMapping[pathname] || 'Mi sitio web';

const TitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        const { pathname } = location;
        const title = getTitle(pathname);
        document.title = title;
    }, [location]);

    return null;
};

export default TitleUpdater;
