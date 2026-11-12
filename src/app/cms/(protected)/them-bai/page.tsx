import ArticleImportForm from "@/components/ArticleImportForm";
import { getCurrentUser } from "@/lib/admin-auth";

export default async function CreateArticlePage() {
  const currentUser = await getCurrentUser();
  const defaultAuthor = currentUser?.fullName || (currentUser?.role === "ADMIN" ? "Ban Biên tập Việt Nam Travel" : "Phóng Viên");
  return <ArticleImportForm defaultAuthor={defaultAuthor} />;
}
