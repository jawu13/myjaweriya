import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import cardStyles from '../components/Card.module.css';
import styles from './ProfilePage.module.css';
import { Tabs, Tab } from 'react-bootstrap';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, user, isTherapist } = useAuth();

    const fetchData = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [profileRes, appointmentsRes] = await Promise.all([
                fetch('http://localhost:8080/api/profile', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:8080/api/appointments/my-appointments', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            if (!profileRes.ok) throw new Error('Failed to fetch profile data.');
            if (!appointmentsRes.ok) throw new Error('Failed to fetch appointments.');
            
            const profile = await profileRes.json();
            const appointmentsData = await appointmentsRes.json();
            
            setProfileData(profile);
            setAppointments(appointmentsData);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <LoadingSpinner text="Loading your dashboard..." />;
    if (!profileData) return <p className="text-center mt-5">Could not load your profile.</p>;

    return (
        <div className="container mt-5">
            <PageHeader
                title="My Dashboard"
                subtitle="Manage your profile, view appointments, and access your tools."
            />
            <div className={styles.profileGrid}>
                {/* --- LEFT COLUMN: PROFILE CARD --- */}
                <div className={styles.profileColumn}>
                    <Card className={styles.profileCard}>
                        <div className={`${cardStyles.cardContent} ${styles.profileCardContent}`}>
                            <div className={styles.avatarContainer}>
                                <Avatar name={profileData.username} userId={user.id} />
                            </div>
                            <h4 className={styles.username}>{profileData.username}</h4>
                            <p className={styles.email}>{profileData.email}</p>
                            {/* We will build out the edit functionality in a later step if desired */}
                        </div>
                    </Card>

                    {isTherapist() ? (
                         <Card className="mt-4">
                            <div className={cardStyles.cardContent}>
                                <h5>Therapist Tools</h5>
                                <div className="d-grid gap-2">
                                    <Link to="/therapist/my-services" className="btn btn-outline-info">Manage My Services</Link>
                                    <Link to="/therapist/my-availability" className="btn btn-outline-info">Manage My Availability</Link>
                                    <Link to="/therapist/my-resources" className="btn btn-outline-info">My Content</Link>
                                </div>
                            </div>
                        </Card>
                    ) : (
                         <Card className="mt-4">
                            <div className={cardStyles.cardContent}>
                                <h5>Become a Therapist</h5>
                                <p className="text-muted small">Interested in providing services on our platform?</p>
                                <Link to="/apply-therapist"><Button variant="secondary">Apply Now</Button></Link>
                            </div>
                        </Card>
                    )}
                </div>

                {/* --- RIGHT COLUMN: TABBED CONTENT --- */}
                <div className={styles.contentColumn}>
                    <Tabs defaultActiveKey="appointments" id="profile-tabs" className="mb-3" fill>
                        <Tab eventKey="appointments" title="My Appointments">
                            <Card>
                                <div className={cardStyles.cardContent}>
                                    <div className="table-responsive">
                                        <table className={styles.appointmentTable}>
                                            <thead>
                                                <tr>
                                                    <th>{isTherapist() ? 'Client' : 'Therapist'}</th>
                                                    <th>Service</th>
                                                    <th>Date & Time</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {appointments.length > 0 ? (
                                                    appointments.map(appt => (
                                                        <tr key={appt.id}>
                                                            <td>{isTherapist() ? appt.clientName : appt.therapistName}</td>
                                                            <td>{appt.serviceName}</td>
                                                            <td>{new Date(appt.appointmentTime).toLocaleString()}</td>
                                                            <td><span className="badge bg-primary">{appt.status}</span></td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td colSpan="4" className="text-center p-5">No appointments found.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Card>
                        </Tab>
                        <Tab eventKey="security" title="Security">
                            <Card>
                                <div className={cardStyles.cardContent}>
                                    <ChangePasswordForm />
                                </div>
                            </Card>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;