import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import cardStyles from '../components/Card.module.css';
import styles from './AdminTherapistsPage.module.css';
import { Dropdown } from 'react-bootstrap';

const AdminTherapistsPage = () => {
    const [pageData, setPageData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchTherapists = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/admin/therapist-profiles?page=${currentPage}&size=10`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch therapist profiles.');
            const data = await response.json();
            setPageData(data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, currentPage]);

    useEffect(() => {
        fetchTherapists();
    }, [fetchTherapists]);

    const handleApprove = async (profileId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin/therapist-profiles/${profileId}/approve`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to approve therapist.');
            toast.success('Therapist approved successfully.');
            fetchTherapists();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (profileId) => {
        if (window.confirm('Are you sure you want to delete this therapist profile? Their role will be reverted to a regular user.')) {
            try {
                const response = await fetch(`http://localhost:8080/api/admin/therapist-profiles/${profileId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to delete therapist profile.');
                toast.success('Therapist profile deleted successfully.');
                fetchTherapists();
            } catch (err) {
                toast.error(err.message);
            }
        }
    };

    if (loading) return <LoadingSpinner text="Loading therapist applications..." />;

    const getStatusBadge = (status) => {
        return status === 'APPROVED' ? 'bg-success' : 'bg-warning';
    };

    return (
        <div>
            <PageHeader
                title="Therapist Management"
                subtitle="Review and approve applications from professionals seeking to join the platform."
            />
            <Card>
                <div className={`${cardStyles.cardContent} ${styles.tableContainer}`}>
                    <div className="table-responsive">
                        <table className={styles.therapistTable}>
                            <thead>
                                <tr>
                                    <th>Therapist</th>
                                    <th>Specializations</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageData && pageData.content.length > 0 ? (
                                    pageData.content.map(profile => (
                                        <tr key={profile.id}>
                                            <td>
                                                <div className={styles.therapistInfo}>
                                                    <Avatar name={profile.user.username} userId={profile.user.id} />
                                                    <div className={styles.infoDetails}>
                                                        <span className={styles.name}>{profile.user.username}</span>
                                                        <span className={styles.email}>{profile.user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {profile.specializations.slice(0, 3).map(spec => (
                                                     <span key={spec} className="badge bg-light text-dark me-1">{spec}</span>
                                                ))}
                                            </td>
                                            <td>
                                                <span className={`badge ${getStatusBadge(profile.status)} ${styles.statusBadge}`}>{profile.status.toLowerCase()}</span>
                                            </td>
                                            <td className="text-end">
                                                 <Dropdown>
                                                    <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${profile.id}`}>
                                                        &#8942;
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu align="end">
                                                        {profile.status === 'PENDING' && (
                                                            <Dropdown.Item onClick={() => handleApprove(profile.id)}>Approve</Dropdown.Item>
                                                        )}
                                                        <Dropdown.Item onClick={() => handleDelete(profile.id)} className="text-danger">
                                                            Delete / Reject
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="text-center p-5">No therapist applications found.</td></tr>
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

export default AdminTherapistsPage;