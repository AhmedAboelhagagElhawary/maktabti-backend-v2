const Category = require('../models/Category');

// الحصول على جميع الأقسام
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    if (categories.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'لا توجد أقسام حالياً',
        categories: []
      });
    }

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في جلب الأقسام',
      error: error.message
    });
  }
};

// الحصول على قسم واحد بـ ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'القسم غير موجود'
      });
    }

    return res.status(200).json({
      success: true,
      category
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في جلب القسم',
      error: error.message
    });
  }
};

// إنشاء قسم جديد (Admin فقط)
const createCategory = async (req, res) => {
  try {
    const { name, description, iconUrl } = req.body;

    // التحقق من الحقول المطلوبة
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال الاسم والوصف'
      });
    }

    // التحقق من أن الاسم فريد
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'هذا القسم موجود بالفعل'
      });
    }

    // إنشاء القسم الجديد
    const newCategory = await Category.create({
      name,
      description,
      iconUrl
    });

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء القسم بنجاح',
      category: newCategory
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء القسم',
      error: error.message
    });
  }
};

// تحديث قسم (Admin فقط)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, iconUrl } = req.body;

    // البحث عن القسم
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'القسم غير موجود'
      });
    }

    // تحديث الحقول
    if (name) category.name = name;
    if (description) category.description = description;
    if (iconUrl) category.iconUrl = iconUrl;

    // حفظ التعديلات
    await category.save();

    return res.status(200).json({
      success: true,
      message: 'تم تحديث القسم بنجاح',
      category
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في تحديث القسم',
      error: error.message
    });
  }
};

// حذف قسم (Admin فقط)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'القسم غير موجود'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'تم حذف القسم بنجاح'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في حذف القسم',
      error: error.message
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};