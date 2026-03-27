import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/forums/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create post.');
            }
            toast.success('Post created successfully!');
            navigate('/forum');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h2>Create a New Post</h2>
                    <p>Share your thoughts or ask a question to the community.</p>
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" id="title" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="content">Content</label>
                                    <textarea id="content" className="form-control" rows="8" value={content} onChange={(e) => setContent(e.target.value)} required ></textarea>
                                    <small className="form-text text-muted">You can use Markdown for formatting.</small>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit Post</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePostPage;