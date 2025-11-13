// import fs from 'fs';
// import path from 'path';
// import textract from 'textract';
// import Tesseract from 'tesseract.js';

// // Lazy-import pdf-parse to avoid boot-time ENOENT quirks
// export async function extractTextSmart(filePath, mimeType) {
//   const ext = path.extname(filePath).toLowerCase();

//   if (mimeType?.includes('pdf') || ext === '.pdf') {
//     try {
//       const { default: pdfParse } = await import('pdf-parse');
//       const buffer = fs.readFileSync(filePath);
//       const data = await pdfParse(buffer);
//       if (data.text?.trim()) return data.text;
//     } catch {}
//   }

//   if (mimeType?.includes('word') || ['.docx', '.doc', '.rtf', '.txt'].includes(ext)) {
//     try {
//       const text = await new Promise((resolve, reject) => {
//         textract.fromFileWithPath(filePath, (err, txt) => (err ? reject(err) : resolve(txt)));
//       });
//       if (text?.trim()) return text;
//     } catch {}
//   }

//   if (mimeType?.startsWith('image/') || ['.png', '.jpg', '.jpeg', '.tiff', '.tif'].includes(ext)) {
//     try {
//       const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
//       if (text?.trim()) return text;
//     } catch {}
//   }
// if (ext === '.txt') {
//   try {
//     const txt = fs.readFileSync(filePath, 'utf-8');
//     if (txt?.trim()) return txt;
//   } catch {}
// }

//   try {
//     return fs.readFileSync(filePath, 'utf-8');
//   } catch {
//     return '';
//   }
// }













import fs from 'fs/promises';
import fscb from 'fs';
import path from 'path';
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js'; // optional
import mammoth from 'mammoth';

function norm(s='') {
  return String(s).replace(/\r\n/g, '\n').replace(/\u00A0/g,' ').trim();
}

export async function extractTextSmart(filePath, mimeType) {
  const ext = path.extname(filePath).toLowerCase();
  const m = (mimeType || '').toLowerCase();

  // PDF
  if (m.includes('pdf') || ext === '.pdf') {
    try {
      const { default: pdfParse } = await import('pdf-parse');
      const buf = await fs.readFile(filePath);
      const data = await pdfParse(buf);
      if (data?.text?.trim()) return norm(data.text);
    } catch {}
  }

  // DOCX first with mammoth (more reliable than textract for docx)
  if (ext === '.docx' || m.includes('officedocument.wordprocessingml.document')) {
    try {
      const buf = await fs.readFile(filePath);
      const { value } = await mammoth.extractRawText({ buffer: buf });
      if (value?.trim()) return norm(value);
    } catch {}
  }

  // Legacy DOC/RTF/TXT via textract (optional)
  if (m.includes('word') || ['.doc', '.rtf', '.txt'].includes(ext)) {
    try {
      const textract = (await import('textract')).default || (await import('textract'));
      const text = await new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, (err, txt) => (err ? reject(err) : resolve(txt)));
      });
      if (text?.trim()) return norm(text);
    } catch {}
  }

  // Images → OCR
  if (m.startsWith('image/') || ['.png', '.jpg', '.jpeg', '.tiff', '.tif', '.webp'].includes(ext)) {
    try {
      // Simple Tesseract call; for best results add pre-processing pipeline (sharp/threshold) if needed.
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.%:/()- ',
      });
      if (text?.trim()) return norm(text);
    } catch {}
  }

  // Plain text
  if (ext === '.txt' || m.includes('text/')) {
    try {
      const txt = await fs.readFile(filePath, 'utf-8');
      if (txt?.trim()) return norm(txt);
    } catch {}
  }

  // Last‑resort raw read
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return norm(raw);
  } catch {
    try {
      const buf = await fs.readFile(filePath);
      return norm(buf.toString('utf8'));
    } catch {
      return '';
    }
  }
}
