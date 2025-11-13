import express from "express";
import multer from "multer";
import { analyzeMedicalImage } from "../controllers/medicalAnalysisController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), analyzeMedicalImage);

export default router;
