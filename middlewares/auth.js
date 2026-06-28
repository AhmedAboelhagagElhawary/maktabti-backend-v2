const jwt = require('jsonwebtoken');

// Middleware للتحقق من أن المستخدم مسجل دخول
const protect = (req, res, next) => {
  try {
    // الحصول على التوكن من الـ Headers
    const token = req.headers.authorization?.split(' ')[1];
    // الصيغة: "Bearer <token>"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'لم يتم تقديم توكن، الرجاء تسجيل الدخول أولاً'
      });
    }

    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // حفظ بيانات المستخدم في الـ request لاستخدامها لاحقاً
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'التوكن غير صحيح أو انتهى الصلاحية'
    });
  }
};

// Middleware للتحقق من الصلاحيات
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'الرجاء تسجيل الدخول أولاً'
      });
    }

    // التحقق من أن role المستخدم موجود في الأدوار المسموحة
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية للقيام بهذا الإجراء'
      });
    }

    next();
  };
};

const authorizeSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '❌ أنت لا تملك صلاحيات Super Admin'
    });
  }

  if (!req.user.isSuperAdmin) {
    return res.status(403).json({
      success: false,
      message: '❌ فقط Super Admin يقدر ينشئ Admin جديد'
    });
  }

  next();
};

module.exports = { protect, authorize, authorizeSuperAdmin};
//module.exports = { protect };