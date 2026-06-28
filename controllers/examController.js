const Exam = require('../models/Exam');
const { uploadPDF } = require('../utils/uploadService');

// GET جميع الامتحانات
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });

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

// GET امتحان واحد
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

// POST إنشاء امتحان جديد (مع PDF upload)
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
      examDate
    } = req.body;

    // التحقق من الحقول المطلوبة
    if (!courseName || !courseCode || !examDate) {
      return res.status(400).json({
        success: false,
        message: 'الحقول المطلوبة: courseName, courseCode, examDate'
      });
    }

    // متغيرات لتخزين الـ URLs
    let examPdfUrl = null;
    let solutionPdfUrl = null;

    // Upload ملف الامتحان (مطلوب)
    if (req.files && req.files.examPdf) {
      try {
        const uploadResult = await uploadPDF(
          req.files.examPdf[0].buffer,
          `exam-pdf-${Date.now()}-${req.files.examPdf[0].originalname}`
        );
        examPdfUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('❌ Exam PDF upload failed:', error);
        return res.status(400).json({
          success: false,
          message: 'فشل رفع ملف الامتحان',
          error: error.message
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'ملف الامتحان مطلوب'
      });
    }

    // Upload ملف الحل (اختياري)
    if (req.files && req.files.solutionPdf) {
      try {
        const uploadResult = await uploadPDF(
          req.files.solutionPdf[0].buffer,
          `exam-solution-${Date.now()}-${req.files.solutionPdf[0].originalname}`
        );
        solutionPdfUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('❌ Solution PDF upload failed:', error);
        // لا نوقف العملية إذا فشل الحل (هو اختياري)
      }
    }

    // إنشاء الامتحان
    const newExam = await Exam.create({
      courseName,
      courseCode: courseCode.toUpperCase(),
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
      message: 'تم إنشاء الامتحان بنجاح',
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

// PUT تحديث امتحان
const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      courseName,
      courseCode,
      examType,
      academicYear,
      semester,
      specialization,
      instructor,
      examDate
    } = req.body;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'الامتحان غير موجود'
      });
    }

    // تحديث البيانات
    if (courseName) exam.courseName = courseName;
    if (courseCode) exam.courseCode = courseCode.toUpperCase();
    if (examType) exam.examType = examType;
    if (academicYear) exam.academicYear = academicYear;
    if (semester) exam.semester = semester;
    if (specialization) exam.specialization = specialization;
    if (instructor) exam.instructor = instructor;
    if (examDate) exam.examDate = examDate;

    // تحديث ملف الامتحان إذا وجد
    if (req.files && req.files.examPdf) {
      const uploadResult = await uploadPDF(
        req.files.examPdf[0].buffer,
        `exam-pdf-update-${Date.now()}`
      );
      exam.examPdfUrl = uploadResult.secure_url;
    }

    // تحديث ملف الحل إذا وجد
    if (req.files && req.files.solutionPdf) {
      const uploadResult = await uploadPDF(
        req.files.solutionPdf[0].buffer,
        `exam-solution-update-${Date.now()}`
      );
      exam.solutionPdfUrl = uploadResult.secure_url;
    }

    await exam.save();

    return res.status(200).json({
      success: true,
      message: 'تم تحديث الامتحان بنجاح',
      exam
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الامتحان',
      error: error.message
    });
  }
};

// DELETE حذف امتحان
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