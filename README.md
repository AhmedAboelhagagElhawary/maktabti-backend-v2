# مكتبتي - Maktabti
## نظام إدارة مكتبة ذكي (Smart Library Management System)

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📖 نبذة عن المشروع

**مكتبتي** هو نظام شامل لإدارة المكتبة الجامعية يوفر:

- 📚 **إدارة الكتب**: إضافة وتعديل وحذف الكتب مع صور وملفات PDF
- 📝 **إدارة الامتحانات**: حفظ الامتحانات والحلول مع تنظيم حسب المادة
- 🎓 **إدارة المشاريع**: عرض وموافقة على مشاريع الطلاب مع ملفات التوثيق
- 👥 **نظام المستخدمين**: طلاب وأداريون مع صلاحيات مختلفة
- 🔐 **نظام الأمان**: التحقق من البريد، كلمات مرور قوية، JWT Tokens

---

## 🏗️ البنية المعمارية

### Architecture Diagram:

```
┌─────────────────────────────────────────────────────────────┐
│                      USERS                                  │
│           Flutter App (Students) | React Web (Admin)        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)               │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              API Routes Layer                        │ │
│  │  • Auth (Signup, Login, OTP, Password Reset)       │ │
│  │  • Books (CRUD Operations)                         │ │
│  │  • Exams (CRUD Operations)                         │ │
│  │  • Projects (CRUD + Status Management)             │ │
│  │  • Categories (CRUD Operations)                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                     │                                       │
│  ┌──────────────────┴──────────────────────────────────┐ │
│  │          Controllers & Business Logic              │ │
│  └───────────────────────────────────────────────────┘ │
│                     │                                       │
│  ┌──────────────────┴──────────────────────────────────┐ │
│  │         Middlewares (Auth, File Upload)            │ │
│  └───────────────────────────────────────────────────┘ │
│                     │                                       │
│  ┌──────────────────┴──────────────────────────────────┐ │
│  │         Services (Email, File Upload)              │ │
│  └───────────────────────────────────────────────────┘ │
└──────────────────┬───────────────────────────────────────┘
                   │
         ┌─────────┴──────────┬──────────────┐
         ↓                    ↓              ↓
    ┌─────────┐         ┌──────────┐   ┌──────────┐
    │ Database│         │ Cloudinary  │ SendGrid │
    │MongoDB  │         │ (Files)  │   │(Email)  │
    │ Atlas   │         └──────────┘   └──────────┘
    └─────────┘
```

---

## 🎯 المميزات الرئيسية

### 🔐 نظام الأمان:
```
✅ JWT Token-based Authentication
✅ Email Verification with OTP
✅ Password Hashing (bcrypt)
✅ Role-based Access Control (RBAC)
✅ Secure File Storage (Cloudinary)
✅ HTTPS in Production
✅ Input Validation & Sanitization
```

### 📁 إدارة الملفات:
```
✅ PDF Upload (Books, Exams, Projects)
✅ Image Upload (Book covers, Project banners)
✅ Cloudinary Integration
✅ Automatic File Processing
✅ Size Limits (10MB max)
✅ File Type Validation
```

### 👥 إدارة المستخدمين:
```
✅ Student Accounts (OTP Verification)
✅ Admin Accounts (Created by Super Admin)
✅ Forced Password Change on First Login
✅ Profile Management
✅ Role-based Features
```

---

## 📊 تدفق البيانات

### تسجيل طالب جديد:

```
Student                          Backend                  Database
  │                                 │                        │
  ├─ Signup ────────────────────────>│                        │
  │  (email, password, data)        │                        │
  │                                 ├─ Hash Password         │
  │                                 ├─ Create User           │
  │                                 ├─ Generate OTP ────────>│
  │                                 ├─ Send Email            │
  │<──── OTP Request ───────────────┤                        │
  │                                 │                        │
  ├─ Verify OTP ──────────────────>│                        │
  │  (email, otp)                   ├─ Check OTP             │
  │                                 ├─ Update verified field>│
  │<─── Token + User Data ─────────┤                        │
  │                                 │                        │
  ✅ تم التسجيل!
```

### إنشاء Admin جديد (Super Admin):

```
Super Admin                      Backend                  Database
  │                                 │                        │
  ├─ Create Admin ─────────────────>│                        │
  │  (name, email, phone)          │                        │
  │                                 ├─ Generate Temp Password│
  │                                 ├─ Hash Password         │
  │                                 ├─ Create Admin Account ─>│
  │                                 ├─ Send Email            │
  │<─── Success Response ──────────┤                        │
  │                                 │                        │
  │                          Admin يستقبل بريد
  │                                 │
  Admin                            │
  │                                 │
  ├─ Login ────────────────────────>│
  │  (email, temp password)         ├─ Verify Credentials    │
  │                                 ├─ Check isFirstLogin    │
  │<─── Token + isFirstLogin=true ─┤                        │
  │                                 │                        │
  ├─ Change Password ──────────────>│                        │
  │  (current, new)                 ├─ Verify Current Pass   │
  │                                 ├─ Hash New Password     │
  │                                 ├─ Update + set false ──>│
  │<──── Success ───────────────────┤                        │
  │                                 │                        │
  ✅ Admin جاهز للعمل!
```

### إنشاء مشروع مع ملفات:

```
Student                       Backend              Cloudinary      Database
  │                              │                      │              │
  ├─ Create Project ────────────>│                      │              │
  │  (title, data, files)        │                      │              │
  │                              ├─ Upload PDF ────────>│              │
  │                              |<─ PDF URL ──────────┤              │
  │                              │                      │              │
  │                              ├─ Upload Image ─────>│              │
  │                              |<─ Image URL ────────┤              │
  │                              │                      │              │
  │                              ├─ Create Project ────────────────────>│
  │<─── Success Response ────────┤                      │              │
  │   (with URLs)                │                      │              │
```

---

## 🛠️ Tech Stack

### Backend:
```
Framework:     Node.js + Express.js
Database:      MongoDB Atlas
File Storage:  Cloudinary
Email Service: SendGrid
Deployment:    Railway
```

### Frontend:
```
Mobile:        Flutter (Dart)
Web Admin:     React (JavaScript)
State Mgmt:    React Hooks / shared_preferences
HTTP Client:   Dio (Flutter) / Axios (React)
```

### Libraries & Tools:
```
Backend:
  • mongoose: MongoDB ODM
  • bcryptjs: Password hashing
  • jsonwebtoken: JWT tokens
  • multer: File upload handling
  • cloudinary: File storage
  • @sendgrid/mail: Email service
  • cors: Cross-origin requests
  • dotenv: Environment variables

Frontend:
  • http/dio: HTTP requests
  • image_picker: Photo selection
  • file_picker: File selection
  • shared_preferences: Local storage
  • axios: HTTP requests (React)
  • react-router: Navigation (React)
```

---

## 📚 الملفات والمجلدات

```
maktabti-backend-v2/
├── config/
│   ├── database.js          # MongoDB connection
│   └── cloudinary.js        # Cloudinary configuration
│
├── models/
│   ├── User.js              # User schema (Students, Admins)
│   ├── Book.js              # Book schema
│   ├── Exam.js              # Exam schema
│   ├── Project.js           # Project schema
│   └── Category.js          # Category schema
│
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── bookController.js    # Book operations
│   ├── examController.js    # Exam operations
│   ├── projectController.js # Project operations
│   └── categoryController.js # Category operations
│
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── bookRoutes.js        # Book endpoints
│   ├── examRoutes.js        # Exam endpoints
│   ├── projectRoutes.js     # Project endpoints
│   └── categoryRoutes.js    # Category endpoints
│
├── middlewares/
│   ├── auth.js              # JWT verification
│   └── fileUpload.js        # File upload handling
│
├── utils/
│   ├── generateToken.js     # JWT token generation
│   ├── emailService.js      # Email functions
│   └── uploadService.js     # File upload functions
│
├── server.js                # Main server file
├── .env                      # Environment variables
├── .env.example             # Example env file
└── README.md                # This file
```

---

## 🚀 الإعداد والتشغيل

### متطلبات النظام:
```
Node.js: v16+
npm: v8+
MongoDB Atlas: Account مع Database
Cloudinary: Account
SendGrid: API Key
```

### خطوات التثبيت:

**1. استنساخ المشروع:**
```bash
git clone https://github.com/YourUsername/maktabti-backend-v2.git
cd maktabti-backend-v2
```

**2. تثبيت المكتبات:**
```bash
npm install
```

**3. إنشاء ملف `.env`:**
```bash
cp .env.example .env
```

**4. ملء متغيرات البيئة:**
```
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
NODE_ENV=development
SENDGRID_API_KEY=SG.xxx...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**5. تشغيل في Development:**
```bash
npm run dev
```

**6. تشغيل في Production:**
```bash
npm start
```

---

## 📖 Documentation Links

- 📘 **React Admin Guide**: [API_DOCS_REACT_ADMIN_V1.md](./API_DOCS_REACT_ADMIN_V1.md)
  - تسجيل دخول Admin
  - إنشاء Admin جديد
  - إدارة الكتب والامتحانات
  - موافقة المشاريع

- 📗 **Flutter Guide**: [API_DOCS_FLUTTER_V2.md](./API_DOCS_FLUTTER_V2.md)
  - تسجيل الطلاب
  - التحقق من OTP
  - إنشاء مشاريع
  - عرض الكتب والامتحانات

---

## 🔌 API Endpoints

### Authentication:
```
POST   /api/auth/signup              # تسجيل جديد
POST   /api/auth/login               # تسجيل دخول
POST   /api/auth/verify-otp          # التحقق من OTP
POST   /api/auth/resend-otp          # إعادة إرسال OTP
POST   /api/auth/forgot-password     # نسيان الكلمة
POST   /api/auth/reset-password      # إعادة تعيين الكلمة
POST   /api/auth/change-password     # تغيير الكلمة
POST   /api/auth/admin/create        # إنشاء Admin (Super Admin only)
GET    /api/auth/me                  # البيانات الشخصية
```

### Books:
```
GET    /api/books                    # جميع الكتب
GET    /api/books/:id                # كتاب واحد
POST   /api/books                    # إنشاء كتاب (Admin)
PUT    /api/books/:id                # تعديل كتاب (Admin)
DELETE /api/books/:id                # حذف كتاب (Admin)
```

### Exams:
```
GET    /api/exams                    # جميع الامتحانات
GET    /api/exams/:id                # امتحان واحد
POST   /api/exams                    # إنشاء امتحان (Admin)
PUT    /api/exams/:id                # تعديل امتحان (Admin)
DELETE /api/exams/:id                # حذف امتحان (Admin)
```

### Projects:
```
GET    /api/projects                 # جميع المشاريع
GET    /api/projects/:id             # مشروع واحد
POST   /api/projects                 # إنشاء مشروع (Student)
PUT    /api/projects/:id             # تعديل مشروع (Owner/Admin)
DELETE /api/projects/:id             # حذف مشروع (Owner/Admin)
PATCH  /api/projects/:id/status      # تغيير حالة مشروع (Admin)
```

### Categories:
```
GET    /api/categories               # جميع التصنيفات
GET    /api/categories/:id           # تصنيف واحد
POST   /api/categories               # إنشاء تصنيف (Admin)
PUT    /api/categories/:id           # تعديل تصنيف (Admin)
DELETE /api/categories/:id           # حذف تصنيف (Admin)
```

---

## 🔒 معايير الأمان

### تمت معالجة:
- ✅ CORS للتطبيقات الخارجية
- ✅ Rate limiting على Authentication endpoints
- ✅ Input validation على جميع الـ endpoints
- ✅ SQL Injection protection (استخدام Mongoose)
- ✅ XSS protection (sanitization)
- ✅ HTTPS في Production
- ✅ Environment variables للـ secrets
- ✅ Password hashing مع salt rounds
- ✅ JWT expiration (7 أيام)
- ✅ Role-based access control

---

## 🧪 Testing

### اختبار الـ Backend:

```bash
# استخدم Postman أو cURL

# مثال - تسجيل جديد:
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "أحمد محمد",
    "universityEmail": "student@ci.suez.edu.eg",
    "phoneNumber": "01012345678",
    "academicMajor": "الذكاء الاصطناعي",
    "academicYear": "First",
    "password": "password123"
  }'
```

---

## 📈 الإحصائيات

| Feature | Status |
|---------|--------|
| User Authentication | ✅ Complete |
| Email Verification | ✅ Complete |
| File Upload | ✅ Complete |
| CRUD Operations | ✅ Complete |
| Admin Features | ✅ Complete |
| Error Handling | ✅ Complete |
| Documentation | ✅ Complete |
| Testing | ✅ Passed |
| Deployment | ✅ Live |

---

## 🐛 معالجة المشاكل الشائعة

### مشكلة: "Cannot find module"
```
الحل: npm install
```

### مشكلة: "Port already in use"
```
الحل: thaw PORT=3000 npm run dev
```

### مشكلة: "MongoDB connection failed"
```
تأكد من:
1. إنترنت متصل
2. IP address in MongoDB Atlas whitelist
3. MONGODB_URI صحيح في .env
```

### مشكلة: "Cloudinary upload failed"
```
تأكد من:
1. Cloudinary credentials صحيحة
2. حجم الملف < 10MB
3. نوع الملف مدعوم
```

---

## 📞 الدعم والمساعدة

```
Email: aboelhagagahmed3@gmail.com
GitHub: https://github.com/AhmedAboelhagagElhawary/maktabti-backend-v2
Issues: https://github.com/AhmedAboelhagagElhawary/maktabti-backend-v2/issues
```

---

## 📝 الترخيص

هذا المشروع مرخص تحت MIT License - انظر ملف LICENSE للتفاصيل.

---

## 👥 المساهمون

- **Backend Developer**: Ahmed Aboelhagag
- **Flutter Developer**: [اسم الزميل]
- **React Developer**: [اسم الزميل]

---

## 🙏 شكراً!

شكراً لاستخدام مكتبتي! نتمنى لك تجربة رائعة.

**Happy Coding! 🚀**

---

**آخر تحديث**: يونيو 2026
**الإصدار**: 2.0.0 (Production Ready)