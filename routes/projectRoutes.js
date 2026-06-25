const express = require('express');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStatus  // تأكد أنها هنا
} = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Routes للجميع
// GET /api/projects - جلب جميع المشاريع
router.get('/', getAllProjects);

// GET /api/projects/:id - جلب مشروع واحد
router.get('/:id', getProjectById);

// Routes محمية (يجب تسجيل دخول)
// POST /api/projects - إنشاء مشروع جديد (طالب أو admin)
router.post('/', protect, createProject);

// PUT /api/projects/:id - تحديث مشروع (منشئ أو admin)
router.put('/:id', protect, updateProject);

// DELETE /api/projects/:id - حذف مشروع (منشئ أو admin)
router.delete('/:id', protect, deleteProject);

// PATCH /api/projects/:id/status - تغيير حالة المشروع (Admin فقط)
router.patch('/:id/status', protect, authorize('admin'), updateProjectStatus);

module.exports = router;