import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';

const PostDetailPage = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const [postData, setPostData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newReplyContent, setNewReplyContent] = useState('');

    // We wrap the fetch logic in useCallback to prevent re-creating it on every render
    const fetchPostAndReplies = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/forums/posts/${id}`);
            if (!response.ok) {
                throw new Error('Post not found.');
            }
            const data = await response.json();
            setPostData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPostAndReplies();
    }, [fetchPostAndReplies]);

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!newReplyContent.trim()) return;

        try {
            const response = await fetch(`http://localhost:8080/api/forums/posts/${id}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newReplyContent }),
            });

            if (!response.ok) {
                throw new Error('Failed to post reply.');
            }

            setNewReplyContent(''); // Clear the textarea
            fetchPostAndReplies(); // Refetch the data to show the new reply instantly

        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p className="text-center mt-5">Loading post...</p>;
    if (error) return <p className="text-center mt-5 text-danger">Error: {error}</p>;
    if (!postData) return null;

    return (
        <div className="container mt-5">
            <div className="card mb-4">
                <div className="card-header d-flex justify-content-between">
                    <span>By {postData.post.authorUsername}</span>
                    <span>{new Date(postData.post.createdAt).toLocaleString()}</span>
                </div>
                <div className="card-body">
                    <h2 className="card-title">{postData.post.title}</h2>
                    <ReactMarkdown>{postData.post.content}</ReactMarkdown>
                </div>
            </div>

            <h3 className="mb-3">Replies ({postData.replies.length})</h3>
            {postData.replies.map(reply => (
                <div className="card mb-3" key={reply.id}>
                    <div className="card-body">
                        <ReactMarkdown>{reply.content}</ReactMarkdown>
                        <footer className="blockquote-footer mt-2">
                            {reply.authorUsername} on {new Date(reply.createdAt).toLocaleString()}
                        </footer>
                    </div>
                </div>
            ))}

            {token ? (
                <div className="card mt-4">
                    <div className="card-body">
                        <h5 className="card-title">Leave a Reply</h5>
                        <form onSubmit={handleReplySubmit}>
                            <div className="form-group mb-3">
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={newReplyContent}
                                    onChange={(e) => setNewReplyContent(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Post Reply</button>
                        </form>
                    </div>
                </div>
            ) : (
                <p className="text-center mt-4">
                    <Link to="/login">Log in</Link> to post a reply.
                </p>
            )}
        </div>
    );
};

export default PostDetailPage;