import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ChangePasswordForm = () => {
    const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const { token } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('New passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/profile/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || 'Failed to change password.');
            }
            toast.success(responseText);
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="card mt-4">
            <div className="card-header"><h3>Change Password</h3></div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3"><label>Current Password</label><input type="password" name="currentPassword" className="form-control" value={formData.currentPassword} onChange={handleChange} required /></div>
                    <div className="mb-3"><label>New Password</label><input type="password" name="newPassword" className="form-control" value={formData.newPassword} onChange={handleChange} required /></div>
                    <div className="mb-3"><label>Confirm New Password</label><input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required /></div>
                    <button type="submit" className="btn btn-primary">Update Password</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordForm;