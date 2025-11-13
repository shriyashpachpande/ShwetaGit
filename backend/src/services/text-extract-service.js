import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

export const extractTxtFromTxt = async (filePath) => fs.readFileSync(filePath, 'utf8');

export const extractTxtFromPdf = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const { text } = await pdf(dataBuffer);
    return text?.trim() || '';
};

export const extractTxtFromDoc = async (filePath) => {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return value?.trim() || '';
};