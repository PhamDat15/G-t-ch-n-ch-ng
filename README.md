# Tạp chí Việt Nam Travel

**Chạm tinh hoa, thưởng di sản**

Website tạp chí du lịch, văn hóa và di sản Việt Nam, xây dựng bằng Next.js 16, Prisma/PostgreSQL và Cloudflare R2.

## Chạy local

1. Sao chép `.env.example` thành `.env` và điền cấu hình.
2. Cài thư viện: `pnpm install`.
3. Tạo Prisma Client: `pnpm exec prisma generate`.
4. Đồng bộ database development: `pnpm exec prisma db push`.
5. Chạy website: `pnpm dev`.

Website mở tại `http://localhost:3000`. CMS mở tại `http://localhost:3000/cms`, đăng nhập mặc định bằng tài khoản `admin` và mật khẩu `admin`.

Có thể đổi thông tin đăng nhập bằng `ADMIN_USERNAME`, `ADMIN_PASSWORD` và `ADMIN_SESSION_SECRET`. Nên thay toàn bộ giá trị mặc định trước khi triển khai production.

## CMS

- Dashboard tổng quan.
- Tìm kiếm, xem, sửa và xóa bài viết.
- Nhập bài từ file Word `.docx` bên trong khu vực quản trị tại `/cms/them-bai`.
- Kiểm duyệt bình luận.
- Quản lý tên, slogan, thông tin tòa soạn, mạng xã hội và trang tìm vé máy bay.
- Quy trình nhập Word và cấu hình Cloudflare R2 được giữ nguyên.

## Kiểm tra

```bash
pnpm exec tsc --noEmit
pnpm exec eslint src
pnpm run build
```
