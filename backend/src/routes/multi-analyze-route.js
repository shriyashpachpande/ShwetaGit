import express from 'express';
import { analyzeBundle } from '../controllers/multi-analyze-controller.js';

const router = express.Router();
router.post('/', analyzeBundle);

export default router;