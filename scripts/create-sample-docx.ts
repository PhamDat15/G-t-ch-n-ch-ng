import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } from "docx";
import fs from "fs";
import path from "path";
import axios from "axios";

// Thư mục lưu các file Word mẫu
const outputDir = path.join(process.cwd(), "sample-articles");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function fetchImageBuffer(url: string): Promise<Buffer> {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
}

interface ArticleData {
  filename: string;
  title: string;
  sapo: string;
  category: string;
  headings: {
    heading: string;
    paragraphs: string[];
    imageUrl?: string;
    caption?: string;
  }[];
}

const articles: ArticleData[] = [
  {
    filename: "1-van-hoa-dem-xoe-thai-yen-bai.docx",
    category: "Văn hóa",
    title: "Đêm xòe Thái Mường Lò: Vũ điệu gắn kết ngàn đời của đồng bào Tây Bắc",
    sapo: "Khi tiếng trống, tiếng chiêng rộn rã cất lên bên ánh lửa bập bùng, vòng xòe Mường Lò lại rộng mở đón chào những bước chân lữ khách phương xa cùng hòa mình vào di sản phi vật thể nhân loại.",
    headings: [
      {
        heading: "Hồn cốt của bản làng Tây Bắc trong từng nhịp chân",
        paragraphs: [
          "Mường Lò (Yên Bái) từ lâu đã được xem là cái nôi của người Thái đen. Đến với mảnh đất này vào những ngày hội mùa, du khách sẽ bắt gặp những cô gái Thái thướt tha trong tà áo cóm, duyên dáng uốn lượn theo từng làn điệu dân ca cổ truyền.",
          "Điệu xòe không chỉ đơn thuần là một điệu múa giải trí, mà là sợi dây vô hình kết nối tình làng nghĩa xóm, thể hiện ước vọng về một cuộc sống ấm no, mùa màng bội thu và hạnh phúc lứa đôi."
        ],
        imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=900&auto=format&fit=crop",
        caption: "Những bước chân uyển chuyển của các thiếu nữ Thái trong đêm hội xòe hoa — Ảnh: Gạt Chân Chống"
      },
      {
        heading: "Trải nghiệm không gian văn hóa cộng đồng độc đáo",
        paragraphs: [
          "Vòng xòe càng về khuya càng đông đảo. Không phân biệt già trẻ, gái trai hay du khách xa lạ, hễ ai bước vào vòng đều được tay nắm chặt tay, truyền cho nhau hơi ấm và nụ cười rạng rỡ bên chum rượu cần thơm nồng."
        ]
      }
    ]
  },
  {
    filename: "2-luu-tru-ecolodge-an-minh-pu-luong.docx",
    category: "Lưu trú",
    title: "Trốn phố về Pù Luông: Trải nghiệm kỳ nghỉ xanh giữa thung lũng nguyên sơ",
    sapo: "Không tiếng còi xe inh ỏi, không khói bụi ồn ào, những căn bungalow mái lá nép mình bên sườn đồi Pù Luông mang đến cho du khách cảm giác hòa mình trọn vẹn vào thiên nhiên trong lành.",
    headings: [
      {
        heading: "Không gian nghỉ dưỡng hòa quyện cùng núi rừng",
        paragraphs: [
          "Khu nghỉ dưỡng được thiết kế theo lối kiến trúc nhà sàn truyền thống của người Thái, sử dụng hoàn toàn các vật liệu thân thiện với môi trường như tre, nứa, gỗ và mái cọ mát rượi.",
          "Mỗi buổi sớm thức giấc, chỉ cần kéo nhẹ rèm cửa là cả một biển mây bồng bềnh cùng những thửa ruộng bậc thang xanh mướt trải dài tít tắp đã thu trọn vào tầm mắt."
        ],
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=900&auto=format&fit=crop",
        caption: "Bể bơi vô cực nhìn thẳng ra thung lũng ruộng bậc thang Pù Luông tuyệt đẹp — Ảnh: Minh Hoàng"
      },
      {
        heading: "Thưởng thức ẩm thực hữu cơ bản địa",
        paragraphs: [
          "Bên cạnh không gian lưu trú ấn tượng, thực khách còn được thưởng thức những món ăn đặc sản đậm chất vùng cao như vịt Cổ Lũng nướng than hoa, măng rừng xào và canh đắng lá đắng thơm bùi."
        ]
      }
    ]
  },
  {
    filename: "3-kham-pha-cung-duong-ven-bien-phu-yen.docx",
    category: "Khám phá",
    title: "Gạt chân chống bên bờ biển Phú Yên: Cung đường của đá, sóng và ngọn hải đăng",
    sapo: "Với bờ biển dài hoang sơ uốn lượn ôm lấy những vách đá bazan kỳ vĩ, hành trình rong ruổi xe máy qua xứ 'hoa vàng cỏ xanh' là giấc mơ tự do của bất kỳ tín đồ xê dịch nào.",
    headings: [
      {
        heading: "Kỳ quan Gành Đá Đĩa và kiệt tác của thiên nhiên",
        paragraphs: [
          "Từ thành phố Tuy Hòa xuôi về phía Bắc chừng 30km, Gành Đá Đĩa hiện ra như một tổ ong khổng lồ được tạo nên bởi hàng nghìn cột đá bazan hình lục giác xếp lớp đều tăm tắp hướng ra đại dương xanh ngắt.",
          "Sóng biển ngày đêm vỗ về tung bọt trắng xóa lên từng phiến đá đen bóng, tạo nên một khung cảnh thiên nhiên kỳ ảo và choáng ngợp bất tận."
        ],
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop",
        caption: "Cung đường biển hoang sơ với làn nước trong vắt màu ngọc bích tại Mũi Điện — Ảnh: Quốc Tuấn"
      },
      {
        heading: "Đón ánh bình minh đầu tiên trên dải đất liền hình chữ S",
        paragraphs: [
          "Đến Mũi Đại Lãnh vào lúc 5 giờ sáng, dựng chân chống xe bên triền đồi cỏ, ngắm nhìn vầng thái dương từ từ nhô lên khỏi đường chân trời đại dương là một trải nghiệm xúc động khó phai trong đời."
        ]
      }
    ]
  },
  {
    filename: "4-am-thuc-tinh-tuy-pho-bat-da-ha-noi.docx",
    category: "Ẩm thực",
    title: "Phở bát đá Hà Nội: Giữ trọn độ nóng và hương vị thanh tao của ẩm thực kinh kỳ",
    sapo: "Khác với cách thưởng thức phở truyền thống, phở bát đá mang lại trải nghiệm độc đáo khi thực khách tự tay chần từng thớ thịt bò tươi rói vào làn nước dùng sôi sùng sục đến giọt cuối cùng.",
    headings: [
      {
        heading: "Nghệ thuật thưởng thức phở chậm rãi giữa lòng thủ đô",
        paragraphs: [
          "Chiếc bát làm bằng đá tự nhiên nguyên khối được nung nóng ở nhiệt độ hàng trăm độ C trước khi múc nước dùng vào. Nhờ khả năng giữ nhiệt vượt trội, bát nước dùng vẫn sôi ùng ục ngay cả khi đã đặt lên bàn ăn của khách.",
          "Từng đĩa bánh phở tươi dẻo dai, thịt bò tái mềm ngọt, trứng gà ta, ớt tươi và các loại rau thơm được bày biện trang nhã xung quanh chiếc bát đá nóng hổi."
        ],
        imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=900&auto=format&fit=crop",
        caption: "Bát phở đá bốc khói nghi ngút với nước dùng ninh xương ngọt thanh chuẩn vị Hà Thành — Ảnh: Thu Hà"
      },
      {
        heading: "Bí quyết nước dùng thanh ngọt từ xương tủy",
        paragraphs: [
          "Để có được nồi nước dùng đạt chuẩn, người đầu bếp phải hầm xương bò liên tục trong 12 tiếng, kết hợp cùng hoa hồi, quế chi, thảo quả và gừng nướng thơm lừng tạo nên hậu vị ngọt sâu lắng."
        ]
      }
    ]
  },
  {
    filename: "5-kinh-nghiem-chuan-bi-phuot-xe-may-doc-hanh.docx",
    category: "Kinh nghiệm",
    title: "Cẩm nang phượt xe máy độc hành: Những điều cốt lõi cho chuyến đi an toàn",
    sapo: "Đi một mình mang lại sự tự do tuyệt đối về thời gian và lịch trình, nhưng đòi hỏi bạn phải có sự chuẩn bị kỹ lưỡng từ kỹ năng xử lý tình huống cho đến việc kiểm tra chiếc xe đồng hành.",
    headings: [
      {
        heading: "Kiểm tra và bảo dưỡng toàn diện 'chiến mã'",
        paragraphs: [
          "Trước bất kỳ chuyến đi xa nào, hãy thay dầu nhớt mới, kiểm tra độ mòn của lốp, độ nhạy của hệ thống phanh và nhông sên dĩa. Một chiếc xe vận hành ổn định là 80% sự an toàn của hành trình.",
          "Đừng quên mang theo một bộ vá xe không săm mini, bơm điện cầm tay và những dụng cụ cơ bản để tự xử lý khi không may gặp sự cố giữa đèo vắng."
        ],
        imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=900&auto=format&fit=crop",
        caption: "Chuẩn bị hành trang gọn gàng và khoa học là yếu tố then chốt cho chuyến độc hành — Ảnh: Đức Anh"
      },
      {
        heading: "Tâm thế bình tĩnh và kỹ năng đọc địa hình",
        paragraphs: [
          "Luôn phân bổ thời gian di chuyển hợp lý, không cố chạy xe vào ban đêm trên những đoạn đường đèo nguy hiểm. Hãy dừng lại gạt chân chống nghỉ ngơi ngay khi cảm thấy cơ thể có dấu hiệu mệt mỏi."
        ]
      }
    ]
  }
];

async function generateAllDocx() {
  console.log("Bắt đầu tạo 5 file Word (.docx) mẫu chuẩn form...");

  for (const item of articles) {
    const docChildren: Paragraph[] = [];

    // 1. Dòng đầu tiên: Tiêu đề chính (Heading 1)
    docChildren.push(
      new Paragraph({
        text: item.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      })
    );

    // 2. Đoạn văn thứ hai: Đoạn Sapo tóm tắt mở đầu
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: item.sapo,
            italics: true,
            size: 26, // 13pt
          }),
        ],
        spacing: { after: 300 },
      })
    );

    // Các phần nội dung kèm Heading 2, đoạn văn, hình ảnh và chú thích ảnh
    for (const sec of item.headings) {
      docChildren.push(
        new Paragraph({
          text: sec.heading,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 140 },
        })
      );

      for (const p of sec.paragraphs) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: p,
                size: 24, // 12pt
              }),
            ],
            spacing: { after: 160 },
          })
        );
      }

      if (sec.imageUrl) {
        try {
          console.log(`Đang tải ảnh chất lượng cao cho: ${item.title}...`);
          const imgBuffer = await fetchImageBuffer(sec.imageUrl);
          docChildren.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: imgBuffer,
                  transformation: {
                    width: 580,
                    height: 360,
                  },
                }),
              ],
              spacing: { before: 200, after: 80 },
            })
          );

          if (sec.caption) {
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: sec.caption,
                    italics: true,
                    size: 20, // 10pt
                    color: "666666",
                  }),
                ],
                spacing: { after: 240 },
              })
            );
          }
        } catch (e: any) {
          console.error("Lỗi tải ảnh:", e.message);
        }
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docChildren,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const filePath = path.join(outputDir, item.filename);
    fs.writeFileSync(filePath, buffer);
    console.log(`✓ Đã tạo thành công file: ${item.filename}`);
  }

  console.log("\n Hoàn thành! Toàn bộ 5 file Word đã nằm trong thư mục: " + outputDir);
}

generateAllDocx().catch(console.error);
