import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";

function norm(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function extractTextSmart(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".txt") {
    const raw = await fs.readFile(filePath, "utf-8");
    return norm(raw);
  }

  if (ext === ".pdf") {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);

    if (data?.text?.trim()) {
      const text = norm(data.text);

      const txtPath = filePath.replace(/\.[^.]+$/, ".txt");
      await fs.writeFile(txtPath, text, "utf-8");

      return text;
    } else {
      throw new Error("No text could be extracted from PDF.");
    }
  }

  throw new Error(`Unsupported file type: ${ext}`);
}
