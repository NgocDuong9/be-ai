# Watch Store API

RESTful API backend cho website bán đồng hồ được xây dựng bằng NestJS và MongoDB.

## Tính năng

- ✅ Xác thực JWT (đăng ký, đăng nhập)
- ✅ Quản lý danh mục sản phẩm (CRUD)
- ✅ Quản lý sản phẩm với filtering và pagination
- ✅ Upload ảnh sản phẩm
- ✅ Quản lý giỏ hàng
- ✅ Quản lý đơn hàng với workflow trạng thái
- ✅ Validation đầu vào với class-validator
- ✅ CORS support
- ✅ Error handling

## Công nghệ sử dụng

- **Framework:** NestJS
- **Database:** MongoDB với Mongoose
- **Authentication:** JWT
- **Validation:** class-validator, class-transformer
- **File Upload:** Multer
- **Password Hashing:** bcryptjs

## Cài đặt

### Yêu cầu hệ thống

- Node.js >= 16
- MongoDB >= 4.4
- npm hoặc yarn

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd watch-store-api
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cấu hình environment

Tạo file `.env` trong thư mục gốc:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/watch-store
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
UPLOAD_PATH=./uploads
```

### Bước 4: Khởi động MongoDB

Đảm bảo MongoDB đang chạy trên máy của bạn:

```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS với Homebrew
brew services start mongodb-community

# Windows
net start MongoDB
```

### Bước 5: Tạo thư mục uploads

```bash
mkdir uploads
```

### Bước 6: Chạy ứng dụng

#### Development mode
```bash
npm run start:dev
```

#### Production mode
```bash
npm run build
npm run start:prod
```

API sẽ chạy tại: `http://localhost:3000`

## API Documentation

Xem file [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) để biết chi tiết về các endpoints.

## Cấu trúc project

```
src/
├── auth/                 # Module xác thực
│   ├── dto/             # Data Transfer Objects
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── jwt.strategy.ts
├── categories/          # Module danh mục
├── products/           # Module sản phẩm
├── cart/              # Module giỏ hàng
├── orders/            # Module đơn hàng
├── schemas/           # MongoDB schemas
├── common/            # Shared components
│   ├── guards/        # Auth guards
│   ├── decorators/    # Custom decorators
│   └── dto/          # Common DTOs
├── app.module.ts      # Root module
└── main.ts           # Entry point
```

## Testing với Postman

### Bước 1: Import collection

Tạo collection mới trong Postman với các request sau:

### Bước 2: Thiết lập environment variables

Trong Postman, tạo environment với variables:
- `baseUrl`: `http://localhost:3000/api`
- `token`: (sẽ được set tự động sau khi login)

### Bước 3: Test workflow

1. **Đăng ký user mới:**
   ```
   POST {{baseUrl}}/auth/register
   ```

2. **Đăng nhập:**
   ```
   POST {{baseUrl}}/auth/login
   ```
   Lưu token từ response vào environment variable.

3. **Tạo danh mục:**
   ```
   POST {{baseUrl}}/categories
   Headers: Authorization: Bearer {{token}}
   ```

4. **Tạo sản phẩm:**
   ```
   POST {{baseUrl}}/products
   Headers: Authorization: Bearer {{token}}
   ```

5. **Thêm vào giỏ hàng:**
   ```
   POST {{baseUrl}}/cart
   Headers: Authorization: Bearer {{token}}
   ```

6. **Tạo đơn hàng:**
   ```
   POST {{baseUrl}}/orders
   Headers: Authorization: Bearer {{token}}
   ```

## Scripts có sẵn

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Linting
npm run lint

# Testing
npm run test
npm run test:e2e
```

## Database Schema

### Users
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (default: 'user'),
  timestamps: true
}
```

### Categories
```javascript
{
  name: String (unique),
  description: String,
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Products
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: ObjectId (ref: Category),
  images: [String],
  stock: Number,
  brand: String,
  isActive: Boolean (default: true),
  sold: Number (default: 0),
  timestamps: true
}
```

### Cart
```javascript
{
  userId: ObjectId (ref: User),
  productId: ObjectId (ref: Product),
  quantity: Number,
  timestamps: true
}
```

### Orders
```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId,
    productName: String,
    price: Number,
    quantity: Number,
    subtotal: Number
  }],
  totalAmount: Number,
  status: String (enum),
  shippingAddress: String,
  notes: String,
  timestamps: true
}
```

## Deployment

### Sử dụng PM2

```bash
# Cài đặt PM2
npm install -g pm2

# Build project
npm run build

# Start với PM2
pm2 start dist/main.js --name "watch-store-api"

# Monitor
pm2 monit

# Logs
pm2 logs watch-store-api
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

## Troubleshooting

### Lỗi kết nối MongoDB
- Kiểm tra MongoDB có đang chạy không
- Kiểm tra connection string trong `.env`
- Đảm bảo database permissions

### Lỗi upload file
- Kiểm tra thư mục `uploads` có tồn tại không
- Kiểm tra permissions của thư mục
- Kiểm tra file size limit (5MB)

### Lỗi JWT
- Kiểm tra `JWT_SECRET` trong `.env`
- Đảm bảo token được gửi đúng format trong header
- Kiểm tra token expiration

## Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## License

This project is licensed under the MIT License.

## Support

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub repository.

