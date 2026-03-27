import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const TherapistApplicationPage = () => {
    const [formData, setFormData] = useState({
        specializations: '',
        bio: '',
        credentials: ''
    });
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const submissionData = {
            ...formData,
            specializations: formData.specializations.split(',').map(s => s.trim()).filter(s => s)
        };

        if (submissionData.specializations.length === 0) {
            toast.error("Please enter at least one specialization.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/therapists/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(submissionData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to submit application.');
            }

            toast.success('Your application has been submitted for review!');
            navigate('/profile'); // Redirect back to the profile page
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h2>Apply to be a Therapist</h2>
                    <p>Fill out your professional profile below. Our administrators will review your application.</p>
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Credentials (e.g., LPC, PhD)</label>
                                    <input type="text" name="credentials" className="form-control" value={formData.credentials} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Specializations</label>
                                    <input type="text" name="specializations" className="form-control" value={formData.specializations} onChange={handleChange} required />
                                    <small className="form-text text-muted">Enter a comma-separated list (e.g., CBT, Anxiety, Stress Management)</small>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Biography</label>
                                    <textarea name="bio" className="form-control" rows="6" value={formData.bio} onChange={handleChange} minLength="50" required></textarea>
                                    <small className="form-text text-muted">Must be at least 50 characters.</small>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit Application</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TherapistApplicationPage;