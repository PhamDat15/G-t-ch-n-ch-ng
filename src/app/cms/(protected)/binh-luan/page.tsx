import { prisma } from "@/lib/db";
import CommentTable from "@/components/CommentTable";

export default async function CmsCommentsPage() {
  const comments = await prisma.comment.findMany({ take: 100, orderBy: { createdAt: "desc" }, include: { article: { select: { title: true, slug: true } } } });
  return <div><p className="text-sm font-bold uppercase tracking-wider text-[#b46b2a]">Tương tác</p><h1 className="font-serif text-3xl font-black text-[#123b5d]">Quản lý bình luận</h1><p className="mb-6 mt-2 text-sm text-slate-500">Kiểm duyệt phản hồi của độc giả trên các bài viết.</p><div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><CommentTable initialComments={comments} /></div></div>;
}
