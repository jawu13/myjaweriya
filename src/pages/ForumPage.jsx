import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Card from '../components/Card';
import cardStyles from '../components/Card.module.css';
import styles from './ForumPage.module.css';
import { toast } from 'react-toastify';

const ForumPage = () => {
    const [pageData, setPageData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            // THIS IS THE FIX: The URL is now correct
            const response = await fetch(`http://localhost:8080/api/forums/posts?page=${currentPage}&size=10&sort=createdAt,desc`);
            if (!response.ok) throw new Error('Failed to fetch forum posts.');
            const data = await response.json();
            setPageData(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    if (loading) return <LoadingSpinner text="Loading forum..." />;

    return (
        <div className="container mt-5">
            <PageHeader
                title="Community Forum"
                subtitle="Connect with others, share your experiences, and find support in a safe and anonymous space."
            />

            <div className="text-end mb-4">
                {token && (
                    <Link to="/forum/create-post">
                        <Button variant="primary">Create New Post</Button>
                    </Link>
                )}
            </div>

            <div>
                {pageData && pageData.content.length > 0 ? (
                    pageData.content.map(post => (
                        <Link to={`/forum/post/${post.id}`} key={post.id} className={styles.postCard}>
                            <Card>
                                <div className={cardStyles.cardContent}>
                                    <h5>{post.title}</h5>
                                    <p className={styles.postMeta}>
                                        Posted by {post.authorUsername} on {new Date(post.createdAt).toLocaleDateString()}
                                        <span className="ms-3 badge rounded-pill bg-light text-dark">
                                            {post.replyCount || 0} Replies
                                        </span>
                                    </p>
                                </div>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <div className="text-center">
                        <Card><div className={cardStyles.cardContent}><p>No posts have been made yet. Be the first to start a conversation!</p></div></Card>
                    </div>
                )}
            </div>

            <Pagination pageData={pageData} onPageChange={setCurrentPage} />
        </div>
    );
};

export default ForumPage;