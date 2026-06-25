const express = require('express');
const {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam
} = require('../controllers/examController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Routes للجميع (بدون حماية)
// GET /api/exams - جلب جميع الامتحانات السابقة
router.get('/', getAllExams);

// GET /api/exams/:id - جلب امتحان سابق واحد
router.get('/:id', getExamById);

// Routes للـ Admin فقط (محمية)
// POST /api/exams - إضافة امتحان سابق جديد
router.post('/', protect, authorize('admin'), createExam);

// PUT /api/exams/:id - تحديث امتحان سابق
router.put('/:id', protect, authorize('admin'), updateExam);

// DELETE /api/exams/:id - حذف امتحان سابق
router.delete('/:id', protect, authorize('admin'), deleteExam);

module.exports = router;