import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";

// normalize text
function norm(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Extracts text from a file (PDF or TXT) and saves a normalized .txt copy if input is PDF.
 * @param {string} filePath - Path to file
 * @returns {Promise<string>} Extracted text
 */
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

      // save alongside as .txt
      const txtPath = filePath.replace(/\.[^.]+$/, ".txt");
      await fs.writeFile(txtPath, text, "utf-8");

      return text;
    } else {
      throw new Error("No text could be extracted from PDF.");
    }
  }

  throw new Error(`Unsupported file type: ${ext}`);
}
