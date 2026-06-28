const express = require('express');
const {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam
} = require('../controllers/examController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/fileUpload');

const router = express.Router();

router.get('/', getAllExams);
router.get('/:id', getExamById);
router.post('/', protect, authorize('admin'), upload.fields([
  { name: 'examPdf', maxCount: 1 },
  { name: 'solutionPdf', maxCount: 1 }
]), createExam);
router.put('/:id', protect, authorize('admin'), upload.fields([
  { name: 'examPdf', maxCount: 1 },
  { name: 'solutionPdf', maxCount: 1 }
]), updateExam);
router.delete('/:id', protect, authorize('admin'), deleteExam);

module.exports = router;