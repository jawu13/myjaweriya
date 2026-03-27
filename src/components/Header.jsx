import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserDropdown from './UserDropdown';
import styles from './Header.module.css';

const Header = () => {
    const { token } = useAuth();

    // Helper to determine the NavLink class
    const getNavLinkClass = ({ isActive }) => {
        return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
    };

    return (
        <header className={styles.appHeader}>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link className={`navbar-brand ${styles.navbarBrand}`} to="/">WellnessJourney</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item"><NavLink className={getNavLinkClass} to="/">Home</NavLink></li>
                            <li className="nav-item"><NavLink className={getNavLinkClass} to="/resources">Resources</NavLink></li>
                            <li className="nav-item"><NavLink className={getNavLinkClass} to="/forum">Forums</NavLink></li>
                            <li className="nav-item"><NavLink className={getNavLinkClass} to="/therapists">Find a Therapist</NavLink></li>
                            {token && <li className="nav-item"><NavLink className={getNavLinkClass} to="/assessments">Assessments</NavLink></li>}
                        </ul>
                        <div className="d-flex align-items-center">
                             {token ? (
                                <UserDropdown />
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-outline-secondary me-2">Login</Link>
                                    <Link to="/register" className={`btn btn-primary ${styles.signUpButton}`}>Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;