import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function GoogleCallback() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const location = useLocation();
    const { setUser } = useAuth();
    const navigate = useNavigate(); // Cambio aquí

    useEffect(() => {
        fetch(`http://localhost:8000/api/auth/google/callback${location.search}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setUser(data.user);
               // navigate('/admin'); // Usar navigate en lugar de useNavigate
            });
    }, []);
}
