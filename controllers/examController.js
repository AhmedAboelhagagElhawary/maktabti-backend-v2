const Exam = require('../models/Exam');

// الحصول على جميع الامتحانات السابقة
const getAllExams = async (req, res) => {
  try {
    const { specialization, examType, academicYear, semester } = req.query;

    let query = {};
    if (specialization) query.specialization = specialization;
    if (examType) query.examType = examType;
    if (academicYear) query.academicYear = academicYear;
    if (semester) query.semester = semester;

    const exams = await Exam.find(query).sort({ examDate: -1 });

    if (exams.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'لا توجد امتحانات سابقة متاحة حالياً',
        exams: []
      });
    }

    return res.status(200).json({
      success: true,
      count: exams.length,
      exams
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في جلب الامتحانات',
      error: error.message
    });
  }
};

// الحصول على امتحان واحد
const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'الامتحان غير موجود'
      });
    }

    // زيادة عدد المشاهدات
    exam.viewsCount += 1;
    await exam.save();

    return res.status(200).json({
      success: true,
      exam
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في جلب الامتحان',
      error: error.message
    });
  }
};

// إنشاء امتحان سابق جديد (Admin فقط)
const createExam = async (req, res) => {
  try {
    const {
      courseName,
      courseCode,
      examType,
      academicYear,
      semester,
      specialization,
      instructor,
      examDate,
      examPdfUrl,
      solutionPdfUrl
    } = req.body;

    // التحقق من الحقول المطلوبة
    if (!courseName || !courseCode || !examType || !academicYear || !semester || 
        !specialization || !examDate || !examPdfUrl) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء ملء جميع الحقول المطلوبة'
      });
    }

    // التحقق من أن رمز المادة فريد
    const existingExam = await Exam.findOne({ courseCode });
    if (existingExam) {
      return res.status(409).json({
        success: false,
        message: 'رمز المادة موجود بالفعل'
      });
    }

    // إنشاء الامتحان
    const newExam = await Exam.create({
      courseName,
      courseCode,
      examType,
      academicYear,
      semester,
      specialization,
      instructor,
      examDate,
      examPdfUrl,
      solutionPdfUrl
    });

    return res.status(201).json({
      success: true,
      message: 'تم إضافة الامتحان السابق بنجاح',
      exam: newExam
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الامتحان',
      error: error.message
    });
  }
};

// تحديث امتحان (Admin فقط)
const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'الامتحان غير موجود'
      });
    }

    // تحديث الامتحان
    const updatedExam = await Exam.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'تم تحديث الامتحان بنجاح',
      exam: updatedExam
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الامتحان',
      error: error.message
    });
  }
};

// حذف امتحان (Admin فقط)
const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'الامتحان غير موجود'
      });
    }

    await Exam.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'تم حذف الامتحان بنجاح'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في حذف الامتحان',
      error: error.message
    });
  }
};

module.exports = {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam
};