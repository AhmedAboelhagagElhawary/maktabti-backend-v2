const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    // اسم القسم
    name: {
      type: String,
      required: [true, 'اسم القسم مطلوب'],
      minlength: [3, 'اسم القسم يجب أن يكون 3 أحرف على الأقل'],
      maxlength: [100, 'اسم القسم يجب ألا يتجاوز 100 حرف']
    },

    // وصف القسم
    description: {
      type: String,
      required: [true, 'الوصف مطلوب'],
      maxlength: [500, 'الوصف يجب ألا يتجاوز 500 حرف']
    },

    // صورة أو رمز القسم (رابط URL)
    iconUrl: {
      type: String,
      sparse: true
    },

    // عدد الكتب في هذا القسم (يتم حسابه تلقائياً)
    booksCount: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true
  }
);

module.exports = mongoose.model('Category', categorySchema);