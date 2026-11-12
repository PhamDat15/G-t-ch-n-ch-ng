import { NextRequest, NextResponse } from "next/server";

// Hàm trích xuất video ID từ nhiều định dạng URL YouTube
function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Vui lòng cung cấp đường link YouTube hợp lệ." },
        { status: 400 }
      );
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: "Không tìm thấy Video ID từ đường link này. Vui lòng kiểm tra lại." },
        { status: 400 }
      );
    }

    // Gọi API oEmbed chính thức của YouTube để lấy metadata (không cần API key)
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(oembedUrl);

    let title = "";
    let authorName = "Việt Nam Travel";

    if (res.ok) {
      const data = await res.json();
      title = data.title || "";
      authorName = data.author_name || "Việt Nam Travel";
    }

    // Lấy thumbnail chất lượng cao nhất của YouTube (thử hqdefault trước để đảm bảo 100% video đều có ảnh)
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return NextResponse.json({
      success: true,
      videoId,
      title,
      author: authorName,
      thumbnail,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin YouTube:", error);
    return NextResponse.json(
      { error: "Không thể lấy thông tin video. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}

