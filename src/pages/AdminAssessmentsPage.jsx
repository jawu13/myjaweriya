import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import cardStyles from '../components/Card.module.css';
import styles from './AdminAssessmentsPage.module.css';
import { Dropdown } from 'react-bootstrap';

const AdminAssessmentsPage = () => {
    const [pageData, setPageData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchAssessments = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/admin/questionnaires?page=${currentPage}&size=10`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch assessments.');
            const data = await response.json();
            setPageData(data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, currentPage]);

    useEffect(() => {
        fetchAssessments();
    }, [fetchAssessments]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this assessment?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/admin/questionnaires/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to delete assessment.');
                toast.success('Assessment deleted successfully.');
                fetchAssessments();
            } catch (err) {
                toast.error(err.message);
            }
        }
    };

    if (loading) return <LoadingSpinner text="Loading assessments..." />;

    return (
        <div>
            <PageHeader
                title="Assessment Management"
                subtitle="Create, edit, and manage all self-assessment questionnaires."
            />
            <div className="text-end mb-4">
                <Link to="/admin/assessments/new">
                    <Button>Create New Assessment</Button>
                </Link>
            </div>
            <Card>
                <div className={`${cardStyles.cardContent} ${styles.tableContainer}`}>
                    <div className="table-responsive">
                        <table className={styles.assessmentTable}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Questions</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageData && pageData.content.length > 0 ? (
                                    pageData.content.map(q => (
                                        <tr key={q.id}>
                                            <td>
                                                <span className={styles.title}>{q.title}</span>
                                            </td>
                                            <td>
                                                <span className={styles.questionCount}>{q.questions.length}</span>
                                            </td>
                                            <td className="text-end">
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${q.id}`}>
                                                        &#8942;
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu align="end">
                                                        <Dropdown.Item as={Link} to={`/admin/assessments/edit/${q.id}`}>Edit</Dropdown.Item>
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item onClick={() => handleDelete(q.id)} className="text-danger">Delete</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3" className="text-center p-5">No assessments found.</td></tr>
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

export default AdminAssessmentsPage;