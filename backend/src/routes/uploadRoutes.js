// // backend/src/routes/uploadRoutes.js
// import express from "express";
// import multer from "multer";
// import extractText from "../services/extractText.js";

// const upload = multer({ dest: "uploads/" });
// const router = express.Router();

// let policyText = "";
// let reportsText = [];

// router.post("/upload-policy", upload.single("file"), async (req, res) => {
//     try {
//         const text = await extractText(req.file);
//         policyText = text;
//         res.json({ message: "✅ Policy uploaded successfully" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Failed to process policy" });
//     }
// });

// router.post("/upload-report", upload.single("file"), async (req, res) => {
//     try {
//         const text = await extractText(req.file);
//         reportsText.push(text);
//         res.json({ message: "✅ Report uploaded successfully" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Failed to process report" });
//     }
// });

// router.get("/data", (req, res) => {
//     res.json({ policyText, reportsText });
// });

// export function getPolicy() {
//     return policyText;
// }

// export function getReports() {
//     return reportsText;
// }

// export default router; // ✅ Default Export









// backend/src/routes/uploadRoutes.jsimport express from "express";
import multer from "multer";
import express from "express";
import  extractText  from "../services/extractText.js";
import fs from "fs";
const router = express.Router();

// Uploads ke liye storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Policy Upload Route
router.post("/upload-policy", upload.single("file"), async (req, res) => {
  try {
    const text = await extractText(req.file);
    console.log("✅ Extracted Text (Policy):", text.slice(0, 200));

    // 🔥 Yahi pe save kar do
    fs.writeFileSync("uploads/policyText.txt", text, "utf-8");

    res.json({ message: "Policy uploaded and processed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process policy" });
  }
});

// Report Upload Route
router.post("/upload-report", upload.single("file"), async (req, res) => {
  try {
    console.log("🔹 File received:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const extractedText = await extractText(req.file);

    console.log("✅ Extracted Text (Report):", extractedText.slice(0, 200));

    res.json({ message: "Report uploaded & text extracted successfully" });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ error: "Failed to process report file" });
  }
});

export default router;
