const Book = require('../models/Book');
const Category = require('../models/Category');
const { uploadImage, uploadPDF } = require('../utils/uploadService');

// GET جميع الكتب
const getAllBooks = async (req, res) => {
  try {
    const { categoryId } = req.query;
    let query = {};

    if (categoryId) {
      query.category = categoryId;
    }

    const books = await Book.find(query)
      .populate('category', 'name description');

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

// GET كتاب واحد
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id)
      .populate('category', 'name description');

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

// POST إنشاء كتاب جديد (مع صورة و PDF)
// POST إنشاء كتاب جديد
const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      categoryName, // ✅ بدل category ID
      description,
      availabilityStatus,
      totalCopies,
      availableCopies,
      publicationYear,
      rating
    } = req.body;

    // التحقق من الحقول المطلوبة
    if (!title || !author || !categoryName || !description || !totalCopies) {
      return res.status(400).json({
        success: false,
        message: 'الحقول المطلوبة: title, author, categoryName, description, totalCopies'
      });
    }

    // ✅ ابحث عن التصنيف باستخدام الـ name
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `التصنيف "${categoryName}" غير موجود`,
        availableCategories: await Category.find({}, 'name -_id')
      });
    }

    // متغيرات لتخزين الـ URLs
    let coverImageUrl = null;
    let pdfUrl = null;

    // Upload صورة الغلاف إذا وجدت
    if (req.files && req.files.coverImage) {
      try {
        const uploadResult = await uploadImage(
          req.files.coverImage[0].buffer,
          `book-cover-${Date.now()}-${req.files.coverImage[0].originalname}`
        );
        coverImageUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('❌ Cover image upload failed:', error);
        return res.status(400).json({
          success: false,
          message: 'فشل رفع صورة الغلاف',
          error: error.message
        });
      }
    }

    // Upload ملف PDF إذا وجد
    if (req.files && req.files.bookPdf) {
      try {
        const uploadResult = await uploadPDF(
          req.files.bookPdf[0].buffer,
          `book-pdf-${Date.now()}-${req.files.bookPdf[0].originalname}`
        );
        pdfUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('❌ PDF upload failed:', error);
        return res.status(400).json({
          success: false,
          message: 'فشل رفع ملف الكتاب',
          error: error.message
        });
      }
    }

    // إنشاء الكتاب
    const newBook = await Book.create({
      title,
      author,
      category: category._id, // ✅ استخدم الـ ID من البحث
      description,
      availabilityStatus: availabilityStatus || 'متوفر',
      totalCopies,
      availableCopies: availableCopies || totalCopies,
      publicationYear,
      coverImageUrl,
      pdfUrl,
      rating: rating || 0
    });

    await newBook.populate('category', 'name description');

    // تحديث عدد الكتب في التصنيف
    await Category.findByIdAndUpdate(category._id, { $inc: { booksCount: 1 } });

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء الكتاب بنجاح',
      book: newBook
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الكتاب',
      error: error.message
    });
  }
};

// PUT تحديث كتاب
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      category,
      description,
      availabilityStatus,
      totalCopies,
      availableCopies,
      publicationYear,
      rating
    } = req.body;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب غير موجود'
      });
    }

    // تحديث البيانات
    if (title) book.title = title;
    if (author) book.author = author;
    if (description) book.description = description;
    if (availabilityStatus) book.availabilityStatus = availabilityStatus;
    if (totalCopies) book.totalCopies = totalCopies;
    if (availableCopies !== undefined) book.availableCopies = availableCopies;
    if (publicationYear) book.publicationYear = publicationYear;
    if (rating) book.rating = rating;

    // تحديث صورة الغلاف إذا وجدت
    if (req.files && req.files.coverImage) {
      const uploadResult = await uploadImage(
        req.files.coverImage[0].buffer,
        `book-cover-update-${Date.now()}`
      );
      book.coverImageUrl = uploadResult.secure_url;
    }

    // تحديث ملف PDF إذا وجد
    if (req.files && req.files.bookPdf) {
      const uploadResult = await uploadPDF(
        req.files.bookPdf[0].buffer,
        `book-pdf-update-${Date.now()}`
      );
      book.pdfUrl = uploadResult.secure_url;
    }

    await book.save();

    return res.status(200).json({
      success: true,
      message: 'تم تحديث الكتاب بنجاح',
      book
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الكتاب',
      error: error.message
    });
  }
};

// DELETE حذف كتاب
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

    // تحديث عدد الكتب في التصنيف
    if (book.category) {
      await Category.findByIdAndUpdate(book.category, { $inc: { booksCount: -1 } });
    }

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