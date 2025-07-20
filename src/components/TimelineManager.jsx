import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import '../styles/TimelineManager.css';

// Custom Timeline/Gantt chart implementation
const TimelineManager = ({ projectId, projectTitle }) => {
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState([
    { 
      id: 1, 
      title: 'Project Planning', 
      startDate: new Date(2025, 4, 1), 
      endDate: new Date(2025, 4, 15),
      progress: 100,
      dependencies: [],
      color: '#4a6fa5' 
    },
    { 
      id: 2, 
      title: 'Research Phase', 
      startDate: new Date(2025, 4, 10), 
      endDate: new Date(2025, 5, 20),
      progress: 65,
      dependencies: [1],
      color: '#6d8fbc' 
    },
    { 
      id: 3, 
      title: 'Data Collection', 
      startDate: new Date(2025, 5, 1), 
      endDate: new Date(2025, 6, 15),
      progress: 30,
      dependencies: [2],
      color: '#90aed2' 
    },
    { 
      id: 4, 
      title: 'Analysis Phase', 
      startDate: new Date(2025, 6, 10), 
      endDate: new Date(2025, 7, 20),
      progress: 0,
      dependencies: [3],
      color: '#b2cee9' 
    },
    { 
      id: 5, 
      title: 'Final Report', 
      startDate: new Date(2025, 7, 15), 
      endDate: new Date(2025, 8, 10),
      progress: 0,
      dependencies: [4],
      color: '#d5eeff' 
    }
  ]);

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    startDate: '',
    endDate: '',
    dependencies: []
  });

  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Function to calculate the timeline scale
  const getTimelineData = () => {
    if (!milestones || milestones.length === 0) return null;

    // Find the earliest start date and latest end date
    const startDates = milestones.map(m => m.startDate.getTime());
    const endDates = milestones.map(m => m.endDate.getTime());
    
    const earliestDate = new Date(Math.min(...startDates));
    const latestDate = new Date(Math.max(...endDates));
    
    // Create a month scale for the timeline
    const months = [];
    const currentDate = new Date(earliestDate);
    currentDate.setDate(1); // Start from the first day of the month
    
    while (currentDate <= latestDate) {
      months.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // Create timeline data
    const labels = months.map(date => `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`);
    
    // Create dataset for each milestone
    const datasets = milestones.map((milestone, index) => {
      const data = Array(months.length).fill(0);
      
      // Find the start and end month indices
      const startIdx = months.findIndex(m => 
        m.getMonth() === milestone.startDate.getMonth() && 
        m.getFullYear() === milestone.startDate.getFullYear()
      );
      
      const endIdx = months.findIndex(m => 
        m.getMonth() === milestone.endDate.getMonth() && 
        m.getFullYear() === milestone.endDate.getFullYear()
      );
      
      // Fill in the data for the duration of the milestone
      for (let i = startIdx; i <= endIdx; i++) {
        // Calculate how much of the milestone falls in this month
        if (i === startIdx && i === endIdx) {
          // Both start and end in same month
          const daysInMonth = new Date(milestone.endDate.getFullYear(), milestone.endDate.getMonth() + 1, 0).getDate();
          const portion = (milestone.endDate.getDate() - milestone.startDate.getDate() + 1) / daysInMonth;
          data[i] = portion;
        } else if (i === startIdx) {
          // First month
          const daysInMonth = new Date(milestone.startDate.getFullYear(), milestone.startDate.getMonth() + 1, 0).getDate();
          const portion = (daysInMonth - milestone.startDate.getDate() + 1) / daysInMonth;
          data[i] = portion;
        } else if (i === endIdx) {
          // Last month
          const daysInMonth = new Date(milestone.endDate.getFullYear(), milestone.endDate.getMonth() + 1, 0).getDate();
          const portion = milestone.endDate.getDate() / daysInMonth;
          data[i] = portion;
        } else {
          // Full month
          data[i] = 1;
        }
      }
      
      return {
        label: milestone.title,
        data: data,
        backgroundColor: milestone.color,
        barPercentage: 0.8,
        categoryPercentage: 0.9,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 4
      };
    });
    
    return {
      labels,
      datasets
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMilestone(prev => ({ ...prev, [name]: value }));
  };

  const handleDependencyChange = (e) => {
    const options = e.target.options;
    const values = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(parseInt(options[i].value));
      }
    }
    setNewMilestone(prev => ({ ...prev, dependencies: values }));
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();
    
    // Validate input
    if (!newMilestone.title || !newMilestone.startDate || !newMilestone.endDate) {
      setError('Please fill in all required fields');
      return;
    }
    
    const startDate = new Date(newMilestone.startDate);
    const endDate = new Date(newMilestone.endDate);
    
    if (endDate < startDate) {
      setError('End date cannot be before start date');
      return;
    }
    
    // Create new milestone
    const newId = milestones.length > 0 ? Math.max(...milestones.map(m => m.id)) + 1 : 1;
    const milestone = {
      id: newId,
      title: newMilestone.title,
      startDate: startDate,
      endDate: endDate,
      progress: 0,
      dependencies: newMilestone.dependencies,
      color: getRandomColor()
    };
    
    setMilestones([...milestones, milestone]);
    setNewMilestone({
      title: '',
      startDate: '',
      endDate: '',
      dependencies: []
    });
    setShowAddForm(false);
    setError('');
  };

  const handleUpdateProgress = (id, progress) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, progress: parseInt(progress) } : m
    ));
  };

  const handleDeleteMilestone = (id) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;
    
    // Check if any other milestone depends on this one
    const dependentMilestones = milestones.filter(m => m.dependencies.includes(id));
    if (dependentMilestones.length > 0) {
      setError(`Cannot delete: ${dependentMilestones.map(m => m.title).join(', ')} depend(s) on this milestone`);
      return;
    }
    
    setMilestones(milestones.filter(m => m.id !== id));
  };

  // Helper function to get a random color
  const getRandomColor = () => {
    const colors = ['#4a6fa5', '#6d8fbc', '#90aed2', '#b2cee9', '#d5eeff', '#ffd166', '#06d6a0', '#118ab2'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="timeline-manager">
      <h2>Project Timeline for {projectTitle}</h2>
      
      <div className="timeline-actions">
        <button 
          className="btn-primary add-milestone"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Milestone'}
        </button>
      </div>
      
      {showAddForm && (
        <div className="add-milestone-form">
          <h3>Add New Milestone</h3>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleAddMilestone}>
            <div className="form-group">
              <label htmlFor="title">Milestone Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newMilestone.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={newMilestone.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={newMilestone.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="dependencies">Dependencies (Ctrl+Click for multiple)</label>
              <select
                id="dependencies"
                name="dependencies"
                multiple
                value={newMilestone.dependencies}
                onChange={handleDependencyChange}
              >
                {milestones.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary">Add Milestone</button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="gantt-chart-container">
        <h3>Timeline Overview</h3>
        <div className="chart-container">
          {getTimelineData() && (
            <Bar
              data={getTimelineData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                  x: {
                    stacked: true,
                    title: {
                      display: true,
                      text: 'Timeline'
                    }
                  },
                  y: {
                    stacked: true,
                    title: {
                      display: true,
                      text: 'Milestones'
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const milestone = milestones[context.dataIndex];
                        return `${milestone.title}: ${formatDate(milestone.startDate)} - ${formatDate(milestone.endDate)}`;
                      }
                    }
                  }
                }
              }}
            />
          )}
        </div>
      </div>
      
      <div className="milestones-list">
        <h3>Milestones</h3>
        <div className="milestones-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map(milestone => (
                <tr key={milestone.id} style={{ borderLeft: `4px solid ${milestone.color}` }}>
                  <td>{milestone.title}</td>
                  <td>{formatDate(milestone.startDate)}</td>
                  <td>{formatDate(milestone.endDate)}</td>
                  <td>
                    <div className="progress-container">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={milestone.progress}
                        onChange={(e) => handleUpdateProgress(milestone.id, e.target.value)}
                      />
                      <span className="progress-value">{milestone.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <button 
                      className="btn-icon delete"
                      onClick={() => handleDeleteMilestone(milestone.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="project-dependencies">
        <h3>Dependencies Visualization</h3>
        <div className="dependencies-diagram">
          {milestones.map(milestone => (
            <div key={milestone.id} className="dependency-node">
              <div className="node-content" style={{ backgroundColor: milestone.color }}>
                <h4>{milestone.title}</h4>
                <p>{formatDate(milestone.startDate)} - {formatDate(milestone.endDate)}</p>
                <p>Progress: {milestone.progress}%</p>
              </div>
              
              {milestone.dependencies.map(depId => {
                const dependsOn = milestones.find(m => m.id === depId);
                if (dependsOn) {
                  return (
                    <div key={`${milestone.id}-${depId}`} className="dependency-arrow">
                      Depends on: {dependsOn.title}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineManager;
