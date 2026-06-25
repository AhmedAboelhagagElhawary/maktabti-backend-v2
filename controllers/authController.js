const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// تسجيل مستخدم جديد (Sign Up)
const signup = async (req, res) => {
  try {
    const {
      fullName,
      universityEmail,
      personalEmail,
      phoneNumber,
      academicMajor,
      academicYear,
      password,
      studentId
    } = req.body;

    // 1. التحقق من أن جميع الحقول المطلوبة موجودة
    if (!fullName || !universityEmail || !phoneNumber || !academicMajor || !academicYear || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء ملء جميع الحقول المطلوبة'
      });
    }

    // 2. التحقق من أن البريد الجامعي غير مسجل قبلاً
    const existingUser = await User.findOne({ universityEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'هذا البريد الإلكتروني مسجل بالفعل'
      });
    }

    // 3. تشفير كلمة المرور (Hashing)
    const hashedPassword = await bcrypt.hash(password, 10);
    // الرقم 10 يسمى "salt rounds" - كلما زاد، زادت الأمان والسرعة

    // 4. إنشاء المستخدم الجديد
    const newUser = await User.create({
      fullName,
      universityEmail,
      personalEmail,
      phoneNumber,
      academicMajor,
      academicYear,
      password: hashedPassword,
      studentId,
      role: 'student' // كل مستخدم جديد يكون طالب
    });

    // 5. إنشاء JWT Token
    const token = generateToken(newUser._id, newUser.role);

    // 6. حفظ التوكن في قاعدة البيانات (اختياري - للأمان الإضافي)
    // في النسخ المستقبلية، يمكنك إضافة حقل "tokens" للـ User Model

    // 7. الرد بالنجاح
    return res.status(201).json({
      success: true,
      message: 'تم التسجيل بنجاح!',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        universityEmail: newUser.universityEmail,
        role: newUser.role,
        academicMajor: newUser.academicMajor,
        academicYear: newUser.academicYear
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في عملية التسجيل',
      error: error.message
    });
  }
};

// تسجيل الدخول (Login)
const login = async (req, res) => {
  try {
    const { universityEmail, password } = req.body;

    // 1. التحقق من أن البريد وكلمة المرور موجودة
    if (!universityEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور'
      });
    }

    // 2. البحث عن المستخدم
    // لاحظ: select('+password') لأننا حددنا select: false في Model
    const user = await User.findOne({ universityEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // 3. التحقق من كلمة المرور
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // 4. التحقق من أن الحساب نشط
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'هذا الحساب معطل'
      });
    }

    // 5. إنشاء التوكن
    const token = generateToken(user._id, user.role);

    // 6. الرد بالنجاح
    return res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        universityEmail: user.universityEmail,
        role: user.role,
        academicMajor: user.academicMajor,
        academicYear: user.academicYear
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في عملية تسجيل الدخول',
      error: error.message
    });
  }
};

// الحصول على بيانات المستخدم الحالي
const getMe = async (req, res) => {
  try {
    // req.user.id هو الـ user ID من التوكن
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في جلب البيانات',
      error: error.message
    });
  }
};

module.exports = { signup, login, getMe };