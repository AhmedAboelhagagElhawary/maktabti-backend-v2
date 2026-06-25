const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role }, // البيانات المحفوظة في التوكن
    process.env.JWT_SECRET,       // المفتاح السري
    { expiresIn: '30d' }          // انتهاء الصلاحية بعد 30 يوم
  );
};

module.exports = generateToken;