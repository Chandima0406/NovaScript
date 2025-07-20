const mongoose = require('mongoose');
const Project = require('../models/projectModel');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  const { title, description, role } = req.body;

  try {
    if (!req.gfs) {
      return res.status(500).json({ message: 'GridFS not initialized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'PDF file required' });
    }

    const uploadStream = req.gfs.openUploadStream(req.file.originalname);
    uploadStream.write(req.file.buffer);
    uploadStream.end();

    const pdfId = await new Promise((resolve, reject) => {
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.on('error', reject);
    });

    const project = new Project({
      title,
      description,
      author: { 
        name: req.user.full_name, 
        role 
      },
      userId: req.user._id,
      pdfId,
    });

    await project.save();
    res.status(201).json({ message: 'Project published', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all projects with optional filtering and sorting
// @route   GET /api/projects
// @access  Public
const getAllProjects = async (req, res) => {
  try {
    const { 
      query, 
      author, 
      dateFrom, 
      dateTo, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;
    
    const queryObject = {};
    
    // Text search across multiple fields
    if (query) {
      queryObject.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Author filter
    if (author) {
      queryObject['author.name'] = { $regex: author, $options: 'i' };
    }
    
    // Date range filter
    if (dateFrom || dateTo) {
      queryObject.createdAt = {};
      if (dateFrom) {
        queryObject.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        queryObject.createdAt.$lte = new Date(dateTo);
      }
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const projects = await Project.find(queryObject)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    // Get total count for pagination
    const totalProjects = await Project.countDocuments(queryObject);
    
    res.json({
      projects,
      pagination: {
        total: totalProjects,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalProjects / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get user's projects
// @route   GET /api/projects/user
// @access  Private
const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }
    
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  const { title, description, role } = req.body;
  
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    if (req.file) {
      if (!req.gfs) {
        return res.status(500).json({ message: 'GridFS not initialized' });
      }
      
      await req.gfs.delete(project.pdfId);
      
      const uploadStream = req.gfs.openUploadStream(req.file.originalname);
      uploadStream.write(req.file.buffer);
      uploadStream.end();
      
      project.pdfId = await new Promise((resolve, reject) => {
        uploadStream.on('finish', () => resolve(uploadStream.id));
        uploadStream.on('error', reject);
      });
    }
    
    project.title = title || project.title;
    project.description = description || project.description;
    project.author.role = role || project.author.role;
    
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    
    if (req.gfs) {
      await req.gfs.delete(project.pdfId);
    }
    
    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Download PDF
// @route   GET /api/projects/pdf/:id
// @access  Public
const downloadPdf = async (req, res) => {
  try {
    if (!req.gfs) {
      return res.status(500).json({ message: 'GridFS not initialized' });
    }
    
    const downloadStream = req.gfs.openDownloadStream(new mongoose.Types.ObjectId(req.params.id));
    res.set('Content-Type', 'application/pdf');
    downloadStream.pipe(res);
  } catch (err) {
    res.status(404).json({ message: 'PDF not found' });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  downloadPdf
};
