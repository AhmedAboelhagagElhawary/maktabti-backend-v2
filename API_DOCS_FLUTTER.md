# markdown مكتبتي - API Documentation
## للتطبيق الموبايل (Flutter) - الطلاب

### 🔗 Base URL
https://maktabti-backend-v2-production.up.railway.app/i

---

## 🔐 المصادقة (Authentication)

### 1️⃣ التسجيل (Sign Up)
POST /auth/signup

**Body:**
```json
{
  "fullName": "أحمد محمد",
  "universityEmail": "ahmed@ci.suez.edu.eg",
  "personalEmail": "ahmed@gmail.com",
  "phoneNumber": "01012345678",
  "academicMajor": "الذكاء الاصطناعي",
  "academicYear": "First",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "تم التسجيل بنجاح!",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "fullName": "أحمد محمد",
    "universityEmail": "ahmed@ci.suez.edu.eg",
    "role": "student"
  }
}
```

**Errors:**
- `400`: حقول مفقودة
- `409`: البريد مسجل بالفعل

---

### 2️⃣ تسجيل الدخول (Login)
POST /auth/login

**Body:**
```json
{
  "universityEmail": "ahmed@ci.suez.edu.eg",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح!",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "fullName": "أحمد محمد",
    "role": "student"
  }
}
```

---

### 3️⃣ بيانات المستخدم الحالي
GET /auth/me

**Headers:**
Authorization: Bearer <your_token>

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "fullName": "أحمد محمد",
    "universityEmail": "ahmed@ci.suez.edu.eg",
    "phoneNumber": "01012345678",
    "academicMajor": "الذكاء الاصطناعي",
    "academicYear": "First",
    "role": "student"
  }
}
```

---

## 📚 الأقسام (Categories)

### جلب جميع الأقسام
GET /categories

**Response:**
```json
{
  "success": true,
  "count": 3,
  "categories": [
    {
      "_id": "...",
      "name": "الذكاء الاصطناعي",
      "description": "دراسة الخوارزميات وتعلم الآلة",
      "booksCount": 5
    }
  ]
}
```

---

### جلب قسم واحد
GET /categories/<category_id>

---

## 📖 الكتب (Books)

### جلب جميع الكتب
GET /books

**Query Parameters (اختياري):**
GET /books?categoryId=<id>

**Response:**
```json
{
  "success": true,
  "count": 10,
  "books": [
    {
      "_id": "...",
      "title": "مقدمة في تعلم الآلة",
      "author": "أحمد محمود",
      "category": {
        "_id": "...",
        "name": "الذكاء الاصطناعي"
      },
      "totalCopies": 5,
      "availableCopies": 3,
      "availabilityStatus": "متوفر",
      "coverImageUrl": "...",
      "rating": 4.5
    }
  ]
}
```

---

### جلب كتاب واحد
GET /books/<book_id>

---

## 🎓 المشاريع (Projects)

### جلب جميع المشاريع المقبولة
GET /projects

**Query Parameters:**
GET /projects?specialization=الذكاء الاصطناعي

**Response:**
```json
{
  "success": true,
  "count": 5,
  "projects": [
    {
      "_id": "...",
      "title": "نظام توصيات الكتب",
      "description": "مشروع ذكاء اصطناعي",
      "specialization": "الذكاء الاصطناعي",
      "teamMembers": ["أحمد محمد", "فاطمة علي"],
      "supervisors": ["د. أحمد محمود"],
      "graduationYear": 2024,
      "status": "مقبول",
      "projectBannerUrl": "...",
      "githubLink": "...",
      "viewsCount": 25,
      "createdBy": {
        "fullName": "أحمد محمد",
        "universityEmail": "ahmed@ci.suez.edu.eg"
      }
    }
  ]
}
```

---

### إنشاء مشروع جديد
POST /projects

**Headers:**
Authorization: Bearer <your_token>

**Body:**
```json
{
  "title": "نظام إدارة المكتبات",
  "description": "مشروع تطوير نظام إدارة مكتبات ذكي",
  "specialization": "تطوير الويب",
  "teamMembers": ["أحمد محمد", "محمود علي"],
  "supervisors": ["د. نور الدين"],
  "graduationYear": 2024,
  "githubLink": "https://github.com/...",
  "documentationPdfUrl": "https://...",
  "projectBannerUrl": "https://..."
}
```

**الحالة الابتدائية:** `قيد المراجعة` (الـ Admin يراجع ويقبل)

---

### جلب مشروع واحد
GET /projects/<project_id>

---

### تحديث مشروعك
PUT /projects/<project_id>

**Headers:**
Authorization: Bearer <your_token>

**Body:** أي حقل تريد تعديله

---

### حذف مشروعك
DELETE /projects/<project_id>

**Headers:**
Authorization: Bearer <your_token>

---

## 📋 الامتحانات السابقة (Exams)

### جلب جميع الامتحانات السابقة
GET /exams

**Query Parameters:**
GET /exams?specialization=الذكاء الاصطناعي&examType=ميدتيرم

**Response:**
```json
{
  "success": true,
  "count": 8,
  "exams": [
    {
      "_id": "...",
      "courseName": "مقدمة في تعلم الآلة",
      "courseCode": "CS301",
      "examType": "ميدتيرم",
      "academicYear": "First",
      "semester": "الفصل الأول",
      "specialization": "الذكاء الاصطناعي",
      "instructor": "د. أحمد محمود",
      "examDate": "2026-05-20",
      "examPdfUrl": "https://...",
      "solutionPdfUrl": "https://...",
      "viewsCount": 45
    }
  ]
}
```

---

### جلب امتحان واحد
GET /exams/<exam_id>

---

## 💾 تخزين التوكن في Flutter

```dart
import 'package:shared_preferences/shared_preferences.dart';

// حفظ التوكن
Future<void> saveToken(String token) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString('auth_token', token);
}

// جلب التوكن
Future<String?> getToken() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('auth_token');
}

// إرسال التوكن مع كل request
String? token = await getToken();
var headers = {
  'Authorization': 'Bearer $token',
  'Content-Type': 'application/json'
};
```

---

## ⚠️ معالجة الأخطاء الشائعة

| Status Code | المعنى | الحل |
|------------|-------|------|
| 401 | توكن غير صحيح | سجّل الدخول مجدداً |
| 403 | لا توجد صلاحية | لا يمكنك تعديل/حذف هذا |
| 404 | غير موجود | تحقق من الـ ID |
| 409 | موجود بالفعل | اسم المادة مكرر مثلاً |
| 500 | خطأ في السيرفر | حاول لاحقاً |

---

## 📞 للمساعدة
 🤲🤲🤲🤲🤲 برجاء الدعاء 🤲🤲🤲🤲🤲