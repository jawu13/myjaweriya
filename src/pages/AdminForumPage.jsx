import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import cardStyles from '../components/Card.module.css';
import styles from './AdminForumPage.module.css';
import { Dropdown } from 'react-bootstrap';

const AdminForumPage = () => {
    const [pageData, setPageData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchPosts = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/forums/posts?page=${currentPage}&size=10&sort=createdAt,desc`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch forum posts.');
            const data = await response.json();
            setPageData(data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, currentPage]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleDelete = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post and all its replies?')) {
            try {
                // THIS IS THE FIX: The URL now correctly includes "/posts/"
                const response = await fetch(`http://localhost:8080/api/forums/posts/${postId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to delete post.');
                toast.success('Post deleted successfully.');
                fetchPosts();
            } catch (err) {
                toast.error(err.message);
            }
        }
    };

    if (loading) return <LoadingSpinner text="Loading forum posts..." />;

    return (
        <div>
            <PageHeader
                title="Forum Management"
                subtitle="Moderate and manage all community discussions on the platform."
            />
            <Card>
                <div className={`${cardStyles.cardContent} ${styles.tableContainer}`}>
                    <div className="table-responsive">
                        <table className={styles.postTable}>
                            <thead>
                                <tr>
                                    <th>Post</th>
                                    <th>Replies</th>
                                    <th>Date Created</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageData && pageData.content.length > 0 ? (
                                    pageData.content.map(post => (
                                        <tr key={post.id}>
                                            <td>
                                                <div className={styles.postInfo}>
                                                    <span className={styles.title}>{post.title}</span>
                                                    <span className={styles.author}>by {post.authorUsername}</span>
                                                </div>
                                            </td>
                                            <td>{post.replyCount}</td>
                                            <td className={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</td>
                                            <td className="text-end">
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${post.id}`}>
                                                        &#8942;
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu align="end">
                                                        <Dropdown.Item as={Link} to={`/forum/post/${post.id}`} target="_blank">View Post</Dropdown.Item>
                                                        <Dropdown.Item as={Link} to={`/admin/forum/edit/${post.id}`}>Edit Post</Dropdown.Item>
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item onClick={() => handleDelete(post.id)} className="text-danger">Delete Post</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="text-center p-5">No forum posts found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
            <Pagination pageData={pageData} onPageChange={setCurrentPage} />
        </div>
    );
};

export default AdminForumPage;