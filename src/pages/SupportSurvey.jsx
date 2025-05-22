import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSurveys, getAnsweredSurveys } from '../api';
import '../styles/SupportSurvey.css';

const SupportSurvey = () => {
  const [surveys, setSurveys] = useState([]);
  const [answeredSurveys, setAnsweredSurveys] = useState(new Set());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [surveysRes, answeredRes] = await Promise.all([
          getAllSurveys(),
          getAnsweredSurveys()
        ]);

        // Create a Set of answered survey IDs for efficient lookup
        const answeredIds = new Set(answeredRes.data.map(survey => survey._id));
        setAnsweredSurveys(answeredIds);

        // Filter out answered surveys
        const availableSurveys = surveysRes.data.filter(survey => !answeredIds.has(survey._id));
        setSurveys(availableSurveys);
      } catch (err) {
        setError('Failed to fetch surveys');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="support-survey-container">
      <div className="main-heading">
        <h1>Support Surveys</h1>
        <p>Explore and respond to surveys created by the community to contribute to research.</p>
      </div>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading surveys...</p>
      ) : surveys.length === 0 ? (
        <div className="no-surveys-message">
          <p>No new surveys available at the moment.</p>
          <p className="sub-text">You have completed all available surveys. Check back later for new ones!</p>
        </div>
      ) : (
        <div className="surveys-list">
          {surveys.map((survey) => (
            <div className="survey-card" key={survey._id}>
              <h3>{survey.title}</h3>
              <p>{survey.description}</p>
              <button
                className="answer-survey-button"
                onClick={() => navigate(`/answer-survey/${survey._id}`)}
              >
                Answer Survey
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportSurvey;