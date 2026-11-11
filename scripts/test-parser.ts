import fs from "fs";
import path from "path";
import { parseDocxBuffer } from "../src/lib/docx-parser";

async function test() {
  const filePath = path.join(process.cwd(), "sample-articles", "1-van-hoa-dem-xoe-thai-yen-bai.docx");
  const buffer = fs.readFileSync(filePath);
  const result = await parseDocxBuffer(buffer);
  console.log("Title:", result.title);
  console.log("Image count:", result.imageCount);
  console.log("Thumbnail:", result.thumbnail);
  console.log("Content snippet:", result.content.substring(0, 500));
}

test().catch(console.error);
