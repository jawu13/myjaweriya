import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';

const ResourceDetailPage = () => {
    const { id } = useParams();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/resources/${id}`);
                if (!response.ok) throw new Error('Resource not found.');
                const data = await response.json();
                setResource(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchResource();
    }, [id]);

    const renderContent = () => {
        if (!resource) return null;

        if (resource.contentType === 'VIDEO' && resource.videoUrl) {
            const getYouTubeEmbedUrl = (url) => {
                try {
                    const urlObj = new URL(url);
                    const videoId = urlObj.searchParams.get('v');
                    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
                } catch { return ''; }
            };
            const embedUrl = getYouTubeEmbedUrl(resource.videoUrl);
            return (
                <div className="ratio ratio-16x9">
                    <iframe src={embedUrl} title={resource.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
            );
        }

        if (resource.contentType === 'PDF' && resource.fileUrl) {
    return (
        <div>
            <p>{resource.description}</p>
            {/* The link now points to our own API */}
            <a href={`http://localhost:8080/api/files/${resource.fileUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                View PDF
            </a>
        </div>
    );
}
        return <p>Content for this resource is not available.</p>;
    };

    if (loading) return <LoadingSpinner text="Loading resource..." />;
    if (error) return <p className="text-center mt-5 text-danger">Error: {error}</p>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <article>
                        <header className="mb-4">
                            <h1 className="fw-bolder mb-1">{resource.title}</h1>
                            <div className="text-muted fst-italic mb-2">
                                Posted on {new Date(resource.createdAt).toLocaleDateString()} by {resource.author}
                            </div>
                            <span className="badge bg-secondary">{resource.category}</span>
                        </header>
                        <section className="mb-5">
                            {renderContent()}
                        </section>
                    </article>
                    <Link to="/resources">← Back to all resources</Link>
                </div>
            </div>
        </div>
    );
};

export default ResourceDetailPage;