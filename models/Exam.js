const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, 'اسم المادة مطلوب'],
      trim: true
    },

    // ❌ احذف unique من courseCode
    courseCode: {
      type: String,
      required: [true, 'رمز المادة مطلوب'],
      uppercase: true,
      trim: true
      // ❌ بدون: unique: true
    },

    examType: {
      type: String,
      enum: ['ميدتيرم', 'نهائي'],
      required: [true, 'نوع الامتحان مطلوب']
    },

    academicYear: {
      type: String,
      required: false
    },

    semester: {
      type: String,
      enum: ['الفصل الأول', 'الفصل الثاني'],
      required: false
    },

    specialization: {
      type: String,
      required: false
    },

    instructor: {
      type: String,
      required: false
    },

    examDate: {
      type: Date,
      required: [true, 'تاريخ الامتحان مطلوب']
    },

    examPdfUrl: {
      type: String,
      required: [true, 'رابط ملف الامتحان مطلوب']
    },

    solutionPdfUrl: {
      type: String,
      sparse: true
    },

    viewsCount: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true
  }
);

module.exports = mongoose.model('Exam', examSchema);