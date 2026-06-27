const express = require('express');
const {
  signup,
  login,
  getMe,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Routes للتسجيل والتحقق (بدون حماية)
router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Route لتسجيل الدخول
router.post('/login', login);

// Route للحصول على بيانات المستخدم الحالي (محمية)
router.get('/me', protect, getMe);

module.exports = router;