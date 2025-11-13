import { hf } from "../utils/hfConfig.js";
import fs from "fs";

export const analyzeMedicalImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // image ko buffer me convert
    const imageBuffer = fs.readFileSync(req.file.path);

    // HF model call (example: vit image classification)
    const response = await hf.post(
      "/microsoft/resnet-50",   // model change kar sakte ho medical ke liye
      imageBuffer,
      { headers: { "Content-Type": "application/octet-stream" } }
    );

    // apna structure follow karne ke liye
    const result = response.data;

    res.json({
      Detailed_Analysis: "The image has been processed successfully.",
      Analysis_Report: result,
      Recommendations: "Consult with a Doctor before making any decisions.",
      Treatments: "Further tests may be required.",
    });
  } catch (error) {
    console.error("Error analyzing image:", error.message);
    res.status(500).json({ error: "Error analyzing image" });
  }
};
