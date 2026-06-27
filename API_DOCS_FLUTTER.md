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



 -----------------------------------------

 
# مكتبتي - Email Verification API Documentation
## للتطبيق الموبايل (Flutter) - نسخة 2

### 🔗 Base URL
https://maktabti-backend-v2-production.up.railway.app/api

---

## 🔐 نظام التحقق من البريد (Email Verification Flow)

### الـ Flow الكامل:

Student ينقر Signup

↓
يدخل البيانات

↓
Server يرسل OTP للبريد

↓
Student يستقبل OTP

↓
Student يدخل OTP

↓
Server يتحقق ✅

↓
Student يحصل على Token

↓
يدخل الـ App 🎉


---

## 📝 الـ Endpoints

---

## 1️⃣ تسجيل جديد (Sign Up)
POST /auth/signup

### الطلب:

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

### الحقول:

| الحقل | النوع | المتطلب | الملاحظات |
|------|------|--------|---------|
| fullName | String | ✅ | 3 أحرف على الأقل |
| universityEmail | String | ✅ | فريد، صيغة صحيحة |
| personalEmail | String | ❌ | اختياري |
| phoneNumber | String | ✅ | 10 أرقام على الأقل |
| academicMajor | String | ✅ | أي نص (تخصص)|
| academicYear | String | ✅ | First, Second, Third, Fourth |
| password | String | ✅ | 6 أحرف على الأقل |

### الـ Academic Majors:

```
أي تخصص (String حر)

أمثلة:
- الذكاء الاصطناعي
- تطوير الويب
- تطبيقات الموبايل
- الأمن السيبراني
- قواعد البيانات
- هندسة البرمجيات
- أو أي تخصص آخر
```

### الـ Academic Years:

First
Second
Third
Fourth


### الرد (201 - نجح):

```json
{
  "success": true,
  "message": "تم التسجيل بنجاح! تحقق من بريدك للحصول على كود التحقق",
  "user": {
    "id": "6a3ebd0cee5e1a226c0793ff",
    "fullName": "أحمد محمد",
    "universityEmail": "ahmed@ci.suez.edu.eg",
    "role": "student",
    "academicMajor": "الذكاء الاصطناعي",
    "academicYear": "First"
  }
}
```

### الأخطاء:

| Status | الخطأ | الحل |
|--------|------|------|
| 400 | حقول مفقودة | أكمل جميع الحقول المطلوبة |
| 409 | البريد مسجل بالفعل | استخدم بريد آخر |
| 500 | خطأ في السيرفر | حاول لاحقاً |

### ملاحظة مهمة:
بعد Signup مباشرة:

✅ تم إنشاء الحساب

✅ تم إرسال OTP للبريد

❌ لا يمكن تسجيل الدخول حتى التحقق

---

## 2️⃣ التحقق من OTP (Verify OTP)
POST /auth/verify-otp

### الطلب:

```json
{
  "universityEmail": "ahmed@ci.suez.edu.eg",
  "otp": "123456"
}
```

### الحقول:

| الحقل | النوع | الملاحظات |
|------|------|---------|
| universityEmail | String | نفس البريد من Signup |
| otp | String | 6 أرقام |

### الرد (200 - نجح):

```json
{
  "success": true,
  "message": "تم التحقق من البريد بنجاح!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6a3ebd0cee5e1a226c0793ff",
    "fullName": "أحمد محمد",
    "universityEmail": "ahmed@ci.suez.edu.eg",
    "role": "student",
    "academicMajor": "الذكاء الاصطناعي",
    "academicYear": "First"
  }
}
```

### الأخطاء:

| Status | الخطأ | الحل |
|--------|------|------|
| 400 | OTP غير صحيح | تحقق من الرقم |
| 400 | انتهت صلاحية الكود | اطلب كود جديد |
| 404 | المستخدم غير موجود | أنشئ حساب جديد |
| 500 | خطأ في السيرفر | حاول لاحقاً |

### بعد النجاح:
✅ احفظ Token

✅ أدخل الـ App

✅ استخدم Token في جميع الطلبات

---

## 3️⃣ إعادة إرسال OTP (Resend OTP)
POST /auth/resend-otp

### الطلب:

```json
{
  "universityEmail": "ahmed@ci.suez.edu.eg"
}
```

### الرد (200 - نجح):

```json
{
  "success": true,
  "message": "تم إرسال كود جديد إلى بريدك"
}
```

### الأخطاء:

| Status | الخطأ | الحل |
|--------|------|------|
| 400 | تم التحقق بالفعل | روح لـ Login |
| 404 | المستخدم غير موجود | أنشئ حساب جديد |
| 500 | خطأ في الإرسال | حاول لاحقاً |

---

## 4️⃣ نسيان كلمة المرور (Forgot Password)
POST /auth/forgot-password

### الطلب:

```json
{
  "universityEmail": "ahmed@ci.suez.edu.eg"
}
```

### الرد (200 - نجح):

```json
{
  "success": true,
  "message": "تم إرسال كود إعادة التعيين إلى بريدك"
}
```

### الأخطاء:

| Status | الخطأ | الحل |
|--------|------|------|
| 400 | البريد مفقود | أدخل البريع |
| 404 | المستخدم غير موجود | تحقق من البريع |
| 500 | خطأ في الإرسال | حاول لاحقاً |

### الخطوات بعد النجاح:

Student استقبل OTP في البريع
Student يدخل البريع والـ OTP وكلمة مرور جديدة
Server يتحقق
كلمة المرور تتغير ✅


---

## 5️⃣ إعادة تعيين كلمة المرور (Reset Password)
POST /auth/reset-password

### الطلب:

```json
{
  "universityEmail": "ahmed@ci.suez.edu.eg",
  "otp": "654321",
  "newPassword": "newpassword123"
}
```

### الحقول:

| الحقل | النوع | الملاحظات |
|------|------|---------|
| universityEmail | String | نفس البريد |
| otp | String | من الرسالة |
| newPassword | String | 6 أحرف على الأقل |

### الرد (200 - نجح):

```json
{
  "success": true,
  "message": "تم إعادة تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة"
}
```

### الأخطاء:

| Status | الخطأ | الحل |
|--------|------|------|
| 400 | OTP غير صحيح | تحقق من الرقم |
| 400 | انتهت صلاحية الكود | اطلب كود جديد |
| 400 | كلمة مرور ضعيفة | 6 أحرف على الأقل |
| 404 | المستخدم غير موجود | تحقق من البريع |
| 500 | خطأ في السيرفر | حاول لاحقاً |

---

## 6️⃣ تسجيل الدخول (Login)
POST /auth/login

### الطلب:

```json
{
  "universityEmail": "ahmed@ci.suez.edu.eg",
  "password": "password123"
}
```

### الرد (200 - نجح):

```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6a3ebd0cee5e1a226c0793ff",
    "fullName": "أحمد محمد",
    "universityEmail": "ahmed@ci.suez.edu.eg",
    "role": "student"
  }
}
```

### الأخطاء:

| Status | الخطأ | الحل |
|--------|------|------|
| 401 | بيانات خاطئة | تحقق من البريع وكلمة المرور |
| 403 | لم تتحقق من البريع | تحقق من البريع أولاً |
| 403 | الحساب معطل | اتصل بالدعم |

---

## 7️⃣ الحصول على بيانات المستخدم (Get Me)
GET /auth/me

### الطلب:
Headers:

Authorization: Bearer <your_token>

### الرد (200 - نجح):

```json
{
  "success": true,
  "user": {
    "_id": "6a3ebd0cee5e1a226c0793ff",
    "fullName": "أحمد محمد",
    "universityEmail": "ahmed@ci.suez.edu.eg",
    "personalEmail": "ahmed@gmail.com",
    "phoneNumber": "01012345678",
    "academicMajor": "الذكاء الاصطناعي",
    "academicYear": "First",
    "role": "student",
    "isEmailVerified": true,
    "isActive": true,
    "createdAt": "2026-06-27T09:00:00Z",
    "updatedAt": "2026-06-27T09:05:00Z"
  }
}
```

### الأخطاء:

| Status | الخطأ | الحل |
|--------|------|------|
| 401 | التوكن مفقود | سجّل الدخول |
| 401 | التوكن غير صحيح | سجّل الدخول مجدداً |
| 404 | المستخدم غير موجود | حاول لاحقاً |

---

## 💾 تخزين التوكن في Flutter

### استخدام SharedPreferences:

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

// حذف التوكن (Logout)
Future<void> deleteToken() async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.remove('auth_token');
}
```

### إرسال التوكن مع كل request:

```dart
import 'package:http/http.dart' as http;

Future<void> makeRequest() async {
  String? token = await getToken();
  
  var headers = {
    'Authorization': 'Bearer $token',
    'Content-Type': 'application/json'
  };
  
  var response = await http.get(
    Uri.parse('https://maktabti-backend-v2-production.up.railway.app/api/categories'),
    headers: headers,
  );
}
```

---

## 🔄 الـ Flow الكامل للتطبيق

### عند فتح التطبيق أول مرة:

شاشة Splash

↓
تحقق من Token في SharedPreferences

↓
Token موجود?

├─ نعم → اذهب للـ Home

└─ لا → اذهب للـ Login/Signup


### عند Signup:

User يدخل البيانات
POST /auth/signup
Server يرسل OTP للبريع
شاشة "أدخل الـ OTP"
User يدخل الـ OTP من البريع
POST /auth/verify-otp
احفظ Token
اذهب للـ Home ✅


### عند Forgot Password:

User اختار "نسيت كلمة المرور"
أدخل البريع
POST /auth/forgot-password
Server يرسل OTP
شاشة "أدخل الـ OTP وكلمة مرور جديدة"
POST /auth/reset-password
رسالة نجاح
اذهب للـ Login ✅


---

## 🆘 معالجة الأخطاء

### في Flutter:

```dart
try {
  var response = await http.post(
    Uri.parse('$baseUrl/auth/signup'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(signupData),
  );
  
  if (response.statusCode == 201) {
    print('✅ نجح التسجيل');
  } else {
    var error = jsonDecode(response.body);
    print('❌ ${error['message']}');
  }
} catch (e) {
  print('❌ خطأ: $e');
  // اعرض رسالة للمستخدم
}
```

---

## ⏰ مدة صلاحية OTP
⏳ 10 دقائق فقط
بعد 10 دقائق:

❌ لا يمكن استخدام OTP

✅ اطلب OTP جديد (Resend OTP)

---

## 🔒 ملاحظات أمان مهمة

❌ لا تحفظ Password
✅ احفظ Token فقط
❌ لا تتركibre Token في اللوج
✅ احذفه عند Logout
❌ لا تشارك Token مع أحد
✅ استخدمه بـ HTTPS فقط


---

## 📞 في حالة المشاكل
❌ "التوكن انتهى صلاحيته"

→ سجّل الدخول مجدداً
❌ "OTP غير صحيح"

→ تحقق من الرقم من البريع
❌ "البريع مسجل بالفعل"

→ استخدم بريع آخر أو Forgot Password
❌ "خطأ في الاتصال"

→ تحقق من الإنترنت

---

## 🎉 أنت جاهز!
✅ All Endpoints شغالة

✅ Documentation كاملة

✅ Ready for Production

✅ Start Building! 🚀

---

## 📱 Contact Support
Email: aboelhagagahmed3@gmail.com


