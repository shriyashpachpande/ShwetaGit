import fetch from 'node-fetch';

const GEMINI_MODEL = 'gemini-1.5-flash';

export const analyzeWithGemini = async ({ reports, clauses }) => {
    // Prepare compact prompt
    const instructions = `You are an insurance policy analyzer. For each report diagnosis, decide Covered/Not Covered. Return JSON array of rows with fields: reportFile, name, age, diagnosis, treatment, covered (Yes/No), policyClause(id + short title), limit, confidence(0 - 100), explain(1 - 2 lines). Use clause ids from input. Prefer inclusion over exclusion only if exclusion doesn't apply.`;
    const input = {
        reports: reports.map(r => ({
            reportFile: r.filename,
            name: r.extracted?.name || '',
            age: r.extracted?.age || null,
            diagnoses: r.extracted?.diagnoses || [],
            treatments: r.extracted?.treatments || [],
            text: (r.text || '').slice(0, 4000),
        })),
        clauses: clauses.map(c => ({ id: c.id, text: c.text, type: c.type, limit: c.limit || '' })),
    };

    // Minimal HTTP call; adjust to your Gemini SDK if preferred
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                { role: 'user', parts: [{ text: instructions }, { text: JSON.stringify(input) }] }
            ]
        }),
    });

    if (!resp.ok) {
        const t = await resp.text();
        throw new Error(`Gemini API error: ${resp.status} ${t}`);
    }
    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    let rows = [];
    try { rows = JSON.parse(text); } catch { rows = []; }
    return Array.isArray(rows) ? rows : [];
};