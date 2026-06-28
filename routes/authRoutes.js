const express = require('express');
const {
  signup,
  login,
  getMe,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  createAdminAccount,
  changePassword  // ✅ تأكد موجودة
} = require('../controllers/authController');
const { protect, authorize, authorizeSuperAdmin } = require('../middlewares/auth');

const router = express.Router();

// Routes عامة
router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/login', login);

// Routes محمية
router.get('/me', protect, getMe);
router.post('/change-password', protect, changePassword);  // ✅ صحيح

// Route خاص لـ Super Admin
router.post('/admin/create', protect, authorizeSuperAdmin, createAdminAccount);

module.exports = router;