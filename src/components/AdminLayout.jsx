import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import Footer from './Footer'; // Using the main public footer
import './AdminLayout.css';

const AdminLayout = () => {
    return (
        <div className="admin-root">
            <AdminHeader />
            <div className="admin-layout">
                <nav className="admin-sidebar">
                    <ul className="nav flex-column">
                        <li className="nav-item"><NavLink className="nav-link" to="/admin" end>Dashboard</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/admin/users">Users</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/admin/resources">Resources</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/admin/forum">Forum Posts</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/admin/assessments">Assessments</NavLink></li> {/* ADD THIS LINE */}
                        <li className="nav-item"><NavLink className="nav-link" to="/admin/therapists">Therapist Applications</NavLink></li> {/* ADD THIS LINE */}
                    </ul>
                </nav>
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
            {/* The main footer is now correctly styled by admin-footer class via App.css global styles if needed, 
                but we defined it in AdminLayout.css for specificity */}
            <Footer />
        </div>
    );
};

export default AdminLayout;