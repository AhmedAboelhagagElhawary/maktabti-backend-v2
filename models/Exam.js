const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    // اسم المادة
    courseName: {
      type: String,
      required: [true, 'اسم المادة مطلوب'],
      trim: true
    },

    // كود المادة
    courseCode: {
      type: String,
      required: [true, 'كود المادة مطلوب'],
      unique: true,
      uppercase: true
    },

    // نوع الامتحان
    examType: {
      type: String,
      enum: ['ميدتيرم', 'نهائي'],
      required: [true, 'نوع الامتحان مطلوب']
    },

    // السنة الدراسية
    academicYear: {
      type: String,
      enum: ['First', 'Second', 'Third', 'Fourth'],
      required: [true, 'السنة الدراسية مطلوبة']
    },

    // الفصل الدراسي
    semester: {
      type: String,
      enum: ['الفصل الأول', 'الفصل الثاني'],
      required: [true, 'الفصل الدراسي مطلوب']
    },

    // التخصص المتعلق بالمادة
    specialization: {
      type: String,
      required: [true, 'التخصص مطلوب'],
      enum: [
        'الذكاء الاصطناعي',
        'تطوير الويب',
        'تطبيقات الموبايل',
        'الأمن السيبراني',
        'قواعد البيانات',
        'هندسة البرمجيات'
      ]
    },

    // اسم المدرس (نص فقط)
    instructor: {
      type: String,
      sparse: true,
      trim: true
    },

    // تاريخ الامتحان
    examDate: {
      type: Date,
      required: [true, 'تاريخ الامتحان مطلوب']
    },

    // ملف الامتحان (PDF)
    examPdfUrl: {
      type: String,
      required: [true, 'رابط ملف الامتحان مطلوب']
    },

    // ملف الحل (الإجابات النموذجية)
    solutionPdfUrl: {
      type: String,
      sparse: true
    },

    // عدد مرات المشاهدة
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