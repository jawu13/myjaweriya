import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import Card from '../components/Card';
import cardStyles from '../components/Card.module.css';
import styles from '../components/AssessmentForm.module.css';

const AssessmentForm = ({ isEditMode = false, initialData, initialInterpretations }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    
    const [formData, setFormData] = useState({ title: '', description: '', questions: [] });
    const [interpretations, setInterpretations] = useState([]);

    useEffect(() => {
        if (isEditMode) {
            setFormData(initialData || { title: '', description: '', questions: [] });
            setInterpretations(initialInterpretations || []);
        }
    }, [isEditMode, initialData, initialInterpretations]);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // --- Question Handlers ---
    const handleQuestionChange = (qIndex, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].text = value;
        setFormData({ ...formData, questions: newQuestions });
    };
    const addQuestion = () => {
        setFormData({ ...formData, questions: [...formData.questions, { text: '', options: [{ text: '', score: 0 }] }] });
    };
    const removeQuestion = (qIndex) => {
        const newQuestions = [...formData.questions];
        newQuestions.splice(qIndex, 1);
        setFormData({ ...formData, questions: newQuestions });
    };

    // --- Option Handlers ---
    const handleOptionChange = (qIndex, oIndex, field, value) => {
        const newQuestions = [...formData.questions];
        const option = newQuestions[qIndex].options[oIndex];
        option[field] = field === 'score' ? (parseInt(value, 10) || 0) : value;
        setFormData({ ...formData, questions: newQuestions });
    };
    const addOption = (qIndex) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].options.push({ text: '', score: 0 });
        setFormData({ ...formData, questions: newQuestions });
    };
    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].options.splice(oIndex, 1);
        setFormData({ ...formData, questions: newQuestions });
    };

    // --- Interpretation Handlers ---
    const handleInterpretationChange = (iIndex, field, value) => {
        const newInterpretations = [...interpretations];
        const interpretation = newInterpretations[iIndex];
        interpretation[field] = (field === 'minScore' || field === 'maxScore') ? (parseInt(value, 10) || 0) : value;
        setInterpretations(newInterpretations);
    };
    const addInterpretation = () => {
        setInterpretations([...interpretations, { minScore: 0, maxScore: 0, interpretationText: '' }]);
    };
    const removeInterpretation = (iIndex) => {
        const newInterpretations = [...interpretations];
        newInterpretations.splice(iIndex, 1);
        setInterpretations(newInterpretations);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditMode ? `http://localhost:8080/api/admin/questionnaires/${id}` : 'http://localhost:8080/api/admin/questionnaires';
        const method = isEditMode ? 'PUT' : 'POST';
        const payload = { questionnaire: formData, interpretations: interpretations };

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`Failed to save assessment.`);
            toast.success(`Assessment saved successfully!`);
            navigate('/admin/assessments');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formSection}>
                <Card>
                    <div className={cardStyles.cardContent}>
                        <h5>Basic Information</h5>
                        <div className="mb-3"><label className="form-label">Title</label><input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} required /></div>
                        <div className="mb-3"><label className="form-label">Description</label><textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleInputChange}></textarea></div>
                    </div>
                </Card>
            </div>

            <div className={styles.formSection}>
                <Card>
                    <div className={cardStyles.cardContent}>
                        <h5>Questions</h5>
                        {formData.questions.map((q, qIndex) => (
                            <div key={qIndex} className={styles.questionBlock}>
                                <div className={styles.questionHeader}>
                                    <h6>Question {qIndex + 1}</h6>
                                    <Button type="button" variant="secondary" onClick={() => removeQuestion(qIndex)}>Remove</Button>
                                </div>
                                <textarea className="form-control mb-3" rows="2" value={q.text} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} placeholder="Question Text" required></textarea>
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className={styles.optionGroup}>
                                        <input type="text" className="form-control" value={opt.text} onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)} placeholder={`Option ${oIndex + 1} Text`} required />
                                        <input type="number" className="form-control" style={{maxWidth: '100px'}} value={opt.score} onChange={(e) => handleOptionChange(qIndex, oIndex, 'score', e.target.value)} placeholder="Score" required />
                                        <button className="btn btn-outline-danger" type="button" onClick={() => removeOption(qIndex, oIndex)}>&times;</button>
                                    </div>
                                ))}
                                <Button type="button" variant="secondary" onClick={() => addOption(qIndex)}>+ Add Option</Button>
                            </div>
                        ))}
                        <Button type="button" onClick={addQuestion}>+ Add Question</Button>
                    </div>
                </Card>
            </div>

            <div className={styles.formSection}>
                <Card>
                    <div className={cardStyles.cardContent}>
                        <h5>Score Interpretations</h5>
                        {interpretations.map((interp, iIndex) => (
                             <div key={iIndex} className={styles.interpretationGroup}>
                                 <input type="number" className="form-control" value={interp.minScore} onChange={(e) => handleInterpretationChange(iIndex, 'minScore', e.target.value)} placeholder="Min Score" />
                                 <input type="number" className="form-control" value={interp.maxScore} onChange={(e) => handleInterpretationChange(iIndex, 'maxScore', e.target.value)} placeholder="Max Score" />
                                 <input type="text" className="form-control" value={interp.interpretationText} onChange={(e) => handleInterpretationChange(iIndex, 'interpretationText', e.target.value)} placeholder="Interpretation Text" />
                                 <button className="btn btn-outline-danger" type="button" onClick={() => removeInterpretation(iIndex)}>&times;</button>
                             </div>
                        ))}
                        <Button type="button" onClick={addInterpretation}>+ Add Interpretation</Button>
                    </div>
                </Card>
            </div>
            
            <Button type="submit" variant="primary" className="mt-2">{isEditMode ? 'Save Changes' : 'Create Assessment'}</Button>
        </form>
    );
};

export default AssessmentForm;