import express from 'express';
import GovtScheme from '../models/GovtScheme.js';

const router = express.Router();

// Add new scheme (no auth middleware, simple PoC for hackathon)
router.post('/add', async (req, res) => {
  const { schemeName, coveredDiseases, maxClaimLimit, description } = req.body;

  const newScheme = await GovtScheme.create({
    schemeName,
    coveredDiseases,
    maxClaimLimit,
    description
  });

  res.json({ ok: true, scheme: newScheme });
});

// List all schemes
router.get('/list', async (req, res) => {
  const schemes = await GovtScheme.find({});
  res.json({ schemes });
});

export default router;
