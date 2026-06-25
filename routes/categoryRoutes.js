const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Routes للجميع (بدون حماية)
// GET /api/categories - جلب جميع الأقسام
router.get('/', getAllCategories);

// GET /api/categories/:id - جلب قسم واحد
router.get('/:id', getCategoryById);

// Routes للـ Admin فقط (محمية)
// POST /api/categories - إنشاء قسم جديد
// protect = التحقق من أن المستخدم مسجل دخول
// authorize('admin') = التحقق من أن المستخدم admin
router.post('/', protect, authorize('admin'), createCategory);

// PUT /api/categories/:id - تحديث قسم
router.put('/:id', protect, authorize('admin'), updateCategory);

// DELETE /api/categories/:id - حذف قسم
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;