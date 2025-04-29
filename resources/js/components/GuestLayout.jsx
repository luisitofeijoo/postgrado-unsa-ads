import React, {react} from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
export default function GuestLayout () {

    const { user } = useAuth();

    if(user) {
        return <Navigate to="/admin" />;
    }

    return (
        <>
            <Outlet />
        </>
    );
}
