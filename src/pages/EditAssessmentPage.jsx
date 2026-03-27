import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AssessmentForm from '../components/AssessmentForm';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const EditAssessmentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [questionnaire, setQuestionnaire] = useState(null);
    const [interpretations, setInterpretations] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchFullAssessment = async () => {
                try {
                    const [qRes, iRes] = await Promise.all([
                        fetch(`http://localhost:8080/api/questionnaires/${id}`),
                        fetch(`http://localhost:8080/api/admin/questionnaires/${id}/interpretations`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        })
                    ]);
                    if (!qRes.ok || !iRes.ok) throw new Error('Could not fetch all assessment data.');
                    const qData = await qRes.json();
                    const iData = await iRes.json();
                    setQuestionnaire(qData);
                    setInterpretations(iData);
                } catch (err) {
                    toast.error(err.message);
                    navigate('/admin/assessments');
                } finally {
                    setLoading(false);
                }
            };
            fetchFullAssessment();
        }
    }, [id, token, navigate]);

    if (loading) return <LoadingSpinner text="Loading Assessment for Editing..." />;

    return (
        <div>
            <PageHeader
                title="Edit Assessment"
                subtitle="Modify the details, questions, and scoring for this questionnaire."
            />
            {questionnaire && interpretations ? (
                <AssessmentForm 
                    isEditMode={true} 
                    initialData={questionnaire}
                    initialInterpretations={interpretations}
                />
            ) : (
                <p>Assessment data could not be loaded.</p>
            )}
        </div>
    );
};

export default EditAssessmentPage;