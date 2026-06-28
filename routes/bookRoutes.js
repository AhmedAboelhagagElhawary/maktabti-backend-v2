const express = require('express');
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/fileUpload');

const router = express.Router();

// GET routes (public)
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// POST route - create book WITH files upload (admin only)
router.post('/', protect, authorize('admin'), upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'bookPdf', maxCount: 1 }
]), createBook);

// PUT route - update book (admin only)
router.put('/:id', protect, authorize('admin'), upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'bookPdf', maxCount: 1 }
]), updateBook);

// DELETE route (admin only)
router.delete('/:id', protect, authorize('admin'), deleteBook);

module.exports = router;