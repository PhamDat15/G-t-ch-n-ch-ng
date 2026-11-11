import { prisma } from "../src/lib/db";

// Danh sách các phóng viên và thành viên từ hình ảnh bạn cung cấp
const MEMBERS = [
  { fullName: "Nguyễn DuyAnh", username: "duyanh", role: "REPORTER" as const },
  { fullName: "Phương Linhh", username: "phuonglinh", role: "REPORTER" as const },
  { fullName: "Hà Linh", username: "halinh", role: "REPORTER" as const },
  { fullName: "Đỗ Quỳnh Hương", username: "quynhhuong", role: "REPORTER" as const },
  { fullName: "Thuỳ Trang", username: "thuytrang", role: "REPORTER" as const },
  { fullName: "Duong Hai Yen", username: "haiyen", role: "REPORTER" as const },
  { fullName: "Phuong Thao", username: "phuongthao", role: "REPORTER" as const },
  { fullName: "Trần Việt Hoàng", username: "viethoang", role: "REPORTER" as const },
  { fullName: "Linh Hoang", username: "linhhoang", role: "REPORTER" as const },
  { fullName: "Le Hoang Linh", username: "hoanglinh", role: "REPORTER" as const },
  { fullName: "Huy", username: "huy", role: "REPORTER" as const },
  { fullName: "Phạm Đạt", username: "phamdat", role: "ADMIN" as const },
  { fullName: "Nguyễn T. Hạnh", username: "thihanh", role: "REPORTER" as const },
];

function generatePassword() {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let pass = "";
  for (let i = 0; i < 6; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass + "@";
}

async function main() {
  console.log("--- BẮT ĐẦU TẠO TÀI KHOẢN TÒA SOẠN ---");

  // 1. Tạo tài khoản Trưởng mục: admin / admin
  await prisma.user.upsert({
    where: { username: "admin" },
    update: { role: "ADMIN", password: "admin" },
    create: {
      username: "admin",
      password: "admin",
      fullName: "Trưởng Mục (Ban Biên Tập)",
      role: "ADMIN",
    },
  });

  const accountList: { name: string; user: string; pass: string; role: string }[] = [];
  accountList.push({ name: "Trưởng Mục", user: "admin", pass: "admin", role: "ADMIN (Trưởng mục)" });

  // 2. Tạo tài khoản cho các phóng viên với mật khẩu ngẫu nhiên
  for (const m of MEMBERS) {
    const password = generatePassword();
    await prisma.user.upsert({
      where: { username: m.username },
      update: {
        fullName: m.fullName,
        role: m.role,
      },
      create: {
        username: m.username,
        password: password,
        fullName: m.fullName,
        role: m.role,
      },
    });

    const currentUser = await prisma.user.findUnique({ where: { username: m.username } });
    accountList.push({
      name: m.fullName,
      user: m.username,
      pass: currentUser?.password || password,
      role: m.role,
    });
  }

  console.log("\nDANH SÁCH TÀI KHOẢN ĐÃ KHỞI TẠO:");
  console.table(accountList);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

