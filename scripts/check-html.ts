import fs from "fs";
import path from "path";
import { parseDocxBuffer } from "../src/lib/docx-parser";

async function checkHtml() {
  const filePath = path.join(process.cwd(), "sample-articles", "1-van-hoa-dem-xoe-thai-yen-bai.docx");
  const buffer = fs.readFileSync(filePath);
  const result = await parseDocxBuffer(buffer);
  
  console.log("=== THUMBNAIL ===");
  console.log(result.thumbnail);
  console.log("=== HAS FIGURE TAG? ===");
  console.log(result.content.includes("<figure"));
  console.log("=== HAS IMG TAG? ===");
  console.log(result.content.includes("<img"));

  // Tìm vị trí chứa thẻ figure hoặc img
  const idx = result.content.indexOf("<figure");
  if (idx !== -1) {
    console.log("=== FIGURE HTML SNIPPET ===");
    console.log(result.content.substring(idx, idx + 400));
  } else {
    console.log("Full Content:\n", result.content);
  }
}

checkHtml().catch(console.error);
