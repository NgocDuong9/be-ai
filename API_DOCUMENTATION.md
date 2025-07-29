# Watch Store API Documentation

## Tổng quan

RESTful API backend cho website bán đồng hồ được xây dựng bằng NestJS và MongoDB.

## Base URL
```
http://localhost:3000/api
```

## Authentication

API sử dụng JWT (JSON Web Token) để xác thực. Sau khi đăng nhập thành công, bạn sẽ nhận được một token. Token này cần được gửi trong header `Authorization` với format:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### 1. Đăng ký người dùng
- **URL:** `POST /auth/register`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Tên người dùng"
}
```
- **Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "Tên người dùng"
  },
  "token": "jwt_token"
}
```

#### 2. Đăng nhập
- **URL:** `POST /auth/login`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "Tên người dùng"
  },
  "token": "jwt_token"
}
```

#### 3. Lấy thông tin profile
- **URL:** `GET /auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "_id": "user_id",
  "email": "user@example.com",
  "name": "Tên người dùng",
  "role": "user"
}
```

### Categories (Danh mục)

#### 1. Lấy danh sách danh mục
- **URL:** `GET /categories`
- **Response:**
```json
[
  {
    "_id": "category_id",
    "name": "Đồng hồ nam",
    "description": "Mô tả danh mục",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 2. Lấy thông tin một danh mục
- **URL:** `GET /categories/:id`
- **Response:** Tương tự như trên

#### 3. Tạo danh mục mới (Cần authentication)
- **URL:** `POST /categories`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Đồng hồ nữ",
  "description": "Mô tả danh mục",
  "isActive": true
}
```

#### 4. Cập nhật danh mục (Cần authentication)
- **URL:** `PATCH /categories/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Tương tự như tạo mới

#### 5. Xóa danh mục (Cần authentication)
- **URL:** `DELETE /categories/:id`
- **Headers:** `Authorization: Bearer <token>`

### Products (Sản phẩm)

#### 1. Lấy danh sách sản phẩm (có filtering)
- **URL:** `GET /products`
- **Query Parameters:**
  - `category`: ID danh mục
  - `brand`: Thương hiệu
  - `minPrice`: Giá tối thiểu
  - `maxPrice`: Giá tối đa
  - `search`: Tìm kiếm theo tên, mô tả, thương hiệu
  - `page`: Trang (mặc định: 1)
  - `limit`: Số lượng mỗi trang (mặc định: 10)
  - `sortBy`: Sắp xếp theo (mặc định: createdAt)
  - `sortOrder`: Thứ tự sắp xếp (asc/desc, mặc định: desc)

- **Example:** `GET /products?category=nam&minPrice=100&maxPrice=5000&page=1&limit=10`

- **Response:**
```json
{
  "products": [
    {
      "_id": "product_id",
      "name": "Đồng hồ Rolex",
      "description": "Mô tả sản phẩm",
      "price": 1000000,
      "category": {
        "_id": "category_id",
        "name": "Đồng hồ nam"
      },
      "images": ["/uploads/image1.jpg"],
      "stock": 10,
      "brand": "Rolex",
      "isActive": true,
      "sold": 5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### 2. Lấy thông tin một sản phẩm
- **URL:** `GET /products/:id`

#### 3. Tạo sản phẩm mới (Cần authentication)
- **URL:** `POST /products`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Đồng hồ Casio",
  "description": "Mô tả sản phẩm",
  "price": 500000,
  "category": "category_id",
  "stock": 20,
  "brand": "Casio",
  "isActive": true
}
```

#### 4. Cập nhật sản phẩm (Cần authentication)
- **URL:** `PATCH /products/:id`
- **Headers:** `Authorization: Bearer <token>`

#### 5. Xóa sản phẩm (Cần authentication)
- **URL:** `DELETE /products/:id`
- **Headers:** `Authorization: Bearer <token>`

#### 6. Upload ảnh sản phẩm (Cần authentication)
- **URL:** `POST /products/:id/upload-image`
- **Headers:** `Authorization: Bearer <token>`
- **Content-Type:** `multipart/form-data`
- **Body:** Form data với field `image`

#### 7. Xóa ảnh sản phẩm (Cần authentication)
- **URL:** `DELETE /products/:id/images`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "imagePath": "/uploads/image1.jpg"
}
```

### Cart (Giỏ hàng)

#### 1. Thêm sản phẩm vào giỏ hàng
- **URL:** `POST /cart`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "productId": "product_id",
  "quantity": 2
}
```

#### 2. Lấy giỏ hàng
- **URL:** `GET /cart`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "items": [
    {
      "_id": "cart_item_id",
      "product": {
        "_id": "product_id",
        "name": "Đồng hồ Rolex",
        "price": 1000000,
        "images": ["/uploads/image1.jpg"],
        "stock": 10,
        "category": {
          "_id": "category_id",
          "name": "Đồng hồ nam"
        }
      },
      "quantity": 2,
      "subtotal": 2000000
    }
  ],
  "total": 2000000,
  "itemCount": 1
}
```

#### 3. Lấy số lượng items trong giỏ hàng
- **URL:** `GET /cart/count`
- **Headers:** `Authorization: Bearer <token>`

#### 4. Cập nhật số lượng sản phẩm trong giỏ hàng
- **URL:** `PATCH /cart/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "quantity": 3
}
```

#### 5. Xóa sản phẩm khỏi giỏ hàng
- **URL:** `DELETE /cart/:id`
- **Headers:** `Authorization: Bearer <token>`

#### 6. Xóa toàn bộ giỏ hàng
- **URL:** `DELETE /cart`
- **Headers:** `Authorization: Bearer <token>`

### Orders (Đơn hàng)

#### 1. Tạo đơn hàng từ giỏ hàng
- **URL:** `POST /orders`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "shippingAddress": "Địa chỉ giao hàng",
  "notes": "Ghi chú đơn hàng"
}
```

#### 2. Lấy danh sách đơn hàng của user
- **URL:** `GET /orders/my-orders`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page`: Trang (mặc định: 1)
  - `limit`: Số lượng mỗi trang (mặc định: 10)

#### 3. Lấy thông tin một đơn hàng
- **URL:** `GET /orders/:id`
- **Headers:** `Authorization: Bearer <token>`

#### 4. Lấy tất cả đơn hàng (Admin)
- **URL:** `GET /orders/admin/all`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:** `page`, `limit`

#### 5. Lấy thống kê đơn hàng (Admin)
- **URL:** `GET /orders/admin/stats`
- **Headers:** `Authorization: Bearer <token>`

#### 6. Cập nhật trạng thái đơn hàng (Admin)
- **URL:** `PATCH /orders/:id/status`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "status": "confirmed"
}
```

**Các trạng thái đơn hàng:**
- `pending`: Chờ xác nhận
- `confirmed`: Đã xác nhận
- `processing`: Đang xử lý
- `shipped`: Đã gửi hàng
- `delivered`: Đã giao hàng
- `cancelled`: Đã hủy

## Error Responses

API trả về các mã lỗi HTTP chuẩn:

- `400 Bad Request`: Dữ liệu đầu vào không hợp lệ
- `401 Unauthorized`: Chưa xác thực hoặc token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy tài nguyên
- `409 Conflict`: Xung đột dữ liệu (ví dụ: email đã tồn tại)
- `500 Internal Server Error`: Lỗi server

**Format lỗi:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Validation Rules

### User Registration
- Email: Phải là email hợp lệ và duy nhất
- Password: Tối thiểu 6 ký tự
- Name: Bắt buộc

### Product
- Name: Bắt buộc
- Price: Số dương
- Stock: Số không âm
- Category: Phải tồn tại trong database

### Cart
- Quantity: Số nguyên dương
- Product: Phải tồn tại và còn hàng

## File Upload

- **Supported formats:** JPG, JPEG, PNG, GIF
- **Max file size:** 5MB
- **Upload path:** `/uploads/`
- **File naming:** `product-{timestamp}-{random}.{ext}`

## Notes

- Tất cả timestamps được trả về theo format ISO 8601
- Pagination bắt đầu từ page 1
- Soft delete được sử dụng cho categories và products (isActive: false)
- Stock được tự động cập nhật khi tạo/hủy đơn hàng
- CORS được enable cho tất cả origins

