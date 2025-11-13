// backend/src/controllers/chatController.js
import callGemini from "../services/geminiService.js";
import { getPolicy, getReports } from "../routes/uploadRoutes.js";

export async function chatController(req, res) {
  const { query } = req.body;
  const policyText = getPolicy();
  const reportsText = getReports();

  if (!policyText) {
    return res.json({ answer: "⚠️ Please upload your insurance policy first!" });
  }

  const combinedReports = reportsText.join("\n");
  const prompt = `
You are an AI Insurance Assistant. 
Policy Document:
${policyText}

Medical Reports (if any):
${combinedReports || "No reports uploaded"}

User Query: ${query}

Give a detailed, clear answer:
1. Coverage: Covered/Not Covered
2. Reasoning
3. Clause Reference (if available)
  `;

  try {
    const answer = await callGemini(prompt);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed to respond" });
  }
}
