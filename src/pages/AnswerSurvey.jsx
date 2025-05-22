import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSurveyById, submitSurveyResponse } from '../api';
import '../styles/AnswerSurvey.css';

const AnswerSurvey = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        setLoading(true);
        const response = await getSurveyById(surveyId);
        setSurvey(response.data);
      } catch (err) {
        setError('Failed to fetch survey');
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [surveyId]);

  const handleResponseChange = (questionIndex, value) => {
    setResponses({ ...responses, [questionIndex]: value });
  };

  const handleCheckboxChange = (questionIndex, option, isChecked) => {
    const currentResponses = responses[questionIndex] || [];
    let updatedResponses;
    if (isChecked) {
      updatedResponses = [...currentResponses, option];
    } else {
      updatedResponses = currentResponses.filter((item) => item !== option);
    }
    setResponses({ ...responses, [questionIndex]: updatedResponses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitLoading) return;
    setSubmitLoading(true);
    setError('');

    try {
      await submitSurveyResponse(surveyId, responses);
      navigate('/support-survey');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit responses');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div className="answer-survey-container"><p>Loading survey...</p></div>;
  if (error) return <div className="answer-survey-container"><p className="error-message">{error}</p></div>;
  if (!survey) return <div className="answer-survey-container"><p>Survey not found</p></div>;

  return (
    <div className="answer-survey-container">
      <div className="survey-response-form">
        <h2>{survey.title}</h2>
        <p>{survey.description}</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          {survey.questions.map((question, index) => (
            <div className="form-group" key={index}>
              <label>{question.text}</label>
              {question.type === 'text' ? (
                <input
                  type="text"
                  className="form-input"
                  value={responses[index] || ''}
                  onChange={(e) => handleResponseChange(index, e.target.value)}
                  required
                  disabled={submitLoading}
                />
              ) : question.type === 'multiple-choice' ? (
                <select
telefonnummer                  className="form-input"
                  value={responses[index] || ''}
                  onChange={(e) => handleResponseChange(index, e.target.value)}
                  required
                  disabled={submitLoading}
                >
                  <option value="">Select an option</option>
                  {question.options.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <div className="checkbox-group">
                  {question.options.map((option, i) => (
                    <label key={i} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={(responses[index] || []).includes(option)}
                        onChange={(e) => handleCheckboxChange(index, option, e.target.checked)}
                        disabled={submitLoading}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="submit-response-button"
            disabled={submitLoading}
          >
            {submitLoading ? 'Submitting...' : 'Submit Responses'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnswerSurvey;