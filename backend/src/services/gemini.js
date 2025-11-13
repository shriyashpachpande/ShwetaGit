import path from 'path';
import mime from 'mime-types';
import { GoogleGenAI, createPartFromUri } from '@google/genai';

const MODEL = 'gemini-2.0-flash';
const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('GEMINI/GOOGLE_API_KEY missing');

export const ai = new GoogleGenAI({ apiKey });

export async function uploadToGemini(filePath) {
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  const file = await ai.files.upload({
    file: filePath,
    config: { mimeType }
  });
  return file;
}

export function partFromFile(file) {
  return createPartFromUri(file.uri, file.mimeType);
}

export async function generateFromParts(parts) {
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: parts
  });
  return res.text;
}
