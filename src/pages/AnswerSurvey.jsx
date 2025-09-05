import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSurveyById, submitSurveyResponse } from '../api';
import '../styles/AnswerSurvey.css';

const AnswerSurvey = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await getSurveyById(surveyId);
        setSurvey(response.data);
        setLoading(false);      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch survey');
        }
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [surveyId, navigate]);

  const handleResponseChange = (qIndex, value) => {
    setResponses((prev) => ({ ...prev, [qIndex]: value }));
  };

  const handleCheckboxChange = (qIndex, option) => {
    setResponses((prev) => {
      const current = prev[qIndex] || [];
      if (current.includes(option)) {
        return { ...prev, [qIndex]: current.filter((opt) => opt !== option) };
      }
      return { ...prev, [qIndex]: [...current, option] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');

    try {
      await submitSurveyResponse(surveyId, { responses });
      navigate('/support-survey', { state: { message: 'Response submitted successfully!' } });    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to submit response');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="answer-survey-page">
        <main className="answer-survey-main">
          <p>Loading survey...</p>
        </main>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="answer-survey-page">
        <main className="answer-survey-main">
          <p>{error || 'Survey not found'}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="answer-survey-container">
      <main className="answer-survey-main">
        <h1 className="answer-survey-title">{survey.title}</h1>
        <p className="answer-survey-description">{survey.description}</p>
        {error && <p className="error-message">{error}</p>}
        <form className="answer-survey-form" onSubmit={handleSubmit}>
          {survey.questions.map((question, qIndex) => (
            <div className="question-group" key={qIndex}>
              <label className="question-label">{`${qIndex + 1}. ${question.text}`}</label>
              {question.type === 'text' && (
                <textarea
                  className="form-input textarea"
                  value={responses[qIndex] || ''}
                  onChange={(e) => handleResponseChange(qIndex, e.target.value)}
                  required
                  disabled={submitting}
                />
              )}              {question.type === 'multiple-choice' && (
                <div className="options-group">
                  {question.options.map((option, oIndex) => (
                    <label key={oIndex} className="option-label">
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={option}
                        checked={responses[qIndex] === option}
                        onChange={(e) => handleResponseChange(qIndex, e.target.value)}
                        required
                        disabled={submitting}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
              {question.type === 'checkbox' && (
                <div className="options-group">
                  {question.options.map((option, oIndex) => (
                    <label key={oIndex} className="option-label">
                      <input
                        type="checkbox"
                        value={option}
                        checked={(responses[qIndex] || []).includes(option)}
                        onChange={() => handleCheckboxChange(qIndex, option)}
                        disabled={submitting}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="submit-response-button"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Response'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AnswerSurvey;