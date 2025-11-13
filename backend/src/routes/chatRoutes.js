// backend/src/routes/chatRoutes.js
import express from "express";
import { askGemini } from "../services/geminiService.js";
import fs from "fs";

const router = express.Router();

function getPolicyText() {
  try {
    return fs.readFileSync("uploads/policyText.txt", "utf-8");
  } catch {
    console.error("⚠️ Policy text file nahi mila.");
    return "";
  }
}

router.post("/chatbot", async (req, res) => {
  try {
    console.log("🔹 Chatbot endpoint hit!");
    const { query } = req.body;
    console.log("📩 User Prompt:", query);

    if (!query) {
      console.error("❌ Query missing in request!");
      return res.status(400).json({ error: "Query is required" });
    }

    const policyText = getPolicyText();
    if (!policyText) {
      console.error("❌ Policy text empty hai.");
      return res.status(400).json({ error: "Policy file not uploaded." });
    }

    const prompt = `
      Tum ek insurance policy analyzer ho.
      Niche user ki policy ka text hai:

      ${policyText}

      User ka sawaal: ${query}

      Policy ke clauses ke basis pe,
      sirf factual jawab do. Agar cover hai,
      reason aur section number batao.
    `;
    console.log("⚡ Sending prompt to Gemini API...");

    const answer = await askGemini(prompt);
    console.log("✅ Gemini Response Mili!");
    return res.json({ answer });

  } catch (err) {
    console.error("❌ Chatbot Route Crash:", err);
    return res.status(500).json({ error: err.message || "Gemini call failed" });
  }
});

export default router;
