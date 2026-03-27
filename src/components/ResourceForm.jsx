import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';


const ResourceForm = ({ isEditMode = false }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [formData, setFormData] = useState({
        title: '', description: '', contentType: 'PDF', author: '', category: '', videoUrl: '', fileUrl: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const fetchResource = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/resources/${id}`);
                    if (!response.ok) throw new Error('Could not fetch resource data.');
                    const data = await response.json();
                    setFormData(data);
                } catch (err) {
                    toast.error(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchResource();
        }
    }, [id, isEditMode]);

    const handleTextChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const data = new FormData();
        if (file) { data.append('file', file); }
        const resourceData = { ...formData };
        delete resourceData.id;
        
        const resourceBlob = new Blob([JSON.stringify(resourceData)], { type: 'application/json' });
        data.append('resource', resourceBlob);

        const url = isEditMode ? `http://localhost:8080/api/resources/${id}` : 'http://localhost:8080/api/resources';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });
            if (!response.ok) throw new Error(`Failed to ${isEditMode ? 'save' : 'create'} resource.`);
            toast.success(`Resource ${isEditMode ? 'saved' : 'created'} successfully!`);
            
            if (user && user.roles.includes('ROLE_ADMIN')) {
                navigate('/admin/resources');
            } else {
                navigate('/therapist/my-resources');
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading form..." />;

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3"><label>Title</label><input type="text" name="title" className="form-control" value={formData.title || ''} onChange={handleTextChange} required /></div>
            <div className="mb-3"><label>Description</label><textarea name="description" className="form-control" rows="3" value={formData.description || ''} onChange={handleTextChange} required /></div>
            <div className="mb-3"><label>Author</label><input type="text" name="author" className="form-control" value={formData.author || ''} onChange={handleTextChange} required /></div>
            <div className="mb-3"><label>Category</label><input type="text" name="category" className="form-control" value={formData.category || ''} onChange={handleTextChange} required /></div>
            <div className="mb-3"><label>Content Type</label>
                <select name="contentType" className="form-control" value={formData.contentType || 'PDF'} onChange={handleTextChange}>
                    <option value="PDF">PDF Material</option>
                    <option value="VIDEO">Video</option>
                </select>
            </div>

            {formData.contentType === 'PDF' ? (
                <div className="mb-3">
                    <label>PDF File</label>
                    <input type="file" name="file" className="form-control" onChange={handleFileChange} accept=".pdf" />
                    {isEditMode && formData.fileUrl && <small className="d-block mt-1">Current file: <a href={formData.fileUrl} target="_blank" rel="noopener noreferrer">View PDF</a></small>}
                </div>
            ) : (
                <div className="mb-3">
                    <label>YouTube Video URL</label>
                    <input type="url" name="videoUrl" className="form-control" value={formData.videoUrl || ''} onChange={handleTextChange} placeholder="https://www.youtube.com/watch?v=..." required />
                </div>
            )}
            {isEditMode && formData.fileUrl && 
    <small className="d-block mt-1">
        Current file: 
        <a href={`http://localhost:8080/api/files/${formData.fileUrl}`} target="_blank" rel="noopener noreferrer">
            View PDF
        </a>
    </small>
}

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                    <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span className="ms-2">Submitting...</span></>
                ) : ( isEditMode ? 'Save Changes' : 'Create Resource' )}
            </button>
        </form>
    );
};

export default ResourceForm;