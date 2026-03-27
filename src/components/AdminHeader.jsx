import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminHeader = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/admin">Admin Panel</Link>
                    <div className="ms-auto">
                        <Link to="/" className="btn btn-outline-secondary me-2">View Public Site</Link>
                        <button onClick={handleLogout} className="btn btn-primary">Logout</button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default AdminHeader;