import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSurvey, updateSurvey, getSurveyById } from '../api';
import '../styles/CreateSurvey.css';

const CreateSurvey = () => {
  const { surveyId } = useParams();  const [survey, setSurvey] = useState({
    title: '',
    description: '',
    creator: { name: '', role: '' },
    questions: [{ text: '', type: 'text', options: [] }],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurvey = async () => {
      if (!surveyId) {
        setInitialLoading(false);
        return;
      }
      try {
        const response = await getSurveyById(surveyId);
        const surveyData = response.data;
        setSurvey({
          title: surveyData.title,
          description: surveyData.description,
          creator: surveyData.creator, // Changed from role to creator
          questions: surveyData.questions,        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch survey details');
        navigate('/dashboard');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchSurvey();
  }, [surveyId, navigate]);

  const handleSurveyChange = (e) => {
    const { name, value } = e.target;
    if (name === 'creatorRole') {
      setSurvey({ ...survey, creator: { ...survey.creator, role: value } });
    } else {
      setSurvey({ ...survey, [name]: value });
    }
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...survey.questions];
    const { name, value } = e.target;
    newQuestions[index][name] = value;
    if (name === 'type' && value === 'text') {
      newQuestions[index].options = [];
    }
    setSurvey({ ...survey, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...survey.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setSurvey({ ...survey, questions: newQuestions });
  };

  const addOption = (qIndex) => {
    const newQuestions = [...survey.questions];
    newQuestions[qIndex].options.push('');
    setSurvey({ ...survey, questions: newQuestions });
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...survey.questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
    setSurvey({ ...survey, questions: newQuestions });
  };

  const addQuestion = () => {
    if (survey.questions.length >= 50) {
      setError('Maximum 50 questions allowed');
      return;
    }
    setSurvey({
      ...survey,
      questions: [...survey.questions, { text: '', type: 'text', options: [] }],
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = survey.questions.filter((_, i) => i !== index);
    setSurvey({ ...survey, questions: newQuestions });
  };

  const validateOptions = () => {
    for (const [index, question] of survey.questions.entries()) {
      if (['multiple-choice', 'checkbox'].includes(question.type)) {
        const validOptions = question.options.filter(opt => opt.trim() !== '');
        if (validOptions.length < 2) {
          return `Question ${index + 1} must have at least 2 non-empty options`;
        }
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    const optionError = validateOptions();
    if (optionError) {
      setError(optionError);
      setLoading(false);
      return;
    }

    try {
      if (surveyId) {
        await updateSurvey(surveyId, survey);
      } else {
        await createSurvey(survey);
      }
      navigate('/researcher-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save survey');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="create-survey-page">
        <main className="create-survey-main">
          <p>Loading survey details...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="create-survey-page">
      <main className="create-survey-main">
        <h1 className="create-survey-title">
          {surveyId ? 'Edit Survey' : 'Create a Survey'}
        </h1>
        {error && <p className="error-message" id="error-message">{error}</p>}
        <form
          className="create-survey-form"
          onSubmit={handleSubmit}
          aria-describedby={error ? 'error-message' : undefined}
        >
          <div className="form-group">
            <label htmlFor="title">Survey Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter Your Survey Title"
              className="form-input"
              value={survey.title}
              onChange={handleSurveyChange}
              required
              disabled={loading}
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Survey Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Write Your Survey Description Here..."
              className="form-input textarea"
              value={survey.description}
              onChange={handleSurveyChange}
              required
              disabled={loading}
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label htmlFor="creatorRole">Your Current Position</label>
            <input
              type="text"
              id="creatorRole"
              name="creatorRole"
              placeholder="Enter Your Current Position (e.g., University Student)"
              className="form-input"
              value={survey.creator.role}
              onChange={handleSurveyChange}
              required
              disabled={loading}
              aria-required="true"
            />
          </div>

          {survey.questions.map((question, qIndex) => (
            <div className="form-group question-group" key={qIndex}>
              <label htmlFor={`question-text-${qIndex}`}>Question {qIndex + 1}</label>
              <input
                type="text"
                id={`question-text-${qIndex}`}
                name="text"
                placeholder="Enter Question Text"
                className="form-input"
                value={question.text}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                required
                disabled={loading}
                aria-required="true"
              />
              <select
                id={`question-type-${qIndex}`}
                name="type"
                className="form-input"
                value={question.type}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                disabled={loading}
                aria-label={`Question ${qIndex + 1} type`}
              >
                <option value="text">Text</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="checkbox">Checkbox</option>
              </select>

              {['multiple-choice', 'checkbox'].includes(question.type) && (
                <div className="options-group">
                  {question.options.map((option, oIndex) => (
                    <div className="option-row" key={oIndex}>
                      <input
                        type="text"
                        id={`option-${qIndex}-${oIndex}`}
                        placeholder={`Option ${oIndex + 1}`}
                        className="form-input"
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        required
                        disabled={loading}
                        aria-required="true"
                      />
                      <button
                        type="button"
                        className="remove-option-button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        disabled={loading}
                        aria-label={`Remove option ${oIndex + 1} for question ${qIndex + 1}`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {question.options.length < 10 && (
                    <button
                      type="button"
                      className="add-option-button"
                      onClick={() => addOption(qIndex)}
                      disabled={loading}
                      aria-label={`Add option for question ${qIndex + 1}`}
                    >
                      Add Option
                    </button>
                  )}
                </div>
              )}

              {survey.questions.length > 1 && (
                <button
                  type="button"
                  className="remove-question-button"
                  onClick={() => removeQuestion(qIndex)}
                  disabled={loading}
                  aria-label={`Remove question ${qIndex + 1}`}
                >
                  Remove Question
                </button>
              )}
            </div>
          ))}

          {survey.questions.length < 50 && (
            <button
              type="button"
              className="add-question-button"
              onClick={addQuestion}
              disabled={loading}
              aria-label="Add new question"
            >
              Add Question
            </button>
          )}
          <button
            type="submit"
            className="create-survey-button"
            disabled={loading}
            aria-label={surveyId ? "Update survey" : "Create survey"}
          >
            {loading ? 'Saving...' : (surveyId ? 'Update Survey' : 'Create Survey')}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateSurvey;