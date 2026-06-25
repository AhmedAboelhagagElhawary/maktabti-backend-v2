const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // اتصل بـ MongoDB باستخدام الـ URI من ملف .env
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error.message);
    process.exit(1); // إيقاف البرنامج إذا فشل الاتصال
  }
};

module.exports = connectDB;