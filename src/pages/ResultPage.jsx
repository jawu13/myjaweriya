import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import cardStyles from '../components/Card.module.css';
import styles from './ResultPage.module.css';

const ResultPage = () => {
    const location = useLocation();
    const result = location.state?.result;

    if (!result) {
        return (
            <div className="container mt-5 text-center">
                <PageHeader title="Error" subtitle="No assessment result found. It's possible you navigated to this page directly." />
                <Link to="/assessments">
                    <Button variant="primary">Back to Assessments</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <PageHeader
                title="Your Assessment Result"
                subtitle={result.questionnaireTitle}
            />
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <Card>
                        <div className={`${cardStyles.cardContent} ${styles.resultContent}`}>
                            <div className={styles.scoreSection}>
                                <div className={styles.scoreLabel}>Your Score</div>
                                <div className={styles.scoreValue}>{result.score}</div>
                            </div>
                            <div className={styles.interpretationSection}>
                                <h4>Interpretation</h4>
                                <p>{result.feedback}</p>
                            </div>
                            <div className={styles.disclaimer}>
                                <p className="mb-0">
                                    Remember, this is not a diagnosis. It's a tool to help you understand your well-being and a starting point for a conversation with a professional.
                                </p>
                            </div>
                        </div>
                    </Card>
                    <div className="text-center mt-4">
                        <Link to="/assessments">
                            <Button variant="secondary">Take Another Assessment</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPage; 