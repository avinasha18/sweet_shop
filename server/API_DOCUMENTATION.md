# Sweet Shop Management System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "new_jwt_access_token"
}
```

### POST /auth/logout
Logout user (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🍭 Sweets Endpoints

### GET /sweets
Get all sweets with optional filtering and pagination.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `sort` (string, default: '-createdAt') - Sort field
- `category` (string) - Filter by category
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `q` or `search` (string) - Search term
- `inStock` (boolean) - Filter by stock availability

**Example:**
```
GET /sweets?page=1&limit=10&category=Cakes&minPrice=10&maxPrice=50&search=chocolate
```

**Response:**
```json
{
  "success": true,
  "sweets": [
    {
      "_id": "sweet_id",
      "name": "Chocolate Cake",
      "category": "Cakes",
      "price": 25.99,
      "quantity": 10,
      "description": "Delicious chocolate cake",
      "imageUrl": "https://example.com/image.jpg",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### GET /sweets/search
Dedicated search endpoint (same functionality as GET /sweets).

**Query Parameters:** Same as GET /sweets

### GET /sweets/:id
Get a specific sweet by ID.

**Response:**
```json
{
  "success": true,
  "sweet": {
    "_id": "sweet_id",
    "name": "Chocolate Cake",
    "category": "Cakes",
    "price": 25.99,
    "quantity": 10,
    "description": "Delicious chocolate cake",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### POST /sweets
Create a new sweet (Admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Request Body:**
```json
{
  "name": "New Sweet",
  "category": "Cakes",
  "price": 15.99,
  "quantity": 20,
  "description": "Description of the sweet",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sweet created successfully",
  "sweet": {
    "_id": "sweet_id",
    "name": "New Sweet",
    "category": "Cakes",
    "price": 15.99,
    "quantity": 20,
    "description": "Description of the sweet",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### PUT /sweets/:id
Update a sweet (Admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Request Body:**
```json
{
  "name": "Updated Sweet Name",
  "price": 19.99,
  "quantity": 25
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sweet updated successfully",
  "sweet": {
    "_id": "sweet_id",
    "name": "Updated Sweet Name",
    "category": "Cakes",
    "price": 19.99,
    "quantity": 25,
    "description": "Description of the sweet",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### DELETE /sweets/:id
Delete a sweet (Admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Sweet deleted successfully"
}
```

---

## 📦 Inventory Endpoints

### POST /sweets/:id/purchase
Purchase a sweet (decreases quantity).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Purchase completed successfully",
  "sweet": {
    "_id": "sweet_id",
    "name": "Chocolate Cake",
    "quantity": 8
  },
  "order": {
    "_id": "order_id",
    "userId": "user_id",
    "sweetId": "sweet_id",
    "quantity": 2,
    "priceAtPurchase": 25.99,
    "totalAmount": 51.98,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### POST /sweets/:id/restock
Restock a sweet (Admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Request Body:**
```json
{
  "quantity": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sweet restocked successfully",
  "sweet": {
    "_id": "sweet_id",
    "name": "Chocolate Cake",
    "quantity": 20
  }
}
```

---

## 🏷️ Sweet Categories
- Cakes
- Candy
- Cookies
- Chocolates
- Ice Cream
- Pastries
- Other

---

## 🔒 User Roles
- **user**: Can browse, search, and purchase sweets
- **admin**: Can perform all user actions plus create, update, delete, and restock sweets

---

## 📊 Error Responses
All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Test Credentials

**Admin User:**
- Email: `admin@sweetshop.com`
- Password: `admin123`

**Regular User:**
- Email: `john@sweetshop.com`
- Password: `user123`
