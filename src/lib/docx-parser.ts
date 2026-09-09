// eslint-disable-next-line @typescript-eslint/no-require-imports
const mammoth = require("mammoth");
import * as cheerio from "cheerio";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { uploadBufferToR2 } from "./r2";

export interface ParsedWordArticle {
  title: string;
  sapo: string;
  content: string;
  thumbnail: string | null;
  imageCount: number;
}

/**
 * Phân tích file Word (.docx), trích xuất ảnh độ phân giải cao và chuẩn hóa sang HTML chuẩn báo chí
 */
export async function parseDocxBuffer(buffer: Buffer): Promise<ParsedWordArticle> {
  const extractedImages: string[] = [];

  // Tùy biến chuyển đổi hình ảnh trong file Word: giữ nguyên chất lượng và xuất ra WebP sắc nét
  const options = {
    convertImage: mammoth.images.imgElement(async (element: any) => {
      const imageBuffer = await element.read();
      // Nén ảnh: Resize giới hạn chiều rộng 1600px (ảnh từ máy cơ sẽ được thu nhỏ lại)
      // và chuyển sang WebP với chất lượng 80% (cân bằng tối ưu giữa dung lượng và độ nét)
      const webpBuffer = await sharp(imageBuffer)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      const hash = crypto.randomBytes(8).toString("hex");
      const filename = `article-img-${Date.now()}-${hash}.webp`;

      let publicUrl = "";

      try {
        // Tải ảnh lên Cloudflare R2
        publicUrl = await uploadBufferToR2(webpBuffer, filename, "image/webp");
      } catch (err) {
        console.error("Lỗi khi tải ảnh lên R2, fallback dùng base64:", err);
        // Fallback: nếu lỗi cấu hình, nhúng base64 để không mất ảnh
        const base64Data = webpBuffer.toString("base64");
        publicUrl = `data:image/webp;base64,${base64Data}`;
      }

      extractedImages.push(publicUrl);

      return {
        src: publicUrl,
      };
    }),
  };

  const result = await mammoth.convertToHtml({ buffer }, options);
  const rawHtml = result.value;

  // Sử dụng Cheerio để format vào "Khuôn Báo Chí"
  const $ = cheerio.load(rawHtml);

  // 1. Nhận diện Tiêu đề (Lấy H1 hoặc thẻ p đầu tiên có nội dung)
  let title = "";
  const firstH1 = $("h1").first();
  if (firstH1.length > 0) {
    title = firstH1.text().trim();
    firstH1.remove();
  } else {
    // Tìm đoạn p đầu tiên có chữ
    $("p").each((_, el) => {
      const text = $(el).text().trim();
      if (!title && text.length > 10) {
        title = text;
        $(el).remove();
        return false;
      }
    });
  }

  // 2. Nhận diện Sapo (Đoạn tóm tắt mở đầu bài báo)
  let sapo = "";
  $("p").each((_, el) => {
    const text = $(el).text().trim();
    if (!sapo && text.length > 20) {
      sapo = text;
      $(el).remove();
      return false;
    }
  });

  // 3. Chuẩn hóa hình ảnh & chú thích ảnh (Figure & Figcaption)
  // Nếu có đoạn text ngắn ngay sau ảnh, tự động biến nó thành caption ảnh chuẩn báo chí
  $("img").each((_, img) => {
    const $img = $(img);
    const $parent = $img.parent();

    // Tìm thẻ đoạn văn tiếp theo để xem có phải caption không
    const nextElem = $parent.is("p") ? $parent.next() : $img.next();
    let captionText = "";

    if (nextElem && nextElem.is("p") && nextElem.text().trim().length > 0 && nextElem.text().trim().length < 150) {
      // Xác định đây là chú thích ảnh
      captionText = nextElem.text().trim();
      nextElem.remove();
    }

    const figureHtml = `
      <figure class="my-8 rounded-sm overflow-hidden bg-slate-50 border border-slate-200">
        <img src="${$img.attr("src")}" alt="${captionText || title}" class="w-full h-auto object-cover max-h-[650px]" loading="lazy" />
        ${captionText ? `<figcaption class="p-3 text-center text-sm italic text-slate-600 border-t border-slate-100 bg-slate-50">${captionText}</figcaption>` : ""}
      </figure>
    `;

    if ($parent.is("p")) {
      $parent.replaceWith(figureHtml);
    } else {
      $img.replaceWith(figureHtml);
    }
  });

  // 4. Chuẩn hóa các Heading 2, 3 thành phong cách Tạp chí
  $("h2").addClass("text-2xl font-bold text-slate-900 mt-8 mb-4 border-l-4 border-[#1A56DB] pl-3 leading-snug");
  $("h3").addClass("text-xl font-bold text-slate-900 mt-6 mb-3 leading-snug");
  $("p").addClass("text-base md:text-lg leading-relaxed text-slate-800 mb-5 font-normal");
  $("blockquote").addClass("my-6 p-4 pl-6 border-l-4 border-[#0F4C81] bg-slate-50 italic text-slate-700 font-serif text-lg");

  // Ảnh đại diện (Thumbnail): Lấy ảnh đầu tiên trong bài viết
  const thumbnail = extractedImages.length > 0 ? extractedImages[0] : null;

  return {
    title: title || "Bài viết chưa đặt tiêu đề",
    sapo: sapo || title,
    content: $("body").html() || rawHtml,
    thumbnail,
    imageCount: extractedImages.length,
  };
}
