import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import cardStyles from '../components/Card.module.css';

const TherapistsPage = () => {
    const [therapists, setTherapists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTherapists = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/therapists');
                if (!response.ok) throw new Error('Failed to fetch therapists.');
                const data = await response.json();
                setTherapists(data);
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTherapists();
    }, []);

    if (loading) return <LoadingSpinner text="Finding therapists..." />;
    if (error) return <p className="text-center mt-5 text-danger">Error: {error}</p>;

    return (
        <div className="container mt-5">
            <PageHeader
                title="Our Professionals"
                subtitle="Find a therapist who specializes in the areas where you need support."
            />
            <div className="row">
                {therapists.length > 0 ? therapists.map(therapist => (
                    <div className="col-md-6 col-lg-4 mb-4" key={therapist.profileId}>
                        <Card className="h-100">
                            <div className={`${cardStyles.cardContent} d-flex flex-column h-100`}>
                                <h5 className="card-title text-center">{therapist.name}, {therapist.credentials}</h5>
                                <div className="text-center my-2">
                                    {therapist.specializations.slice(0, 3).map(spec => (
                                        <span key={spec} className="badge rounded-pill bg-light text-dark me-1">{spec}</span>
                                    ))}
                                </div>
                                <p className="card-text flex-grow-1">{therapist.bio.substring(0, 100)}...</p>
                                <Link to={`/therapist/${therapist.profileId}`} className="btn btn-outline-primary mt-auto" style={{borderColor: 'var(--color-primary)', color: 'var(--color-primary)'}}>
                                    View Profile
                                </Link>
                            </div>
                        </Card>
                    </div>
                )) : <p className="text-center">No approved therapists available at this time.</p>}
            </div>
        </div>
    );
};

export default TherapistsPage;