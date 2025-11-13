import express from "express";
import GovtScheme from "../models/govtScheme.model.js";

const router = express.Router();

// Add new scheme (from SchemeForm)
router.post("/add", async (req, res) => {
  try {
    const { schemeName, coveredDiseases, maxClaimLimit, description } = req.body;
    const scheme = new GovtScheme({
      schemeName,
      coveredDiseases,
      maxClaimLimit,
      description
    });
    await scheme.save();
    res.json({ success: true, scheme });
  } catch (error) {
    res.status(500).json({ error: "Error adding scheme" });
  }
});

// ✅ Check if disease is covered under govt scheme
router.post("/check", async (req, res) => {
  try {
    let { diagnosis } = req.body;

    if (!diagnosis) {
      return res.json({ covered: false, schemes: [] });
    }

    // ✅ Remove things like (Stage 3), (Type 2) etc.
    const keyword = diagnosis.replace(/\(.*?\)/g, "").trim();

    console.log("Checking schemes for keyword:", keyword);

    const schemes = await GovtScheme.find({
      coveredDiseases: { $regex: new RegExp(keyword, "i") }
    });

    if (schemes.length === 0) {
      return res.json({ covered: false, schemes: [] });
    }

    res.json({ covered: true, schemes });
  } catch (error) {
    res.status(500).json({ error: "Error checking scheme" });
  }
});


export default router;
