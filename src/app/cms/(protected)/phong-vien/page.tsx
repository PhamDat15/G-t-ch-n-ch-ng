import { prisma } from "@/lib/db";
import { getCurrentUser, FALLBACK_USERS } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ReportersManagementPage() {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "ADMIN" && currentUser?.role !== "EDITOR") {
    redirect("/cms");
  }

  // 1. Tự động đồng bộ toàn bộ danh sách FALLBACK_USERS vào bảng User nếu chưa có
  try {
    for (const [username, info] of Object.entries(FALLBACK_USERS)) {
      await prisma.user.upsert({
        where: { username },
        update: {
          fullName: info.fullName,
          role: info.role,
        },
        create: {
          username,
          password: info.pass,
          fullName: info.fullName,
          role: info.role,
        },
      });
    }
  } catch (syncError) {
    console.warn("Không thể tự động đồng bộ danh sách user:", syncError);
  }

  // 2. Lấy danh sách đầy đủ tất cả tài khoản
  let users: any[] = [];
  try {
    users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });
  } catch (fetchError) {
    console.warn("Lỗi đọc bảng user:", fetchError);
  }

  // 3. Nếu database chưa kịp trả về đủ, kết hợp danh sách tĩnh để hiển thị đầy đủ 100%
  const userMap = new Map(users.map((u) => [u.username.toLowerCase(), u]));
  const fullList = Object.entries(FALLBACK_USERS).map(([uname, data]) => {
    const existing = userMap.get(uname.toLowerCase());
    return {
      id: existing?.id || uname,
      fullName: data.fullName,
      username: uname,
      password: data.pass,
      role: data.role,
      articleCount: existing?._count?.articles ?? 0,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#b46b2a]">
          Nhân sự tòa soạn
        </p>
        <h1 className="font-serif text-3xl font-black text-[#123b5d]">
          Danh sách Phóng viên & Tài khoản ({fullList.length} nhân sự)
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý tài khoản đăng nhập của các phóng viên, biên tập viên và trưởng mục trong tòa soạn.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 uppercase text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Họ và tên</th>
              <th className="p-3.5">Tên đăng nhập (Username)</th>
              <th className="p-3.5">Mật khẩu đăng nhập</th>
              <th className="p-3.5">Vai trò</th>
              <th className="p-3.5 text-center">Số bài viết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {fullList.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition">
                <td className="p-3.5 font-bold text-slate-900">{u.fullName}</td>
                <td className="p-3.5 font-mono text-sky-700 font-bold">@{u.username}</td>
                <td className="p-3.5 font-mono text-slate-800 bg-slate-50/80 px-3">
                  <span className="select-all rounded bg-white px-2 py-0.5 border border-slate-200 font-bold text-slate-900">
                    {u.password}
                  </span>
                </td>
                <td className="p-3.5">
                  <span
                    className={`rounded px-2 py-0.5 font-bold uppercase text-[10px] ${
                      u.role === "ADMIN"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : u.role === "EDITOR"
                        ? "bg-sky-100 text-sky-900 border border-sky-300"
                        : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    }`}
                  >
                    {u.role === "ADMIN"
                      ? "Trưởng Mục (Admin)"
                      : u.role === "EDITOR"
                      ? "Biên Tập Viên"
                      : "Phóng Viên"}
                  </span>
                </td>
                <td className="p-3.5 text-center font-bold text-slate-800">
                  {u.articleCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

