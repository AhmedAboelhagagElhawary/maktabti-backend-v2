const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    // اسم الكتاب
    title: {
      type: String,
      required: [true, 'اسم الكتاب مطلوب'],
      trim: true,
      minlength: [3, 'الاسم يجب أن يكون 3 أحرف على الأقل']
    },

    // المؤلف
    author: {
      type: String,
      required: [true, 'اسم المؤلف مطلوب']
    },

    // القسم/التصنيف
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'القسم مطلوب']
    },

    // الوصف
    description: {
      type: String,
      required: [true, 'وصف الكتاب مطلوب']
    },

    // حالة التوفر
    availabilityStatus: {
      type: String,
      enum: ['متوفر', 'غير متوفر', 'محفوظ'],
      default: 'متوفر'
    },

    // إجمالي النسخ
    totalCopies: {
      type: Number,
      required: [true, 'عدد النسخ المطلوب'],
      min: [1, 'يجب أن يكون هناك نسخة واحدة على الأقل']
    },

    // النسخ المتاحة
    availableCopies: {
      type: Number,
      required: true,
      min: [0, 'عدد النسخ المتاحة لا يمكن أن يكون سالباً']
    },

    // سنة النشر
    publicationYear: {
      type: Number,
      required: [true, 'سنة النشر مطلوبة']
    },

    // صورة الغلاف (Cover Image)
    coverImageUrl: {
      type: String,
      sparse: true
    },

    // ملف PDF للكتاب
    pdfUrl: {
      type: String,
      sparse: true
    },

    // التقييم
    rating: {
      type: Number,
      min: [0, 'التقييم لا يمكن أن يكون أقل من 0'],
      max: [5, 'التقييم لا يمكن أن يتجاوز 5'],
      default: 0
    }
  },
  { 
    timestamps: true
  }
);

module.exports = mongoose.model('Book', bookSchema);