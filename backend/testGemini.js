// backend/testGemini.js
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

async function testGemini() {
  try {
    const prompt = "Say hello! This is a test from Gemini.";

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("✅ Gemini Response:");
    console.log(response.data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("❌ Gemini API Error:");
    console.error(error?.response?.data || error.message);
  }
}

testGemini();
