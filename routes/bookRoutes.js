const express = require('express');
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Routes للجميع
// GET /api/books - جلب جميع الكتب
router.get('/', getAllBooks);

// GET /api/books/:id - جلب كتاب واحد
router.get('/:id', getBookById);

// Routes للـ Admin فقط
// POST /api/books - إنشاء كتاب جديد
router.post('/', protect, authorize('admin'), createBook);

// PUT /api/books/:id - تحديث كتاب
router.put('/:id', protect, authorize('admin'), updateBook);

// DELETE /api/books/:id - حذف كتاب
router.delete('/:id', protect, authorize('admin'), deleteBook);

module.exports = router;