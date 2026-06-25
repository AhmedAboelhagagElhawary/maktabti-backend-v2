
# markdown مكتبتي - API Documentation
## لتطبيق الويب (React) - الإدارة

### 🔗 Base URL
https://maktabti-backend-v2-production.up.railway.app/

---

## 🔐 المصادقة (Authentication)

### 1️⃣ تسجيل الدخول (Admin Login)
POST /auth/login

**Body:**
```json
{
  "universityEmail": "admin@ci.suez.edu.eg",
  "password": "admin_password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "fullName": "أمين المكتبة",
    "role": "admin"
  }
}
```

---

## 📚 إدارة الأقسام (Admin Only)

### إنشاء قسم
POST /categories

**Headers:**
Authorization: Bearer <admin_token>

**Body:**
```json
{
  "name": "الذكاء الاصطناعي",
  "description": "دراسة الخوارزميات وتعلم الآلة",
  "iconUrl": "https://..."
}
```

---

### تحديث قسم
PUT /categories/<category_id>

---

### حذف قسم
DELETE /categories/<category_id>

---

## 📖 إدارة الكتب (Admin Only)

### إنشاء كتاب
POST /books

**Body:**
```json
{
  "title": "مقدمة في تعلم الآلة",
  "author": "أحمد محمود",
  "category": "<category_id>",
  "description": "كتاب شامل",
  "availabilityStatus": "متوفر",
  "totalCopies": 5,
  "availableCopies": 5,
  "publicationYear": 2023,
  "coverImageUrl": "https://...",
  "pdfUrl": "https://...",
  "rating": 4.5
}
```

---

### تحديث كتاب
PUT /books/<book_id>

---

### حذف كتاب
DELETE /books/<book_id>

---

## 🎓 مراجعة المشاريع (Admin Only)

### جلب جميع المشاريع (بما فيها قيد المراجعة)
GET /projects

**Note:** يرى Admin جميع المشاريع بجميع الحالات

---

### تغيير حالة المشروع
PATCH /projects/<project_id>/status

**Body:**
```json
{
  "status": "مقبول"
}
```

**الحالات الممكنة:**
- `قيد المراجعة` (جديد)
- `مقبول` (يظهر للطلاب)
- `منشور` (يظهر للطلاب)
- `مرفوض` (لا يظهر)

---

### حذف مشروع
DELETE /projects/<project_id>

---

## 📋 إدارة الامتحانات (Admin Only)

### إضافة امتحان سابق
POST /exams

**Body:**
```json
{
  "courseName": "مقدمة في تعلم الآلة",
  "courseCode": "CS301",
  "examType": "ميدتيرم",
  "academicYear": "First",
  "semester": "الفصل الأول",
  "specialization": "الذكاء الاصطناعي",
  "instructor": "د. أحمد محمود",
  "examDate": "2026-05-20",
  "examPdfUrl": "https://...",
  "solutionPdfUrl": "https://..."
}
```

---

### تحديث امتحان
PUT /exams/<exam_id>

---

### حذف امتحان
DELETE /exams/<exam_id>

---

## 💾 تخزين التوكن في React

```javascript
// حفظ التوكن
localStorage.setItem('auth_token', token);

// جلب التوكن
const token = localStorage.getItem('auth_token');

// إرسال التوكن مع كل request
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

// مثال مع Axios
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://maktabti-backend-production.up.railway.app/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## ✅ Dashboard الإدارة (يجب أن يعرض)

- ✅ عدد الطلاب المسجلين
- ✅ عدد الكتب الموجودة
- ✅ المشاريع قيد المراجعة
- ✅ الأقسام المتاحة
- ✅ الامتحانات السابقة

---

## 📞 للمساعدة
 🤲🤲🤲🤲🤲 برجاء الدعاء 🤲🤲🤲🤲🤲

