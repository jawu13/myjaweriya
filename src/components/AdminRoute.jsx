import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner'; // Make sure this is imported

const AdminRoute = () => {
    const { isAdmin, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner text="Verifying credentials..." />;
    }

    return isAdmin() ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;