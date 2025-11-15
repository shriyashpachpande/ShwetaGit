// // backend/src/services/geminiService.js
// import axios from "axios";

// export async function askGemini(prompt) {
//   console.log("🔹 Gemini Prompt:", prompt.slice(0, 100) + "..."); // First 100 chars
//   try {
//     const url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
//     console.log("🌍 Calling Gemini API:", url);

//     const response = await axios.post(
//       url,
//       {
//         contents: [{ parts: [{ text: prompt }] }],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "x-goog-api-key": process.env.GEMINI_API_KEY,
//         },
//         timeout: 10000, // 10s timeout
//       }
//     );

//     console.log("🔹 Raw Gemini Response:", JSON.stringify(response.data, null, 2));
//     return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";

//   } catch (err) {
//     console.error("❌ Gemini API Full Error:", err.response?.data || err.message || err);
//     throw new Error(err.response?.data?.error?.message || "Gemini API failed");
//   }
// }









// backend/src/services/geminiService.js
import axios from "axios";

export async function askGemini(prompt) {
  console.log("🔹 Gemini Prompt:", prompt.slice(0, 100) + "..."); // First 100 chars
  try {
    // ✅ Corrected API endpoint (v1 → v1beta)
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    console.log("🌍 Calling Gemini API:", url);

    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        timeout: 10000, // 10s timeout
      }
    );

    console.log("🔹 Raw Gemini Response:", JSON.stringify(response.data, null, 2));

    // ✅ Safe text extraction
    return (
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini"
    );

  } catch (err) {
    console.error("❌ Gemini API Full Error:", err.response?.data || err.message || err);
    throw new Error(err.response?.data?.error?.message || "Gemini API failed");
  }
}
