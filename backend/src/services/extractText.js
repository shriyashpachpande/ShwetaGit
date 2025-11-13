import fs from "fs";
import textract from "textract";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";


async function extractPDF(path) {
  const data = new Uint8Array(fs.readFileSync(path));
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  let textContent = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    textContent += strings.join(" ") + "\n";
  }

  return textContent.trim();
}

async function extractText(file) {
  const mime = file.mimetype;
  const path = file.path;

  if (!path || !fs.existsSync(path)) {
    throw new Error(`Uploaded file not found: ${path}`);
  }

  console.log(`📂 Processing: ${path} (MIME: ${mime})`);

  // ✅ PDFs via pdfjs-dist
  if (mime === "application/pdf") {
    console.log("📄 Extracting text from PDF...");
    return await extractPDF(path);

  // ✅ Images → OCR
  } else if (mime.startsWith("image/")) {
    console.log("🖼️ Running OCR on image...");
    const {
      data: { text },
    } = await Tesseract.recognize(path, "eng");
    return text.trim();

  // ✅ Other docs → textract
  } else {
    console.log("📜 Extracting text via Textract...");
    return new Promise((resolve, reject) => {
      textract.fromFileWithPath(path, { preserveLineBreaks: true }, (err, text) => {
        if (err) reject(err);
        else resolve(text ? text.trim() : "");
      });
    });
  }
}

export default extractText;
