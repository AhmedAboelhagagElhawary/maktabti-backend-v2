const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    // عنوان المشروع
    title: {
      type: String,
      required: [true, 'عنوان المشروع مطلوب'],
      trim: true,
      minlength: [5, 'العنوان يجب أن يكون 5 أحرف على الأقل']
    },

    // وصف المشروع
    description: {
      type: String,
      required: [true, 'الوصف مطلوب'],
      maxlength: [2000, 'الوصف يجب ألا يتجاوز 2000 حرف']
    },

    // التخصص
    specialization: {
      type: String,
      required: [true, 'التخصص مطلوب'],
    },

    // أعضاء الفريق (علاقة مع User)
    teamMembers: [
      {
        type: String,
        trim: true
      }
    ],

    // المشرفون (علاقة مع User)
    supervisors: [
      {
        type: String,
        trim: true
      }
    ],

    // سنة التخرج
    graduationYear: {
      type: Number,
      required: [true, 'سنة التخرج مطلوبة']
    },

    // رابط GitHub
    githubLink: {
      type: String,
      sparse: true,
      match: [
        /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/,
        'الرجاء إدخال رابط GitHub صحيح (مثال: https://github.com/username/repo)'
        ] 
    },

    // رابط ملف التوثيق (PDF)
    documentationPdfUrl: {
      type: String,
      sparse: true
    },

    // حالة المشروع
    status: {
      type: String,
      enum: ['مقبول', 'قيد المراجعة', 'مرفوض', 'منشور'],
      default: 'قيد المراجعة'
    },
    // صورة/بانر المشروع
    projectBannerUrl: {
      type: String,
      sparse: true
    },

    // الطالب الذي أنشأ المشروع
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // عدد المشاهدات (اختياري)
    viewsCount: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true
    
  }
);

projectSchema.index({ title: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model('Project', projectSchema);