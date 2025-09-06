# 🚀 Hướng dẫn Deploy Lunar Krystal Bot lên Render.com

## 📋 Yêu cầu trước khi deploy

1. **Tài khoản Render.com** - Đăng ký tại [render.com](https://render.com)
2. **Repository GitHub** - Code đã được push lên GitHub
3. **App State Facebook** - Cần có file `appstate.json` hợp lệ

## 🔧 Các bước deploy

### Bước 1: Chuẩn bị code
```bash
# Clone repository về máy local
git clone https://github.com/dukthuak/Lunar-Krystal.git
cd Lunar-Krystal

# Cài đặt dependencies
npm install
```

### Bước 2: Cấu hình biến môi trường
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin của bạn:
```env
BOTNAME=Lunar Krystal Bot
PREFIX=/
ADMINBOT=853045435
FACEBOOK_ADMIN=https://www.facebook.com/dukthuak
```

### Bước 3: Deploy lên Render.com

1. **Đăng nhập Render.com**
   - Truy cập [render.com](https://render.com)
   - Đăng nhập bằng GitHub

2. **Tạo Web Service mới**
   - Click "New +" → "Web Service"
   - Connect repository GitHub của bạn
   - Chọn repository `Lunar-Krystal`

3. **Cấu hình Service**
   ```
   Name: lunar-krystal-bot
   Environment: Node
   Region: Singapore (gần Việt Nam nhất)
   Branch: main
   Root Directory: . (để trống)
   Build Command: npm install
   Start Command: npm start
   ```

4. **Thiết lập Environment Variables**
   - Vào tab "Environment"
   - Thêm các biến sau:
   ```
   NODE_ENV=production
   PORT=10000
   BOTNAME=Lunar Krystal Bot
   PREFIX=/
   ADMINBOT=853045435
   FACEBOOK_ADMIN=https://www.facebook.com/dukthuak
   ```

5. **Upload App State**
   - Tạo file `appstate.json` từ bot local của bạn
   - Encode base64 file này
   - Thêm biến môi trường:
   ```
   APPSTATE=<base64_encoded_appstate>
   ```

### Bước 4: Deploy và kiểm tra

1. **Deploy**
   - Click "Create Web Service"
   - Render sẽ tự động build và deploy

2. **Kiểm tra logs**
   - Vào tab "Logs" để xem quá trình build
   - Nếu có lỗi, kiểm tra và fix

3. **Test bot**
   - Bot sẽ tự động khởi động
   - Kiểm tra Facebook Messenger

## 🔧 Các lệnh build và chạy

### Lệnh build:
```bash
npm run build
```

### Lệnh chạy local:
```bash
# Chạy bot
npm start

# Chạy bot + web
npm run start-all

# Chạy với PowerShell (Windows)
npm run lunar
```

### Lệnh chạy trên Render:
```bash
npm run render:start
```

## ⚠️ Lưu ý quan trọng

1. **App State**: Cần có file `appstate.json` hợp lệ từ tài khoản Facebook
2. **Database**: Bot sử dụng SQLite, dữ liệu sẽ mất khi restart
3. **Memory**: Render free plan có giới hạn 512MB RAM
4. **Uptime**: Free plan có thể sleep sau 15 phút không hoạt động

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **Build failed**
   - Kiểm tra `package.json` có đúng dependencies
   - Xem logs để tìm lỗi cụ thể

2. **Bot không start**
   - Kiểm tra `appstate.json` có hợp lệ
   - Kiểm tra environment variables

3. **Memory limit exceeded**
   - Upgrade lên paid plan
   - Tối ưu code để giảm memory usage

### Logs quan trọng:
```bash
# Xem logs realtime
render logs --service lunar-krystal-bot

# Xem logs cụ thể
render logs --service lunar-krystal-bot --tail
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, liên hệ:
- Facebook: [Hoàng Đức Thuận](https://www.facebook.com/dukthuak)
- GitHub Issues: Tạo issue trên repository

---
**Lưu ý**: Giữ nguyên credit khi sử dụng code này! 🌸
