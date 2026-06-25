const Project = require('../models/Project');
const User = require('../models/User');

// الحصول على جميع المشاريع
const getAllProjects = async (req, res) => {
  try {
    const { specialization, status } = req.query;

    let query = {};
    if (specialization) query.specialization = specialization;
    if (status) query.status = status;

    // إذا كان Admin: يرى جميع المشاريع
    // إذا كان Student: يرى فقط المشاريع المقبولة والمنشورة
    if (req.user && req.user.role !== 'admin') {
      query.status = { $in: ['مقبول', 'منشور'] };
    }

    const projects = await Project.find(query)
      .populate('createdBy', 'fullName universityEmail');

    if (projects.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'لا توجد مشاريع متاحة حالياً',
        projects: []
      });
    }

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

// الحصول على مشروع واحد
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

// إنشاء مشروع جديد
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      specialization,
      teamMembers,
      supervisors,
      graduationYear,
      githubLink,
      documentationPdfUrl,
      projectBannerUrl
    } = req.body;

    // التحقق من الحقول المطلوبة
    if (!title || !description || !specialization || !graduationYear) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء ملء جميع الحقول المطلوبة'
      });
    }
    
    // التحقق من أن المستخدم الذي ينشئ المشروع موجود
    const userExists = await User.findById(req.user.id);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // التحقق من عدم وجود مشروع بنفس العنوان من نفس المستخدم
    const existingProject = await Project.findOne({
      title: title,
      createdBy: req.user.id
    });

    if (existingProject) {
      return res.status(409).json({
        success: false,
        message: 'أنت قد أنشأت مشروع بنفس العنوان بالفعل'
      });
    }

    // إنشاء المشروع
    // teamMembers و supervisors مجرد أسماء وليست علاقات بقاعدة البيانات
    const newProject = await Project.create({
      title,
      description,
      specialization,
      teamMembers: teamMembers || [],
      supervisors: supervisors || [],
      graduationYear,
      githubLink,
      documentationPdfUrl,
      projectBannerUrl,
      createdBy: req.user.id
    });

    const populatedProject = await Project.findById(newProject._id)
      .populate('createdBy', 'fullName universityEmail');

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء المشروع بنجاح',
      project: populatedProject
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء المشروع',
      error: error.message
    });
  }
};

// تحديث مشروع
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'المشروع غير موجود'
      });
    }

    // التحقق من أن المستخدم مصرح بتعديل المشروع (المنشئ فقط أو Admin)
    if (project.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية لتعديل هذا المشروع'
      });
    }

    // تحديث المشروع مباشرة - teamMembers و supervisors مجرد أسماء
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'fullName universityEmail');

    return res.status(200).json({
      success: true,
      message: 'تم تحديث المشروع بنجاح',
      project: updatedProject
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في تحديث المشروع',
      error: error.message
    });
  }
};

// حذف مشروع (Admin فقط أو منشئ المشروع)
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

    // التحقق من الصلاحية
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

// تغيير حالة المشروع (Admin فقط)
const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // التحقق من أن الحالة صحيحة
    const validStatuses = ['مقبول', 'قيد المراجعة', 'مرفوض', 'منشور'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'حالة غير صحيحة. الحالات الصحيحة: مقبول، قيد المراجعة، مرفوض، منشور'
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'المشروع غير موجود'
      });
    }

    // تحديث الحالة
    project.status = status;
    await project.save();

    const updatedProject = await Project.findById(id)
      .populate('createdBy', 'fullName universityEmail');

    return res.status(200).json({
      success: true,
      message: `تم تغيير حالة المشروع إلى: ${status}`,
      project: updatedProject
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