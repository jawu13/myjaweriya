import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const TherapistRoute = () => {
    const { isTherapist, isLoading } = useAuth();
    
    if (isLoading) {
        return <LoadingSpinner text="Verifying therapist status..." />;
    }

    return isTherapist() ? <Outlet /> : <Navigate to="/" />;
};

export default TherapistRoute;