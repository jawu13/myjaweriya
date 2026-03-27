import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className="app-container">
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
            {/* The ToastContainer and useEffect have been removed from here */}
        </div>
    );
};

export default Layout;