import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Card from '../components/Card';
import cardStyles from '../components/Card.module.css';
import styles from './TherapistServicesPage.module.css';
import { Dropdown } from 'react-bootstrap';

const TherapistServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchServices = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/therapists/services/my-services', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch your services.');
            const data = await response.json();
            setServices(data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleDelete = async (serviceId) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/therapists/services/${serviceId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to delete service.');
                toast.success('Service deleted successfully.');
                fetchServices();
            } catch (err) {
                toast.error(err.message);
            }
        }
    };

    if (loading) return <LoadingSpinner text="Loading your services..." />;

    return (
        <div className="container mt-5">
            <PageHeader
                title="Manage Your Services"
                subtitle="Add, edit, or remove the services you offer to clients."
            />
            <div className="text-end mb-4">
                <Link to="/therapist/services/new">
                    <Button>Add New Service</Button>
                </Link>
            </div>
            <Card>
                <div className={`${cardStyles.cardContent} ${styles.tableContainer}`}>
                    <div className="table-responsive">
                        <table className={styles.serviceTable}>
                            <thead>
                                <tr>
                                    <th>Service Name</th>
                                    <th>Duration</th>
                                    <th>Price</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.length > 0 ? (
                                    services.map(service => (
                                        <tr key={service.id}>
                                            <td>
                                                <div className={styles.serviceInfo}>
                                                    <span className={styles.name}>{service.name}</span>
                                                    <span className={styles.description}>{service.description}</span>
                                                </div>
                                            </td>
                                            <td>{service.durationInMinutes} min</td>
                                            <td>${service.price.toFixed(2)}</td>
                                            <td className="text-end">
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${service.id}`}>
                                                        &#8942;
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu align="end">
                                                        <Dropdown.Item as={Link} to={`/therapist/services/edit/${service.id}`}>Edit</Dropdown.Item>
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item onClick={() => handleDelete(service.id)} className="text-danger">Delete</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="text-center p-5">You have not created any services yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TherapistServicesPage;