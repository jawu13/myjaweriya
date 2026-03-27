import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import cardStyles from '../components/Card.module.css';
import styles from './AdminUsersPage.module.css';
import { Dropdown } from 'react-bootstrap';

const AdminUsersPage = () => {
    const [pageData, setPageData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchUsers = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/admin/users?page=${currentPage}&size=10`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch users.');
            const data = await response.json();
            setPageData(data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, currentPage]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
            try {
                const response = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to delete user.');
                toast.success('User deleted successfully.');
                fetchUsers();
            } catch (err) {
                toast.error(err.message);
            }
        }
    };

    if (loading) return <LoadingSpinner text="Loading users..." />;

    const getRoleBadge = (role) => {
        switch (role) {
            case 'ROLE_ADMIN': return 'bg-danger';
            case 'ROLE_THERAPIST': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    return (
        <div>
            <PageHeader
                title="User Management"
                subtitle="View, manage, and monitor all user accounts on the platform."
            />
            <Card>
                <div className={`${cardStyles.cardContent} ${styles.tableContainer}`}>
                    <div className="table-responsive">
                        <table className={styles.userTable}>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Roles</th>
                                    <th>Date Registered</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageData && pageData.content.length > 0 ? (
                                    pageData.content.map(user => (
                                        <tr key={user.id}>
                                            <td>
                                                <div className={styles.userInfoCell}>
                                                    <Avatar name={user.username} userId={user.id} />
                                                    <div className={styles.userInfo}>
                                                        <span className={styles.username}>{user.username}</span>
                                                        <span className={styles.email}>{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {user.roles.map(role => (
                                                    <span key={role} className={`badge ${getRoleBadge(role)} ${styles.roleBadge}`}>{role.replace('ROLE_', '').toLowerCase()}</span>
                                                ))}
                                            </td>
                                            <td className={styles.date}>
                                                {/* THIS IS THE FIX: Check if createdAt exists before formatting */}
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="text-end">
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${user.id}`}>
                                                        &#8942;
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu align="end">
                                                        <Dropdown.Item onClick={() => handleDelete(user.id)} className="text-danger">Delete User</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="text-center p-5">No users found.</td></tr>
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


export default AdminUsersPage;