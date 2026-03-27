import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import cardStyles from '../components/Card.module.css';
import styles from './QuestionnairePage.module.css';

const QuestionnairePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [questionnaire, setQuestionnaire] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestionnaire = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/questionnaires/${id}`);
                if (!response.ok) throw new Error('Could not find the questionnaire.');
                const data = await response.json();
                setQuestionnaire(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestionnaire();
    }, [id]);

    const handleAnswerChange = (questionText, answerValue) => {
        setAnswers({ ...answers, [questionText]: parseInt(answerValue, 10) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(answers).length !== questionnaire.questions.length) {
            toast.error("Please answer all questions before submitting.");
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/assessments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ questionnaireId: id, answers: answers }),
            });
            if (!response.ok) {
                throw new Error('Failed to submit assessment.');
            }
            const result = await response.json();
            navigate('/result', { state: { result: result } });
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        }
    };
    
    if (loading) return <LoadingSpinner text="Loading Questionnaire..." />;
    if (error) return <p className="text-center mt-5 text-danger">Error: {error}</p>;

    const answeredQuestions = Object.keys(answers).length;
    const totalQuestions = questionnaire.questions.length;

    return (
       <div className="container mt-5">
            <PageHeader title={questionnaire.title} subtitle={questionnaire.description} />
            <form onSubmit={handleSubmit}>
                <Card>
                    <div className={cardStyles.cardContent} style={{paddingBottom: 0}}>
                        {questionnaire.questions.map((question, index) => (
                            <div key={index} className={styles.questionBlock}>
                                <p className={styles.questionText}>{index + 1}. {question.text}</p>
                                <ul className={styles.optionsContainer}>
                                    {question.options.map((option, optionIndex) => (
                                        <li key={optionIndex}>
                                            {/* We wrap the input and the styled div in a label to make the whole thing clickable */}
                                            <label>
                                                <input
                                                    className={styles.optionInput}
                                                    type="radio"
                                                    name={question.text}
                                                    value={option.score}
                                                    onChange={(e) => handleAnswerChange(question.text, e.target.value)}
                                                    required
                                                />
                                                <div className={styles.optionLabel}>{option.text}</div>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className={styles.submitContainer}>
                        <span className={styles.progressText}>
                            {answeredQuestions} of {totalQuestions} Answered
                        </span>
                        <Button type="submit" variant="primary" disabled={answeredQuestions !== totalQuestions}>
                            Submit & View Results
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default QuestionnairePage;