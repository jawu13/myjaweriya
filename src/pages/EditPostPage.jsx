import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Note: The API returns the post and its replies, we only need the post object
                const response = await fetch(`http://localhost:8080/api/forums/posts/${id}`);
                if (!response.ok) throw new Error('Could not fetch post data.');
                const data = await response.json();
                setFormData({ title: data.post.title, content: data.post.content });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch(`http://localhost:8080/api/forums/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Failed to update post.');
            navigate('/admin/forum');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading post for editing...</p>;
    if (error) return <p className="text-danger">Error: {error}</p>;

    return (
        <div>
            <h1>Edit Forum Post</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Title</label>
                    <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Content</label>
                    <textarea name="content" className="form-control" rows="10" value={formData.content} onChange={handleChange} required></textarea>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

export default EditPostPage;