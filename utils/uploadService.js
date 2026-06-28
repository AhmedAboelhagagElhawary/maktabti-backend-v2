const cloudinary = require('../config/cloudinary');

// دالة لـ upload PDF أو صورة
const uploadFile = async (fileBuffer, fileName, resourceType = 'auto') => {
  try {
    // إزالة الامتداد من الاسم
    const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
    const uniqueName = `maktabti/${Date.now()}-${nameWithoutExtension}`;
    
    console.log(`\n📤 Uploading: ${fileName}`);
    console.log(`   Public ID: ${uniqueName}`);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          public_id: uniqueName, // ✅ بدون امتداد
          folder: 'maktabti/files'
        },
        (error, result) => {
          if (error) {
            console.error('❌ Upload error:', error.message);
            reject(error);
          } else {
            console.log('✅ File uploaded successfully');
            console.log(`   URL: ${result.secure_url}`);
            resolve(result);
          }
        }
      );

      uploadStream.end(fileBuffer);
    });

  } catch (error) {
    console.error('❌ Upload Service Error:', error);
    throw error;
  }
};

// دالة خاصة للـ PDF
const uploadPDF = async (fileBuffer, fileName) => {
  return uploadFile(fileBuffer, fileName, 'auto');
};

// دالة خاصة للصور
const uploadImage = async (fileBuffer, fileName) => {
  return uploadFile(fileBuffer, fileName, 'auto');
};

module.exports = {
  uploadFile,
  uploadPDF,
  uploadImage
};