import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Card from '../components/Card';
import cardStyles from '../components/Card.module.css';
import styles from './AdminResourcesPage.module.css';
import { toast } from 'react-toastify';
import { Dropdown } from 'react-bootstrap';

const AdminResourcesPage = () => {
    const [pageData, setPageData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchResources = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/admin/resources?page=${currentPage}&size=10&sort=createdAt,desc`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch resources.');
            const data = await response.json();
            setPageData(data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, currentPage]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const handleApprove = async (resourceId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin/resources/${resourceId}/approve`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to approve resource.');
            toast.success('Resource approved successfully!');
            fetchResources();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (resourceId) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/resources/${resourceId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to delete resource.');
                toast.success('Resource deleted successfully.');
                fetchResources();
            } catch (err) {
                toast.error(err.message);
            }
        }
    };

    if (loading) return <LoadingSpinner text="Loading resources..." />;

    const getStatusBadge = (status) => {
        return status === 'APPROVED' ? 'bg-success' : 'bg-warning';
    };

    return (
        <div>
            <PageHeader
                title="Resource Management"
                subtitle="Manage all educational resources, including articles and videos submitted by therapists."
            />
            <div className="text-end mb-4">
                <Link to="/admin/resources/new"><Button>Create New Resource</Button></Link>
            </div>
            <Card>
                <div className={`${cardStyles.cardContent} ${styles.tableContainer}`}>
                    <div className="table-responsive">
                        <table className={styles.resourceTable}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageData && pageData.content.length > 0 ? (
                                    pageData.content.map(resource => (
                                        <tr key={resource.id}>
                                            <td>
                                                <div className={styles.resourceInfo}>
                                                    <span className={styles.title}>{resource.title}</span>
                                                    <span className={styles.category}>{resource.category}</span>
                                                </div>
                                            </td>
                                            <td>{resource.author}</td>
                                            <td>{resource.contentType}</td>
                                            <td>
                                                <span className={`badge ${getStatusBadge(resource.status)} ${styles.statusBadge}`}>{resource.status.toLowerCase()}</span>
                                            </td>
                                            <td className="text-end">
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${resource.id}`}>
                                                        &#8942;
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu align="end">
                                                        {resource.status === 'PENDING' && (
                                                            <Dropdown.Item onClick={() => handleApprove(resource.id)}>Approve</Dropdown.Item>
                                                        )}
                                                        <Dropdown.Item as={Link} to={`/admin/resources/edit/${resource.id}`}>Edit</Dropdown.Item>
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item onClick={() => handleDelete(resource.id)} className="text-danger">Delete</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="text-center p-5">No resources found.</td></tr>
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

export default AdminResourcesPage;