import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';
import Card from './Card';
import Button from './Button';
import cardStyles from './Card.module.css';

const ServiceForm = ({ isEditMode = false }) => {
    const { id } = useParams();
    const [formData, setFormData] = useState({ name: '', description: '', durationInMinutes: 30, price: 50, type: 'VIDEO_CALL' });
    const [loading, setLoading] = useState(isEditMode);
    const { token } = useAuth();
    const navigate = useNavigate();

    // This effect runs when the component loads in "edit mode"
    useEffect(() => {
        if (isEditMode && id) {
            const fetchService = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/therapists/services/${id}`, {
                         headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) throw new Error('Could not fetch service data.');
                    const data = await response.json();
                    setFormData(data); // Pre-populates the form with the fetched data
                } catch (err) {
                    toast.error(err.message);
                    navigate('/therapist/my-services'); // Redirect back if data can't be loaded
                } finally {
                    setLoading(false);
                }
            };
            fetchService();
        }
    }, [id, isEditMode, token, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditMode ? `http://localhost:8080/api/therapists/services/${id}` : 'http://localhost:8080/api/therapists/services';
        const method = isEditMode ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} service.`);
            toast.success(`Service ${isEditMode ? 'updated' : 'created'} successfully!`);
            navigate('/therapist/my-services');
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (loading) return <LoadingSpinner text="Loading service form..." />;

    return (
        <Card>
            <div className={cardStyles.cardContent}>
                 <form onSubmit={handleSubmit}>
                    <div className="mb-3"><label>Service Name</label><input type="text" name="name" className="form-control" value={formData.name || ''} onChange={handleChange} required /></div>
                    <div className="mb-3"><label>Description</label><textarea name="description" className="form-control" rows="3" value={formData.description || ''} onChange={handleChange} required></textarea></div>
                    <div className="row">
                        <div className="col-md-4 mb-3"><label>Duration (minutes)</label><input type="number" name="durationInMinutes" className="form-control" value={formData.durationInMinutes || 0} onChange={handleChange} required /></div>
                        <div className="col-md-4 mb-3"><label>Price ($)</label><input type="number" step="0.01" name="price" className="form-control" value={formData.price || 0} onChange={handleChange} required /></div>
                        <div className="col-md-4 mb-3"><label>Type</label><select name="type" className="form-control" value={formData.type || 'VIDEO_CALL'} onChange={handleChange}><option value="VIDEO_CALL">Video Call</option><option value="AUDIO_CALL">Audio Call</option></select></div>
                    </div>
                    <Button type="submit" variant="primary">{isEditMode ? 'Save Changes' : 'Create Service'}</Button>
                </form>
            </div>
        </Card>
    );
};

export default ServiceForm;