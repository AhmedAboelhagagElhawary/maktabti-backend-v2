const multer = require('multer');

// Storage في الـ memory
const storage = multer.memoryStorage();

// Filter للملفات المسموحة
const fileFilter = (req, file, cb) => {
  // PDF فقط
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  }
  // صور (PNG, JPG, JPEG, WebP)
  else if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  }
  // رفض باقي الأنواع
  else {
    cb(new Error('نوع الملف غير مسموح. استخدم PDF أو صور فقط'), false);
  }
};

// إعدادات Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

module.exports = upload;