import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = () => {
    const { token, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner text="Loading user data..." />;
    }

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return <Outlet />;
};

export default ProtectedRoute;