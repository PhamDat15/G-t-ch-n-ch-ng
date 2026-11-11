export interface CategoryItem {
  name: string;
  slug: string;
  description: string;
  order: number;
}

export const CATEGORIES: CategoryItem[] = [
  { name: "Văn hóa", slug: "van-hoa", description: "Bản sắc văn hóa, lễ hội và phong tục tập quán các vùng miền", order: 1 },
  { name: "Lưu trú", slug: "luu-tru", description: "Khách sạn, resort cao cấp, homestay độc đáo và không gian nghỉ dưỡng", order: 2 },
  { name: "Khám phá", slug: "kham-pha", description: "Những vùng đất mới, cung đường phượt, điểm check-in hấp dẫn", order: 3 },
  { name: "Con người", slug: "con-nguoi", description: "Chân dung những người truyền cảm hứng xê dịch và người bản địa", order: 4 },
  { name: "Ẩm thực", slug: "am-thuc", description: "Hương vị vùng miền, ẩm thực đường phố và tinh hoa ẩm thực Việt Nam", order: 5 },
  { name: "Multimedia", slug: "multimedia", description: "Phóng sự ảnh, video 4K sắc nét và câu chuyện hình ảnh (Photo Story)", order: 6 },
  { name: "Kinh nghiệm", slug: "kinh-nghiem", description: "Cẩm nang du lịch, lịch trình chi tiết, bí kíp chuẩn bị đồ và an toàn", order: 7 },
];
