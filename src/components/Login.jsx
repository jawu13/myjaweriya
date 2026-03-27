import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AuthForm.css';
import Button from './Button';
import Card from './Card';
import cardStyles from './Card.module.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login, token, user } = useAuth(); // Get token and user
    const navigate = useNavigate();
    const location = useLocation();
    
    // This effect will run when the 'token' changes (i.e., after a successful login)
    useEffect(() => {
        if (token && user) {
            const from = location.state?.from?.pathname || "/profile";
            const destination = user.roles.includes('ROLE_ADMIN') ? '/admin' : from;
            
            // Navigate with the success message
            navigate(destination, { replace: true, state: { message: 'Login successful!' } });
        }
    }, [token, user, navigate, location.state]);


    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                // The ONLY thing we do on success is call login.
                // The useEffect will handle the navigation.
                login(data.token);
            } else {
                toast.error(data.message || 'Invalid email or password.');
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
        }
    };

    return (
        <div className="auth-container-wrapper">
            <Card className="auth-card">
                <div className="auth-visual-side">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#2A9D8F" d="M48.8,-66.9C61,-55,67.2,-37.7,69.5,-20.7C71.8,-3.7,70.3,13,62.9,26.9C55.5,40.8,42.2,51.9,27.8,60.5C13.4,69.1,-2.2,75.2,-17.8,72.4C-33.3,69.6,-48.9,57.9,-59.4,43.2C-69.9,28.5,-75.4,10.8,-72.8,-5.5C-70.2,-21.8,-59.5,-36.7,-46.8,-48.2C-34,-59.7,-19.2,-67.8,-3.1,-66.6C13,-65.4,26.1,-64.8,38.8,-66.9Z" transform="translate(100 100)" />
                    </svg>
                    <h3>A Space for Clarity</h3>
                    <p>Welcome back. Your path to understanding and well-being continues here. We're glad to see you again.</p>
                </div>
                <div className="auth-form-side">
                    <div className={`${cardStyles.cardContent} auth-card-content`}>
                        <div className="auth-header">
                            <h2>Sign In</h2>
                            <p>Please enter your details to continue.</p>
                        </div>
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group"><label>Email</label><input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Password</label><input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required /></div>
                            <Button type="submit" variant="primary" className="auth-btn">Sign In</Button>
                        </form>
                        <div className="auth-footer"><p>Don't have an account? <Link to="/register">Sign Up</Link></p></div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Login;