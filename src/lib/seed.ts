import { prisma } from "@/lib/db";
import { seedCategories } from "@/lib/categories";

export async function seedSampleArticles() {
  await seedCategories();

  const count = await prisma.article.count();
  if (count > 0) return; // Đã có dữ liệu

  const categories = await prisma.category.findMany();
  const getCatId = (slug: string) => categories.find((c) => c.slug === slug)?.id || categories[0].id;

  const sampleArticles = [
    {
      title: "Chinh phục đèo Mã Pí Lèng: Khi những bánh xe lăn trên sống lưng mây Hà Giang",
      slug: "chinh-phuc-deo-ma-pi-leng-ha-giang",
      sapo: "Nằm vắt mình trên cao nguyên đá Đồng Văn kỳ vĩ, Mã Pí Lèng không chỉ là một trong 'tứ đại đỉnh đèo' hiểm trở bậc nhất phương Bắc, mà còn là hành trình thử thách bản lĩnh của mọi phượt thủ khi gạt chân chống đứng giữa mây trời.",
      content: `
        <p>Hà Giang những ngày đầu thu đón chúng tôi bằng từng dải sương mù giăng mắc trên những triền núi đá tai mèo xám ngắt. Con đường Hạnh Phúc uốn lượn như một dải lụa vắt ngang lưng trời, mở ra những khúc cua tay áo đầy mê hoặc.</p>
        
        <figure class="my-8 rounded-sm overflow-hidden bg-slate-50 border border-slate-200">
          <img src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200&auto=format&fit=crop" alt="Toàn cảnh hẻm Tu Sản và sông Nho Quế nhìn từ đỉnh đèo Mã Pí Lèng" class="w-full h-auto object-cover max-h-[650px]" />
          <figcaption class="p-3 text-center text-sm italic text-slate-600 border-t border-slate-100 bg-slate-50">Toàn cảnh hẻm Tu Sản và sông Nho Quế xanh ngọc bích nhìn từ đỉnh đèo Mã Pí Lèng — Ảnh: Gạt Chân Chống</figcaption>
        </figure>

        <h2>Những khúc cua thử thách tay lái và lòng can đảm</h2>
        <p>Chạy xe máy qua cung đường này đòi hỏi sự tập trung cao độ. Một bên là vách núi dựng đứng sừng sững, một bên là vực sâu hun hút với dòng Nho Quế như một sợi chỉ xanh ngắt len lỏi dưới đáy thung lũng sâu thẳm. Dừng xe tại điểm ngắm cảnh Mã Pí Lèng Panorama, gạt chân chống xuống bên bờ vực, hít một hơi thật sâu làn gió cao nguyên lồng lộng, bạn mới thấm thía trọn vẹn sự nhỏ bé của con người trước thiên nhiên hùng tráng.</p>

        <figure class="my-8 rounded-sm overflow-hidden bg-slate-50 border border-slate-200">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop" alt="Hoàng hôn buông trên cao nguyên đá hùng vĩ" class="w-full h-auto object-cover max-h-[650px]" />
          <figcaption class="p-3 text-center text-sm italic text-slate-600 border-t border-slate-100 bg-slate-50">Khoảnh khắc hoàng hôn buông nhuộm sắc vàng rực rỡ lên những nếp nhà cheo leo — Ảnh: Hải Nam</figcaption>
        </figure>

        <h2>Kinh nghiệm chuẩn bị trước khi lên đường</h2>
        <p>Để chuyến đi trọn vẹn, việc kiểm tra kỹ lưỡng phanh xe, lốp và hệ thống đèn là bắt buộc. Hãy luôn chủ động về thời gian xuất phát vào ban ngày để tránh sương mù dày đặc khi chiều muộn buông xuống.</p>
      `,
      thumbnail: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200&auto=format&fit=crop",
      author: "Trần Anh Khoa",
      isHero: true,
      isFeatured: true,
      readingTime: 4,
      categoryId: getCatId("kham-pha"),
    },
    {
      title: "Nghỉ dưỡng giữa ngàn mây tại resort biệt lập đỉnh đồi Sa Pa",
      slug: "nghi-duong-giua-ngan-may-sa-pa",
      sapo: "Rời xa khói bụi và nhịp sống hối hả nơi đô thị, khu nghỉ dưỡng ẩn mình giữa thung lũng Mường Hoa mở ra không gian thư thái tuyệt đối với tầm nhìn bao trọn biển mây cuồn cuộn.",
      content: "<p>Một không gian tĩnh lặng nơi kiến trúc gỗ mộc hòa quyện cùng thiên nhiên Tây Bắc hùng vĩ...</p>",
      thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
      author: "Lê Minh Thảo",
      isHero: false,
      isFeatured: true,
      readingTime: 3,
      categoryId: getCatId("luu-tru"),
    },
    {
      title: "Lễ hội Cầu Mùa của người Dao Đỏ: Điệu múa lửa huyền bí trong đêm trăng rằm",
      slug: "le-hoi-cau-mua-nguoi-dao-do",
      sapo: "Những bước chân trần nhảy múa trên đống than hoa đỏ rực rỡ không chỉ là nghi lễ tâm linh mà còn thể hiện sức mạnh phi thường và ước vọng về một mùa màng ấm no bội thu.",
      content: "<p>Đêm hội bắt đầu khi thầy cúng cất lên những bài kinh cổ ngàn năm...</p>",
      thumbnail: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop",
      author: "Vũ Đình Cường",
      isHero: false,
      isFeatured: true,
      readingTime: 5,
      categoryId: getCatId("van-hoa"),
    },
    {
      title: "Bát bún bò cay nồng phố cổ Huế: Hương vị trăm năm gìn giữ của mệ Kéo",
      slug: "bat-bun-bo-pho-co-hue-me-keo",
      sapo: "Nước dùng thơm lừng mùi sả ruốc, miếng chả cua giòn ngọt cùng vị ớt cay nồng xé lưỡi đã làm nên thương hiệu ẩm thực Cố đô làm xiêu lòng bất kỳ thực khách phương xa nào.",
      content: "<p>Trong con hẻm nhỏ Bạch Đằng, quán bún không biển hiệu vẫn tấp nập khách từ 5 giờ sáng...</p>",
      thumbnail: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=1000&auto=format&fit=crop",
      author: "Nguyễn Hải Yến",
      isHero: false,
      isFeatured: true,
      readingTime: 3,
      categoryId: getCatId("am-thuc"),
    },
    {
      title: "Gặp gỡ người gác hải đăng 30 năm trên đảo Hòn Nước",
      slug: "nguoi-gac-hai-dang-hon-nuoc",
      sapo: "Ba thập kỷ bầu bạn với sóng gió đại dương và tiếng còi tàu đêm, ông Nguyễn Văn Tư đã giữ vững ngọn lửa soi sáng cho hàng triệu chuyến tàu cập bến bình an.",
      content: "<p>Giữa bốn bề trùng khơi, cuộc sống của người lính biển giản dị nhưng tràn đầy nhiệt huyết...</p>",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
      author: "Phạm Hoàng Sơn",
      isHero: false,
      isFeatured: false,
      readingTime: 4,
      categoryId: getCatId("con-nguoi"),
    },
    {
      title: "Phóng sự ảnh: 24 giờ chìm đắm trong sương sớm Đà Lạt",
      slug: "phong-su-anh-24-gio-da-lat",
      sapo: "Bộ ảnh chụp lại từng khoảnh khắc bình minh xuyên qua những cánh rừng thông ngút ngàn và bờ hồ Tuyền Lâm tĩnh lặng như một bức tranh thủy mặc hữu tình.",
      content: "<p>Mỗi khung hình là một bản giao hưởng nhẹ nhàng của ánh sáng và màn sương cao nguyên...</p>",
      thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop",
      author: "Ban Ảnh Tạp Chí",
      isHero: false,
      isFeatured: true,
      readingTime: 2,
      categoryId: getCatId("multimedia"),
    },
    {
      title: "Cẩm nang phượt xe máy an toàn qua cung đường Tây Bắc mùa mưa bão",
      slug: "cam-nang-phuot-xe-may-tay-bac",
      sapo: "Những lưu ý sống còn về cách xử lý trơn trượt khi qua đèo dốc, trang bị bảo hộ chuyên dụng và kỹ năng sơ cứu cần thiết cho những ai đam mê xê dịch tự do.",
      content: "<p>Thời tiết vùng cao thay đổi rất nhanh, chuẩn bị kỹ lưỡng là chìa khóa cho một chuyến đi trọn vẹn...</p>",
      thumbnail: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop",
      author: "Đoàn Minh Trí",
      isHero: false,
      isFeatured: false,
      readingTime: 6,
      categoryId: getCatId("kinh-nghiem"),
    },
  ];

  for (const item of sampleArticles) {
    await prisma.article.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
    });
  }
}
