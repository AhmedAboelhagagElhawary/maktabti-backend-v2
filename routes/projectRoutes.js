const express = require('express');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStatus
} = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/fileUpload');

const router = express.Router();

// GET routes (public)
router.get('/', getAllProjects);
router.get('/:id', protect, getProjectById);

// POST route - create project WITH files upload
router.post('/', protect, upload.fields([
  { name: 'documentationPdf', maxCount: 1 },
  { name: 'projectBanner', maxCount: 1 }
]), createProject);

// PUT route - update project
router.put('/:id', protect, upload.fields([
  { name: 'documentationPdf', maxCount: 1 },
  { name: 'projectBanner', maxCount: 1 }
]), updateProject);

// DELETE route
router.delete('/:id', protect, deleteProject);

// PATCH - Update Status (Admin only)
router.patch('/:id/status', protect, authorize('admin'), updateProjectStatus);

module.exports = router;