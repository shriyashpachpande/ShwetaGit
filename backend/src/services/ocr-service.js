// import tesseract from 'node-tesseract-ocr';

// export const ocrImageOrScannedPdf = async (filePath) => {
//     const config = {
//         lang: process.env.OCR_LANG || 'eng',
//         oem: 1,
//         psm: 3,
//     };
//     const text = await tesseract.recognize(filePath, config);
//     return text?.trim() || '';
// };




import tesseract from 'node-tesseract-ocr';
import path from 'path';

export const ocrImageOrScannedPdf = async (filePath) => {
    const tesseractPath = '"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"';
    const config = {
        lang: process.env.OCR_LANG || 'eng',
        oem: 1,
        psm: 3,
        binary: tesseractPath,
    };
    const text = await tesseract.recognize(filePath, config);
    return text?.trim() || '';
};

