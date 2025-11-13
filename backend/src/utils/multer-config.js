import multer from 'multer';
import fs from 'fs';
import path from 'path';

export const makeDiskStorage = (folderPath) => {
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
    return multer.diskStorage({
        destination: (req, file, cb) => cb(null, folderPath),
        filename: (req, file, cb) => {
            const original = file.originalname.trim().replace(/\s+/g, '-');
            const ts = Date.now();
            cb(null, `${ts}-${original}`);
            console.log('Saving uploads to:', folderPath);
        },
    });
};