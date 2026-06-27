const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { sendOtpEmail, sendPasswordResetEmail } = require('../utils/emailService');

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
      role: 'student', // كل مستخدم جديد يكون طالب
      isEmailVerified: false // لم يتحقق من البريد بعد
    });

    // 5. توليد OTP عشوائي (6 أرقام)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 6. حفظ OTP في قاعدة البيانات (صلاحية 10 دقائق)
    newUser.otp = otp;
    newUser.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await newUser.save();

    // 7. إرسال OTP للبريد
    try {
      await sendOtpEmail(universityEmail, otp);
    } catch (emailError) {
      console.error('خطأ في إرسال البريد:', emailError);
      // لا نوقف العملية، فقط نسجل الخطأ
    }

    // 8. الرد بالنجاح
    return res.status(201).json({
      success: true,
      message: 'تم التسجيل بنجاح! تحقق من بريدك للحصول على كود التحقق',
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

// التحقق من OTP
const verifyOtp = async (req, res) => {
  try {
    const { universityEmail, otp } = req.body;

    // التحقق من المدخلات
    if (!universityEmail || !otp) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني و OTP مطلوبان'
      });
    }

    // البحث عن المستخدم مع OTP و otpExpiry
    const user = await User.findOne({ universityEmail }).select('+otp +otpExpiry +password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // التحقق من أن OTP صحيح
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'كود التحقق غير صحيح'
      });
    }

    // التحقق من أن OTP لم ينته صلاحيته
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'انتهت صلاحية الكود، اطلب كود جديد'
      });
    }

    // مسح OTP وتحديث البريد كمتحقق منه
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isEmailVerified = true;
    await user.save();

    // إنشاء التوكن
    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'تم التحقق من البريد بنجاح!',
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
      message: 'خطأ في التحقق من OTP',
      error: error.message
    });
  }
};

// إعادة إرسال OTP
const resendOtp = async (req, res) => {
  try {
    const { universityEmail } = req.body;

    if (!universityEmail) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مطلوب'
      });
    }

    const user = await User.findOne({ universityEmail }).select('+otp +otpExpiry');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // إذا تحقق من البريد بالفعل
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'تم التحقق من بريدك بالفعل'
      });
    }

    // توليد OTP جديد
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // إرسال OTP
    try {
      await sendOtpEmail(universityEmail, otp);
    } catch (emailError) {
      console.error('خطأ في إرسال البريد:', emailError);
    }

    return res.status(200).json({
      success: true,
      message: 'تم إرسال كود جديد إلى بريدك'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في إعادة إرسال OTP',
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

    // 4. التحقق من أن البريد تم التحقق منه
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'يجب التحقق من بريدك أولاً. تحقق من صندوق بريدك وأدخل الكود'
      });
    }

    // 5. التحقق من أن الحساب نشط
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'هذا الحساب معطل'
      });
    }

    // 6. إنشاء التوكن
    const token = generateToken(user._id, user.role);

    // 7. الرد بالنجاح
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
    // req.user يأتي من middleware protect
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

// نسيان كلمة المرور
const forgotPassword = async (req, res) => {
  try {
    const { universityEmail } = req.body;

    if (!universityEmail) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مطلوب'
      });
    }

    const user = await User.findOne({ universityEmail }).select('+otp +otpExpiry');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // توليد OTP لإعادة تعيين كلمة المرور
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // إرسال OTP
    try {
      await sendPasswordResetEmail(universityEmail, otp);
    } catch (emailError) {
      console.error('خطأ في إرسال البريد:', emailError);
    }

    return res.status(200).json({
      success: true,
      message: 'تم إرسال كود إعادة التعيين إلى بريدك'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في عملية إعادة تعيين كلمة المرور',
      error: error.message
    });
  }
};

// إعادة تعيين كلمة المرور
const resetPassword = async (req, res) => {
  try {
    const { universityEmail, otp, newPassword } = req.body;

    if (!universityEmail || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'البريد والـ OTP وكلمة المرور الجديدة مطلوبة'
      });
    }

    // التحقق من طول كلمة المرور
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
      });
    }

    const user = await User.findOne({ universityEmail }).select('+otp +otpExpiry +password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // التحقق من OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'كود التحقق غير صحيح'
      });
    }

    // التحقق من انتهاء الصلاحية
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'انتهت صلاحية الكود'
      });
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'تم إعادة تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في إعادة تعيين كلمة المرور',
      error: error.message
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword
};