import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const MyResourcesPage = () => {
    const [pageData, setPageData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchMyResources = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/resources/my-resources?page=${currentPage}&size=10&sort=createdAt,desc`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch your resources.');
            const data = await response.json();
            setPageData(data);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, currentPage]);

    useEffect(() => {
        fetchMyResources();
    }, [fetchMyResources]);

    if (loading) return <LoadingSpinner text="Loading your resources..." />;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>My Content Submissions</h1>
                <Link to="/therapist/resources/new" className="btn btn-primary">Submit New Resource</Link>
            </div>
            <div className="card">
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr><th>Title</th><th>Category</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            {pageData && pageData.content.length > 0 ? (
                                pageData.content.map(resource => (
                                    <tr key={resource.id}>
                                        <td>{resource.title}</td>
                                        <td>{resource.category}</td>
                                        <td>
                                            <span className={`badge bg-${resource.status === 'APPROVED' ? 'success' : 'warning'}`}>
                                                {resource.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" className="text-center">You have not submitted any resources yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination pageData={pageData} onPageChange={setCurrentPage} />
        </div>
    );
};

export default MyResourcesPage;