import { S3Client, PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL;

export const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
  maxAttempts: 4, // Tự động thử lại ở tầng SDK
});

/**
 * Uploads a buffer to Cloudflare R2 với cơ chế tự động thử lại (Auto-retry)
 */
export async function uploadBufferToR2(
  buffer: Buffer,
  filename: string,
  contentType: string,
  maxRetries = 3
): Promise<string> {
  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    throw new Error("Cloudflare R2 chưa được cấu hình đầy đủ trong biến môi trường.");
  }

  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
      });

      await s3Client.send(command);

      const baseUrl = publicUrl.endsWith("/") ? publicUrl.slice(0, -1) : publicUrl;
      return `${baseUrl}/${filename}`;
    } catch (err: any) {
      lastError = err;
      console.warn(`[R2 Upload] Lần thử ${attempt}/${maxRetries} thất bại: ${err.message}. Đang thử lại...`);
      if (attempt < maxRetries) {
        // Nghỉ tăng dần (500ms, 1000ms...) trước khi gửi lại
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }
  }

  throw new Error(`Lỗi tải ảnh lên Cloudflare R2 sau ${maxRetries} lần thử: ${lastError?.message}`);
}

/**
 * Xóa danh sách các file ảnh khỏi Cloudflare R2 khi gỡ bài viết
 */
export async function deleteFilesFromR2(keys: string[]) {
  if (!keys || keys.length === 0 || !bucketName) return;
  try {
    const command = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: keys.map((Key) => ({ Key })),
        Quiet: true,
      },
    });
    await s3Client.send(command);
  } catch (err) {
    console.warn("Không thể xóa file trên Cloudflare R2:", err);
  }
}

