import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AuthForm.css';
import Button from './Button';
import Card from './Card';
import cardStyles from './Card.module.css';

const initialState = {
    username: '', email: '', address: '', phoneNumber: '', 
    dateOfBirth: '', gender: '', password: '', confirmPassword: '',
};

const Register = () => {
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const successText = await response.text();
                toast.success(successText || 'Registration successful!');
                setFormData(initialState);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Registration failed.');
            }
        } catch (error) {
            toast.error('An error occurred during registration.');
        }
    };

    return (
        <div className="auth-container-wrapper">
            <Card className="auth-card">
                 <div className="auth-visual-side">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#8AB17D" d="M57.1,-61.3C71.3,-50.9,78.2,-31.2,77.3,-12.8C76.4,5.6,67.7,22.7,56.5,37.3C45.3,51.9,31.6,63.9,15.8,69.5C0,75.1,-17.9,74.2,-34,66.7C-50.1,59.2,-64.4,45.1,-71.2,28.2C-78,11.3,-77.3,-8.3,-69.5,-23.4C-61.7,-38.5,-46.8,-49.2,-32.2,-58.5C-17.6,-67.8,-3.4,-75.7,11.3,-75.8C26,-75.9,42.8,-71.7,57.1,-61.3Z" transform="translate(100 100)" />
                    </svg>
                    <h3>Your Journey Starts Now</h3>
                    <p>Create your free, confidential account to begin your path to wellness today.</p>
                 </div>
                 <div className="auth-form-side">
                    <div className={`${cardStyles.cardContent} auth-card-content`}>
                        <div className="auth-header">
                            <h2>Create Your Account</h2>
                            <p>It's quick, easy, and confidential.</p>
                        </div>
                        <form className="auth-form" onSubmit={handleSubmit}>
                             <div className="row">
                                <div className="col-md-6 form-group"><label>Username</label><input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required /></div>
                                <div className="col-md-6 form-group"><label>Email</label><input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required /></div>
                            </div>
                            <div className="form-group"><label>Address</label><input type="text" name="address" className="form-control" value={formData.address} onChange={handleChange} /></div>
                            <div className="row">
                                <div className="col-md-6 form-group"><label>Phone Number</label><input type="tel" name="phoneNumber" className="form-control" value={formData.phoneNumber} onChange={handleChange} /></div>
                                <div className="col-md-6 form-group"><label>Date of Birth</label><input type="date" name="dateOfBirth" className="form-control" value={formData.dateOfBirth} onChange={handleChange} /></div>
                            </div>
                            <div className="form-group"><label>Gender</label><select name="gender" className="form-control" value={formData.gender} onChange={handleChange}><option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                            <div className="row">
                                <div className="col-md-6 form-group"><label>Password</label><input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required /></div>
                                <div className="col-md-6 form-group"><label>Confirm Password</label><input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required /></div>
                            </div>
                            <Button type="submit" variant="primary" className="auth-btn mt-3">Create Account</Button>
                        </form>
                        <div className="auth-footer"><p>Already have an account? <Link to="/login">Sign In</Link></p></div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Register;