# Tạp chí Việt Nam Travel

**Chạm tinh hoa, thưởng di sản**

Website tạp chí du lịch, văn hóa và di sản Việt Nam, xây dựng bằng Next.js 16, Prisma/PostgreSQL và Cloudflare R2.

## Chạy local

1. Sao chép `.env.example` thành `.env` và điền cấu hình.
2. Cài thư viện: `pnpm install`.
3. Tạo Prisma Client: `pnpm exec prisma generate`.
4. Đồng bộ database development: `pnpm exec prisma db push`.
5. Chạy website: `pnpm dev`.

Website mở tại `http://localhost:3000`. CMS mở trực tiếp, không cần đăng nhập, tại `http://localhost:3000/cms`.

## CMS

- Dashboard tổng quan.
- Tìm kiếm, xem, sửa và xóa bài viết.
- Nhập bài từ file Word `.docx`.
- Kiểm duyệt bình luận.
- Quản lý tên, slogan, thông tin tòa soạn, mạng xã hội và trang tìm vé máy bay.
- Quy trình nhập Word và cấu hình Cloudflare R2 được giữ nguyên.

## Kiểm tra

```bash
pnpm exec tsc --noEmit
pnpm exec eslint src
pnpm run build
```
