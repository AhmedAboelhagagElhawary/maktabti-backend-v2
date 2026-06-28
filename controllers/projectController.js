const Project = require('../models/Project');
const { uploadPDF, uploadImage } = require('../utils/uploadService');

// GET جميع المشاريع
const getAllProjects = async (req, res) => {
  try {
    let query = {};

    // إذا كان الـ user student، اعرض فقط المشاريع المنشورة
    if (req.user && req.user.role === 'student') {
      query = { status: { $in: ['مقبول', 'منشور'] } };
    }

    const projects = await Project.find(query)
      .populate('createdBy', 'fullName universityEmail')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في جلب المشاريع',
      error: error.message
    });
  }
};

// GET مشروع واحد
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate('createdBy', 'fullName universityEmail');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'المشروع غير موجود'
      });
    }

    // زيادة عدد المشاهدات
    project.viewsCount += 1;
    await project.save();

    return res.status(200).json({
      success: true,
      project
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في جلب المشروع',
      error: error.message
    });
  }
};

// POST إنشاء مشروع جديد (مع PDF و Banner upload)
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      specialization,
      teamMembers,
      supervisors,
      graduationYear,
      githubLink
    } = req.body;

    // التحقق من الحقول المطلوبة
    if (!title || !description || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'الحقول المطلوبة: title, description, specialization'
      });
    }

    // متغيرات لتخزين الـ URLs
    let documentationPdfUrl = null;
    let projectBannerUrl = null;

    // Upload الـ PDF إذا وجد
    if (req.files && req.files.documentationPdf) {
      try {
        const uploadResult = await uploadPDF(
          req.files.documentationPdf[0].buffer,
          `project-pdf-${Date.now()}-${req.files.documentationPdf[0].originalname}`
        );
        documentationPdfUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('❌ PDF upload failed:', error);
        return res.status(400).json({
          success: false,
          message: 'فشل رفع ملف PDF',
          error: error.message
        });
      }
    }

    // Upload الـ Banner إذا وجد
    if (req.files && req.files.projectBanner) {
      try {
        const uploadResult = await uploadImage(
          req.files.projectBanner[0].buffer,
          `project-banner-${Date.now()}-${req.files.projectBanner[0].originalname}`
        );
        projectBannerUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('❌ Banner upload failed:', error);
        return res.status(400).json({
          success: false,
          message: 'فشل رفع صورة المشروع',
          error: error.message
        });
      }
    }

    // إنشاء المشروع
    const newProject = await Project.create({
      title,
      description,
      specialization,
      teamMembers: teamMembers ? JSON.parse(teamMembers) : [],
      supervisors: supervisors ? JSON.parse(supervisors) : [],
      graduationYear,
      githubLink,
      documentationPdfUrl,
      projectBannerUrl,
      createdBy: req.user.id,
      status: 'قيد المراجعة'
    });

    await newProject.populate('createdBy', 'fullName universityEmail');

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء المشروع بنجاح! في انتظار موافقة الإدارة',
      project: newProject
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء المشروع',
      error: error.message
    });
  }
};

// PUT تحديث مشروع
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      specialization,
      teamMembers,
      supervisors,
      graduationYear,
      githubLink
    } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'المشروع غير موجود'
      });
    }

    // تحقق من الصلاحيات
    if (project.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لتحديث هذا المشروع'
      });
    }

    // تحديث البيانات
    if (title) project.title = title;
    if (description) project.description = description;
    if (specialization) project.specialization = specialization;
    if (teamMembers) project.teamMembers = JSON.parse(teamMembers);
    if (supervisors) project.supervisors = JSON.parse(supervisors);
    if (graduationYear) project.graduationYear = graduationYear;
    if (githubLink) project.githubLink = githubLink;

    // تحديث الملفات إذا وجدت
    if (req.files && req.files.documentationPdf) {
      const uploadResult = await uploadPDF(
        req.files.documentationPdf[0].buffer,
        `project-pdf-update-${Date.now()}`
      );
      project.documentationPdfUrl = uploadResult.secure_url;
    }

    if (req.files && req.files.projectBanner) {
      const uploadResult = await uploadImage(
        req.files.projectBanner[0].buffer,
        `project-banner-update-${Date.now()}`
      );
      project.projectBannerUrl = uploadResult.secure_url;
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: 'تم تحديث المشروع بنجاح',
      project
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في تحديث المشروع',
      error: error.message
    });
  }
};

// DELETE حذف مشروع
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'المشروع غير موجود'
      });
    }

    // تحقق من الصلاحيات
    if (project.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لحذف هذا المشروع'
      });
    }

    await Project.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'تم حذف المشروع بنجاح'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في حذف المشروع',
      error: error.message
    });
  }
};

// PATCH تحديث حالة المشروع (Admin only)
const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['مقبول', 'قيد المراجعة', 'مرفوض', 'منشور'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `الحالة يجب أن تكون واحدة من: ${validStatuses.join(', ')}`
      });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('createdBy', 'fullName universityEmail');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'المشروع غير موجود'
      });
    }

    return res.status(200).json({
      success: true,
      message: `تم تحديث حالة المشروع إلى: ${status}`,
      project
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في تحديث حالة المشروع',
      error: error.message
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStatus
};