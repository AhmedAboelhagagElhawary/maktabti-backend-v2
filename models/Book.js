const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    // عنوان الكتاب
    title: {
      type: String,
      required: [true, 'عنوان الكتاب مطلوب'],
      trim: true,
      minlength: [3, 'العنوان يجب أن يكون 3 أحرف على الأقل']
    },

    // مؤلف الكتاب
    author: {
      type: String,
      required: [true, 'اسم المؤلف مطلوب'],
      trim: true
    },

    // القسم (العلاقة مع Category)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'القسم مطلوب']
    },

    // الوصف
    description: {
      type: String,
      maxlength: [1000, 'الوصف يجب ألا يتجاوز 1000 حرف']
    },

    // حالة التوفر
    availabilityStatus: {
      type: String,
      enum: ['متوفر', 'غير متوفر', 'محفوظ'],
      default: 'متوفر'
    },

    // عدد النسخ المتاحة
    totalCopies: {
      type: Number,
      required: [true, 'عدد النسخ مطلوب'],
      min: [1, 'يجب أن يكون هناك نسخة واحدة على الأقل']
    },

    // عدد النسخ المتاحة حالياً
    availableCopies: {
      type: Number,
      required: true,
      min: [0, 'لا يمكن أن تكون سالبة']
    },

    // سنة النشر
    publicationYear: {
      type: Number,
      required: [true, 'سنة النشر مطلوبة']
    },

    // رابط الصورة (الغلاف)
    coverImageUrl: {
      type: String,
      sparse: true
    },

    // رابط الـ PDF (اختياري)
    pdfUrl: {
      type: String,
      sparse: true
    },

    // تقييم الكتاب (اختياري)
    rating: {
      type: Number,
      min: [0, 'التقييم لا يمكن أن يكون أقل من 0'],
      max: [5, 'التقييم لا يمكن أن يكون أكثر من 5'],
      default: 0
    }
  },
  { 
    timestamps: true
  }
);

module.exports = mongoose.model('Book', bookSchema);