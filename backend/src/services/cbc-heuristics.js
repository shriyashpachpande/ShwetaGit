// Robust regex-based CBC parser for OCR/text variants
export function parseCbcHeuristics(raw) {
  const text = String(raw || '').replace(/\r\n/g, '\n');

  const num = (s) => {
    if (!s) return null;
    const v = String(s).replace(/[, ]/g, '').trim();
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  };
  const pick = (re) => {
    const m = text.match(re);
    return m ? num(m[1]) : null;
  };

  // Common label variants
  const haemoglobin = pick(/hae?moglobin(?:\s*\(hb\))?\s*[:\-]?\s*([\d.]+)/i);
  const wbc = pick(/\bwbc\s*(?:count)?\s*[:\-]?\s*([\d.]+)/i);
  const rbc = pick(/\brbc\s*(?:count)?\s*[:\-]?\s*([\d.]+)/i);
  const plate = pick(/platelet\s*(?:count)?\s*[:\-]?\s*([\d.]+)/i);
  const hct = pick(/\bhct\b\s*[:\-]?\s*([\d.]+)/i);
  const mcv = pick(/\bmcv\b\s*[:\-]?\s*([\d.]+)/i);
  const mch = pick(/\bmch\b\s*[:\-]?\s*([\d.]+)/i);
  const mchc = pick(/\bmchc\b\s*[:\-]?\s*([\d.]+)/i);
  const rdw = pick(/\brdw[- ]?cv?\b\s*[:\-]?\s*([\d.]+)/i);

  const pct = (label) => {
    const m = text.match(new RegExp(`${label}\\s*[:\\-]?\\s*(\\d{1,3})\\s*%`, 'i'));
    return m ? parseInt(m[1], 10) : null;
  };

  // Unit-aware scaling for 10^3/µL contexts
  const has10e3 = (key) => {
    const re = new RegExp(`${key}[^\\n]{0,60}10\\^?3\\s*\\/\\s*(?:u|μ)l`, 'i');
    return re.test(text);
  };
  const wbcFinal = wbc != null ? (has10e3('wbc') ? Math.round(wbc * 1000) : wbc) : null;
  const plateFinal = plate != null ? (has10e3('platelet') ? Math.round(plate * 1000) : plate) : null;

  return {
    haemoglobin_g_dl: haemoglobin,
    rbc_million_per_cumm: rbc, // keep numeric; unit is typically 10^6/uL
    wbc_per_cumm: wbcFinal,
    platelets_per_cumm: plateFinal,
    haematocrit_pct: hct,
    mcv_fl: mcv,
    mch_pg: mch,
    mchc_g_dl: mchc,
    rdw_fl: rdw,
    diff_wbc_pct: {
      neutrophils: pct('neutrophils'),
      lymphocytes: pct('lymphocytes'),
      eosinophils: pct('eosinophils'),
      monocytes: pct('monocytes'),
      basophils: pct('basophils'),
    }
  };
}
