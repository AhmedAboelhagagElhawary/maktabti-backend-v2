const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // اتصل بـ MongoDB باستخدام الـ URI من ملف .env
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to the database!');
  } catch (error) {
    console.error('❌ Database connection error: ', error.message);
    process.exit(1); // إيقاف البرنامج إذا فشل الاتصال
  }
};

module.exports = connectDB;