import express from 'express';
import multer from 'multer';
import path from 'path';
import { makeDiskStorage } from '../utils/multer-config.js';
import { UPLOAD_SUBFOLDERS } from '../config/constants.js';
import { uploadReport, removeReport } from '../controllers/multi-report-controller.js';

const router = express.Router();
const storage = makeDiskStorage(path.resolve(process.cwd(), 'uploads', 'multi-report'));
const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadReport);
router.delete('/:id', removeReport);

export default router;