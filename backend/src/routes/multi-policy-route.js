import express from 'express';
import multer from 'multer';
import path from 'path';
import { makeDiskStorage } from '../utils/multer-config.js';
import { UPLOAD_SUBFOLDERS } from '../config/constants.js';
import { uploadPolicy } from '../controllers/multi-policy-controller.js';

const router = express.Router();
const storage = makeDiskStorage(path.resolve(process.cwd(), 'uploads', 'multi-policy'));
const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadPolicy);

export default router;