import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import cardStyles from '../components/Card.module.css';

const AssessmentsPage = () => {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestionnaires = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/questionnaires');
                if (!response.ok) throw new Error('Failed to fetch questionnaires.');
                const data = await response.json();
                setQuestionnaires(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestionnaires();
    }, []);

    if (loading) return <LoadingSpinner text="Loading assessments..." />;
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

    return (
        <div className="container mt-5">
            <PageHeader
                title="Self-Assessments"
                subtitle="Gain insight into your mental well-being with these confidential and private assessments. Your results are for you alone."
            />
            <div className="row">
                {questionnaires.length > 0 ? questionnaires.map(q => (
                    <div className="col-md-6 col-lg-4 mb-4" key={q.id}>
                        <Card className="h-100">
                            <div className={`${cardStyles.cardContent} d-flex flex-column h-100`}>
                                <h5 className="card-title">{q.title}</h5>
                                <p className="card-text flex-grow-1 text-muted small">
                                    A {q.questions.length}-question assessment.
                                </p>
                                <Link to={`/assessment/${q.id}`} className="mt-auto">
                                    <Button variant="primary" style={{width: '100%'}}>Start Assessment</Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                )) : <p>No assessments are available at this time.</p>}
            </div>
        </div>
    );
};

export default AssessmentsPage;