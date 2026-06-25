const Book = require('../models/Book');
const Category = require('../models/Category');

// الحصول على جميع الكتب
const getAllBooks = async (req, res) => {
  try {
    // يمكن فلترة حسب القسم
    const { categoryId } = req.query;
    
    let query = {};
    if (categoryId) {
      query.category = categoryId;
    }

    const books = await Book.find(query).populate('category', 'name description');

    if (books.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'لا توجد كتب حالياً',
        books: []
      });
    }

    return res.status(200).json({
      success: true,
      count: books.length,
      books
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في جلب الكتب',
      error: error.message
    });
  }
};

// الحصول على كتاب واحد
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id).populate('category');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب غير موجود'
      });
    }

    return res.status(200).json({
      success: true,
      book
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في جلب الكتاب',
      error: error.message
    });
  }
};

// إنشاء كتاب جديد (Admin فقط)
const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      description,
      availabilityStatus,
      totalCopies,
      availableCopies,
      publicationYear,
      coverImageUrl,
      pdfUrl,
      rating
    } = req.body;

    // التحقق من الحقول المطلوبة
    if (!title || !author || !category || !totalCopies || !availableCopies) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء ملء جميع الحقول المطلوبة'
      });
    }

    // التحقق من أن القسم موجود
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'القسم غير موجود'
      });
    }

    // التحقق من أن عدد النسخ المتاحة لا يتجاوز الإجمالي
    if (availableCopies > totalCopies) {
      return res.status(400).json({
        success: false,
        message: 'عدد النسخ المتاحة لا يمكن أن يتجاوز الإجمالي'
      });
    }

    // إنشاء الكتاب
    const newBook = await Book.create({
      title,
      author,
      category,
      description,
      availabilityStatus,
      totalCopies,
      availableCopies,
      publicationYear,
      coverImageUrl,
      pdfUrl,
      rating
    });

    // تحديث عدد الكتب في القسم
    await Category.findByIdAndUpdate(
      category,
      { $inc: { booksCount: 1 } }
    );

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء الكتاب بنجاح',
      book: await newBook.populate('category')
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الكتاب',
      error: error.message
    });
  }
};

// تحديث كتاب (Admin فقط)
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب غير موجود'
      });
    }

    // التحقق من أن القسم صحيح إذا تم تحديثه
    if (updateData.category) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'القسم غير موجود'
        });
      }
    }

    // التحقق من أن النسخ صحيحة
    if (updateData.availableCopies !== undefined && updateData.totalCopies !== undefined) {
      if (updateData.availableCopies > updateData.totalCopies) {
        return res.status(400).json({
          success: false,
          message: 'عدد النسخ المتاحة لا يمكن أن يتجاوز الإجمالي'
        });
      }
    }

    // تحديث الكتاب
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category');

    return res.status(200).json({
      success: true,
      message: 'تم تحديث الكتاب بنجاح',
      book: updatedBook
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الكتاب',
      error: error.message
    });
  }
};

// حذف كتاب (Admin فقط)
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب غير موجود'
      });
    }

    // تحديث عدد الكتب في القسم
    await Category.findByIdAndUpdate(
      book.category,
      { $inc: { booksCount: -1 } }
    );

    // حذف الكتاب
    await Book.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'تم حذف الكتاب بنجاح'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في حذف الكتاب',
      error: error.message
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};