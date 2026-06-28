const jwt = require('jsonwebtoken');

const generateToken = (userId, role, isSuperAdmin = false) => {
  return jwt.sign(
    { 
      id: userId, 
      role,
      isSuperAdmin
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: '7d'
    }
  );
};

module.exports = generateToken;  // ✅ مهم جداً!