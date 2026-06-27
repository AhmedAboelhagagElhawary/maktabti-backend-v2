const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // المعلومات الأساسية
    fullName: {
      type: String,
      required: [true, 'الرجاء إدخال الاسم الكامل'],
      trim: true,
      minlength: [3, 'الاسم يجب أن يكون 3 أحرف على الأقل']
    },

    // البريد الجامعي (الفريد والرئيسي)
    universityEmail: {
      type: String,
      required: [true, 'البريد الجامعي مطلوب'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'الرجاء إدخال بريد إلكتروني صحيح'
      ]
    },

    // البريد الشخصي (اختياري)
    personalEmail: {
      type: String,
      sparse: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'الرجاء إدخال بريد إلكتروني صحيح'
      ]
    },

    // رقم الهاتف
    phoneNumber: {
      type: String,
      required: [true, 'رقم الهاتف مطلوب'],
      match: [/^[\d\s\-\+\(\)]{10,}$/, 'الرجاء إدخال رقم هاتف صحيح']
    },

    // كلمة المرور
    password: {
      type: String,
      required: [true, 'كلمة المرور مطلوبة'],
      minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'],
      select: false
    },

    // التخصص الأكاديمي
    academicMajor: {
      type: String,
      required: [true, 'التخصص الأكاديمي مطلوب'],
    },

    // السنة الدراسية
    academicYear: {
      type: String,
      required: [true, 'السنة الدراسية مطلوبة'],
      enum: ['First', 'Second', 'Third', 'Fourth']
    },

    // نوع المستخدم
    role: {
      type: String,
      enum: ['admin', 'student'],
      default: 'student'
    },

    // رقم الطالب (اختياري)
    studentId: {
      type: String,
      sparse: true
    },

    // حالة الحساب
    isActive: {
      type: Boolean,
      default: true
    },

    // التحقق من البريد الإلكتروني
    isEmailVerified: {
      type: Boolean,
      default: false
    },

    // كود OTP مؤقت
    otp: {
      type: String,
      sparse: true,
      select: false
    },

    // انتهاء صلاحية OTP (بعد 10 دقائق)
    otpExpiry: {
      type: Date,
      sparse: true,
      select: false
    }
  },
  { 
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);