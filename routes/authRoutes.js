const express = require('express');
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Route للتسجيل الجديد
// POST /api/auth/signup
router.post('/signup', signup);

// Route لتسجيل الدخول
// POST /api/auth/login
router.post('/login', login);

// Route للحصول على بيانات المستخدم الحالي
// GET /api/auth/me
// يحتاج إلى التوكن في الـ Headers
router.get('/me', protect, getMe);

module.exports = router;