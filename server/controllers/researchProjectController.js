const ResearchProject = require('../models/researchProjectModel');
const mongoose = require('mongoose');

// Helper function to calculate research phase timeline based on actual dates
const calculateResearchPhaseTimeline = (startDate, endDate) => {
  // Calculate total duration in days
  const totalDurationMs = endDate.getTime() - startDate.getTime();
  const totalDays = Math.ceil(totalDurationMs / (1000 * 60 * 60 * 24));
  
  // Default phase proportions (based on the original 140 days)
  // Planning: 14/140 = 10%, Research: 30/140 = 21.4%, Data Collection: 45/140 = 32.1%
  // Analysis: 30/140 = 21.4%, Final Report: 21/140 = 15%
  const phaseProportions = {
    projectPlanning: 0.10,    // 10%
    researchPhase: 0.214,     // 21.4%
    dataCollection: 0.321,    // 32.1%
    analysisPhase: 0.214,     // 21.4%
    finalReport: 0.151        // 15.1%
  };
  
  // Calculate phase durations based on proportions
  const phases = {
    projectPlanning: {
      title: 'Project Planning',
      duration: Math.max(1, Math.round(totalDays * phaseProportions.projectPlanning)),
      saved: false
    },
    researchPhase: {
      title: 'Research Phase',
      duration: Math.max(1, Math.round(totalDays * phaseProportions.researchPhase)),
      saved: false
    },
    dataCollection: {
      title: 'Data Collection',
      duration: Math.max(1, Math.round(totalDays * phaseProportions.dataCollection)),
      saved: false
    },
    analysisPhase: {
      title: 'Analysis Phase',
      duration: Math.max(1, Math.round(totalDays * phaseProportions.analysisPhase)),
      saved: false
    },
    finalReport: {
      title: 'Final Report',
      duration: Math.max(1, Math.round(totalDays * phaseProportions.finalReport)),
      saved: false
    }
  };
  
  // Adjust durations to match exact total (handle rounding differences)
  const calculatedTotal = Object.values(phases).reduce((sum, phase) => sum + phase.duration, 0);
  if (calculatedTotal !== totalDays) {
    const difference = totalDays - calculatedTotal;
    // Add/subtract the difference to the largest phase (data collection)
    phases.dataCollection.duration += difference;
    phases.dataCollection.duration = Math.max(1, phases.dataCollection.duration);
  }
  
  return {
    phases,
    totalDuration: totalDays,
    startDate,
    endDate
  };
};

// Create a new research project
const createResearchProject = async (req, res) => {
  try {    const {
      title,
      description,
      researchField,
      methodology,
      expectedDuration,
      objectives,
      keywords,
      collaborators,
      startDate,
      endDate,
      status,
      estimatedBudget
    } = req.body;

    // Calculate timeline phases if both start and end dates are provided
    let timeline = {};
    if (startDate && endDate) {
      timeline = calculateResearchPhaseTimeline(new Date(startDate), new Date(endDate));
    }

    const researchProject = new ResearchProject({
      title,
      description,
      researchField,
      methodology,
      expectedDuration,
      objectives: objectives || [],
      keywords: keywords || [],
      collaborators: collaborators || [],
      startDate,
      endDate,      status: status || 'planning',
      estimatedBudget: estimatedBudget || 0,
      timeline,
      userId: req.user._id
    });

    await researchProject.save();
    res.status(201).json(researchProject);
  } catch (error) {
    console.error('Error creating research project:', error);
    res.status(500).json({ message: 'Failed to create research project' });
  }
};

// Get all research projects for the authenticated user
const getUserResearchProjects = async (req, res) => {
  try {
    const projects = await ResearchProject.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching user research projects:', error);
    res.status(500).json({ message: 'Failed to fetch research projects' });
  }
};

// Get a specific research project by ID
const getResearchProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;    const project = await ResearchProject.findOne({ 
      _id: projectId, 
      userId: req.user._id 
    });

    if (!project) {
      return res.status(404).json({ message: 'Research project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching research project:', error);
    res.status(500).json({ message: 'Failed to fetch research project' });
  }
};

// Update a research project
const updateResearchProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const updates = req.body;    const project = await ResearchProject.findOneAndUpdate(
      { _id: projectId, userId: req.user._id },
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Research project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error updating research project:', error);
    res.status(500).json({ message: 'Failed to update research project' });
  }
};

// Delete a research project
const deleteResearchProject = async (req, res) => {
  try {
    const { projectId } = req.params;
      const project = await ResearchProject.findOneAndDelete({ 
      _id: projectId, 
      userId: req.user._id 
    });

    if (!project) {
      return res.status(404).json({ message: 'Research project not found' });
    }

    res.json({ message: 'Research project deleted successfully' });
  } catch (error) {
    console.error('Error deleting research project:', error);
    res.status(500).json({ message: 'Failed to delete research project' });
  }
};

// Get research project statistics for the user
const getResearchProjectStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await ResearchProject.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },{
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalProjects = await ResearchProject.countDocuments({ userId });
    
    res.json({
      totalProjects,
      stats,
      summary: {
        planning: stats.find(s => s._id === 'planning')?.count || 0,
        active: stats.find(s => s._id === 'active')?.count || 0,
        onHold: stats.find(s => s._id === 'on-hold')?.count || 0,
        completed: stats.find(s => s._id === 'completed')?.count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching research project stats:', error);
    res.status(500).json({ message: 'Failed to fetch research project statistics' });
  }
};

// Update research project timeline
const updateResearchProjectTimeline = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { timeline } = req.body;

    if (!timeline) {
      return res.status(400).json({ message: 'Timeline data is required' });
    }    // Ensure the project exists and belongs to the user
    const researchProject = await ResearchProject.findOne({ 
      _id: projectId,
      userId: req.user._id
    });    if (!researchProject) {
      return res.status(404).json({ message: 'Research project not found' });
    }
    
    // Update the project timeline
    researchProject.timeline = timeline;
    
    // Update the project's expected end date based on timeline
    if (timeline.endDate) {
      researchProject.endDate = timeline.endDate;
    }
    
    // Ensure all phase data is properly saved
    if (timeline.phases) {
      Object.entries(timeline.phases).forEach(([key, phase]) => {
        if (!phase.saved) {
          researchProject.timeline.phases[key].saved = true;
        }
      });
    }
    
    // Save the updated project
    await researchProject.save();
    res.status(200).json(researchProject);
  } catch (error) {
    console.error('Error updating research project timeline:', error);
    res.status(500).json({ message: 'Failed to update research project timeline' });
  }
};

module.exports = {
  createResearchProject,
  getUserResearchProjects,
  getResearchProjectById,
  updateResearchProject,
  deleteResearchProject,
  getResearchProjectStats,
  updateResearchProjectTimeline
};
