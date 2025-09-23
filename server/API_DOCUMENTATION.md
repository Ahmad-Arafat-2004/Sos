# API Documentation

## مرحباً! هذا التوثيق الشامل لجميع APIs الموقع 🚀

### 📋 جدول المحتويات
1. [الأساسيات](#basics)
2. [المصادقة](#authentication)
3. [APIs المنتجات](#products)
4. [APIs الفئات](#categories)
5. [APIs الطلبات](#orders)
6. [APIs الأدمن](#admin)

---

## 🔧 الأساسيات {#basics}

**Base URL**: `http://localhost:8080/api`

**Content Type**: `application/json`

**Authentication**: Bearer Token في Header
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 المصادقة {#authentication}

### تسجيل مستخدم جديد
```http
POST /api/auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "123456",
  "name": "اسم المستخدم"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "اسم المستخدم",
      "role": "user"
    },
    "token": "jwt-token-here"
  }
}
```

### تسجيل الدخول
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### الحصول على الملف الشخصي
```http
GET /api/auth/profile
Headers: Authorization: Bearer <token>
```

### تحديث الملف الشخصي
```http
PUT /api/auth/profile
Headers: Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "الاسم الجديد",
  "email": "new-email@example.com"
}
```

### تحديث التوكن
```http
POST /api/auth/refresh
Headers: Authorization: Bearer <old-token>
```

### تسجيل الخروج
```http
POST /api/auth/logout
```

---

## 🛍️ APIs المنتجات {#products}

### الحصول على جميع المنتجات
```http
GET /api/products?store=irth-biladi
```

**Query Parameters:**
- `store` (optional): `irth-biladi` or `cilka`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": {
        "en": "Product Name",
        "ar": "اسم المنتج"
      },
      "description": {
        "en": "Description",
        "ar": "الوصف"
      },
      "price": 25.99,
      "image": "image-url",
      "category": "category-id",
      "weight": "500g",
      "origin": "Lebanon",
      "store": "irth-biladi"
    }
  ]
}
```

### الحصول على منتج محدد
```http
GET /api/products/:id
```

### إضافة منتج جديد (أدمن فقط)
```http
POST /api/products
Headers: Authorization: Bearer <admin-token>
```

**Body:**
```json
{
  "name": {
    "en": "New Product",
    "ar": "منتج جديد"
  },
  "description": {
    "en": "Product description",
    "ar": "وصف المنتج"
  },
  "price": 29.99,
  "image": "image-url",
  "category": "category-id",
  "weight": "1kg",
  "origin": "Syria",
  "store": "cilka"
}
```

### تحديث منتج (أدمن فقط)
```http
PUT /api/products/:id
Headers: Authorization: Bearer <admin-token>
```

### حذف منتج (أدمن فقط)
```http
DELETE /api/products/:id
Headers: Authorization: Bearer <admin-token>
```

---

## 📂 APIs الفئات {#categories}

### الحصول على جميع الفئات
```http
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": {
        "en": "Category Name",
        "ar": "اسم الفئة"
      },
      "description": {
        "en": "Description",
        "ar": "الوصف"
      },
      "slug": "category-slug"
    }
  ]
}
```

### إضافة فئة جديدة (أدمن فقط)
```http
POST /api/categories
Headers: Authorization: Bearer <admin-token>
```

**Body:**
```json
{
  "name": {
    "en": "New Category",
    "ar": "فئة جديدة"
  },
  "description": {
    "en": "Category description",
    "ar": "وصف الفئة"
  },
  "slug": "new-category"
}
```

### تحديث فئة (أدمن فقط)
```http
PUT /api/categories/:id
Headers: Authorization: Bearer <admin-token>
```

### حذف فئة (أدمن فقط)
```http
DELETE /api/categories/:id
Headers: Authorization: Bearer <admin-token>
```

---

## 🛒 APIs الطلبات {#orders}

### إنشاء طلب جديد
```http
POST /api/orders
Headers: Authorization: Bearer <user-token>
```

**Body:**
```json
{
  "customer_name": "اسم العميل",
  "customer_email": "customer@example.com",
  "shipping_address": {
    "street": "شارع 123",
    "city": "بيروت",
    "country": "لبنان",
    "postal_code": "12345",
    "phone": "+961123456789"
  },
  "items": [
    {
      "product_id": "product-uuid",
      "quantity": 2,
      "price": 25.99
    }
  ]
}
```

### الحصول على طلبات المستخدم
```http
GET /api/orders
Headers: Authorization: Bearer <user-token>
```

### الحصول على طلب محدد
```http
GET /api/orders/:id
Headers: Authorization: Bearer <user-token>
```

---

## 👨‍💼 APIs الأدمن {#admin}

### إحصائيات اللوحة
```http
GET /api/admin/stats
Headers: Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "new_this_month": 25,
      "admins": 3
    },
    "products": {
      "total": 89,
      "by_store": {
        "irth-biladi": 45,
        "cilka": 44
      },
      "by_category": [
        {
          "category_name": "Spices",
          "count": 20
        }
      ]
    },
    "orders": {
      "total": 234,
      "total_revenue": 5480.50,
      "this_month": 45,
      "this_month_revenue": 1250.75,
      "by_status": {
        "pending": 12,
        "processing": 8,
        "shipped": 15,
        "delivered": 195,
        "cancelled": 4
      }
    },
    "categories": {
      "total": 12
    }
  }
}
```

### النشاط الحديث
```http
GET /api/admin/activity?limit=10
Headers: Authorization: Bearer <admin-token>
```

### جميع الطلبات (أدمن فقط)
```http
GET /api/admin/orders
Headers: Authorization: Bearer <admin-token>
```

### تحديث حالة الطلب
```http
PUT /api/admin/orders/:id/status
Headers: Authorization: Bearer <admin-token>
```

**Body:**
```json
{
  "status": "shipped"
}
```

**Available statuses:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`

### إدارة المستخدمين

#### الحصول على جميع المستخدمين
```http
GET /api/admin/users
Headers: Authorization: Bearer <admin-token>
```

#### تحديث دور المستخدم
```http
PUT /api/admin/users/:id/role
Headers: Authorization: Bearer <admin-token>
```

**Body:**
```json
{
  "role": "admin"
}
```

#### حذف مستخدم
```http
DELETE /api/admin/users/:id
Headers: Authorization: Bearer <admin-token>
```

---

## 🚨 رموز الاستجابة

- `200` - نجح الطلب
- `201` - تم الإنشاء بنجاح
- `400` - خطأ في البيانات المرسلة
- `401` - غير مصرح له
- `403` - ممنوع الوصول
- `404` - غير موجود
- `500` - خطأ في الخادم

---

## 📝 ملاحظات مهمة

1. **المصادقة**: معظم APIs تتطلب تسجيل الدخول
2. **الأدمن**: بعض APIs تتطلب صلاحيات أدمن
3. **التوكن**: استخدم `/api/auth/refresh` لتحديث التوكن
4. **البيانات**: جميع البيانات بصيغة JSON
5. **اللغة**: يدعم العربية والإنجليزية

---

## 🔗 أمثلة الاستخدام

### تسجيل دخول وإنشاء طلب
```javascript
// 1. تسجيل الدخول
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await loginResponse.json();
const token = data.token;

// 2. إنشاء طلب
const orderResponse = await fetch('/api/orders', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    customer_name: 'أحمد محمد',
    customer_email: 'ahmed@example.com',
    shipping_address: {
      street: 'شارع الحمرا 123',
      city: 'بيروت',
      country: 'لبنان'
    },
    items: [
      {
        product_id: 'product-123',
        quantity: 2,
        price: 25.99
      }
    ]
  })
});
```

---

**🎉 تم إنجاز Backend شامل للموقع!**

جميع APIs جاهزة للاستخدام مع:
- ✅ نظام مصادقة كامل
- ✅ إدارة المنتجات والفئات  
- ✅ نظام الطلبات
- ✅ لوحة إدارة شاملة
- ✅ إحصائيات وتقارير
- ✅ حماية وتأمين شامل
