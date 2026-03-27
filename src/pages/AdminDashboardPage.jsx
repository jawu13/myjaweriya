import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import cardStyles from '../components/Card.module.css';
import styles from './AdminDashboardPage.module.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);


const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;
            try {
                const response = await fetch('http://localhost:8080/api/admin/dashboard-stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch dashboard stats.');
                const data = await response.json();
                setStats(data);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    if (loading) return <LoadingSpinner text="Loading dashboard data..." />;
    if (!stats) return <p>Could not load dashboard data.</p>;
    
    const doughnutData = {
        labels: ['General Users', 'Therapists'],
        datasets: [{
            label: 'User Distribution',
            data: [stats.totalUsers - stats.totalTherapists, stats.totalTherapists],
            backgroundColor: ['#2A9D8F', '#E9C46A'], // Primary and Warning colors
            borderColor: [ 'var(--color-surface)' ],
            borderWidth: 2,
        }]
    };
    const last7DaysLabels = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse();

    const barData = {
        labels: last7DaysLabels,
        datasets: [{
            label: 'New Users',
            data: last7DaysLabels.map(label => {
                const found = stats.newUsersLast7Days.find(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === label);
                return found ? found.count : 0;
            }),
            backgroundColor: 'rgba(42, 157, 143, 0.8)',
        }]
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div className="row my-4">
                <div className="col-lg-3 col-md-6 mb-4"><Card><div className={`${cardStyles.cardContent} ${styles.statCard}`}><div className={styles.statIcon}>👥</div><div><div className={styles.statValue}>{stats.totalUsers}</div><div className={styles.statLabel}>Total Users</div></div></div></Card></div>
                <div className="col-lg-3 col-md-6 mb-4"><Card><div className={`${cardStyles.cardContent} ${styles.statCard}`}><div className={styles.statIcon}>🩺</div><div><div className={styles.statValue}>{stats.totalTherapists}</div><div className={styles.statLabel}>Therapists</div></div></div></Card></div>
                <div className="col-lg-3 col-md-6 mb-4"><Card><div className={`${cardStyles.cardContent} ${styles.statCard}`}><div className={styles.statIcon}>📝</div><div><div className={styles.statValue}>{stats.pendingResources}</div><div className={styles.statLabel}><Link to="/admin/resources">Pending Resources</Link></div></div></div></Card></div>
                <div className="col-lg-3 col-md-6 mb-4"><Card><div className={`${cardStyles.cardContent} ${styles.statCard}`}><div className={styles.statIcon}>📨</div><div><div className={styles.statValue}>{stats.pendingTherapistApplications}</div><div className={styles.statLabel}><Link to="/admin/therapists">Pending Applications</Link></div></div></div></Card></div>
            </div>

            <div className="row">
                <div className="col-lg-8 mb-4">
                    <Card>
                        <div className={cardStyles.cardContent}>
                            <h5 className="mb-3">New Users (Last 7 Days)</h5>
                            <Bar data={barData} options={{ responsive: true }} />
                        </div>
                    </Card>
                </div>
                <div className="col-lg-4 mb-4">
                    <Card>
                        <div className={cardStyles.cardContent}>
                            <h5 className="mb-3">User Distribution</h5>
                            <Doughnut data={doughnutData} />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};


export default AdminDashboardPage;