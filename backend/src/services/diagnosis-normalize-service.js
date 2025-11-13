const DIAG_MAP = [
    [/^(t2dm|type\s2\sdm|type\s2\sdiabetes)/i, 'Type 2 Diabetes Mellitus'],
    [/(hypothyroid)/i, 'Hypothyroidism'],
    [/(hypertension|htn)/i, 'Hypertension'],
];

export const normalizeDiagnosis = (s) => {
    if (!s) return s;
    for (const [re, norm] of DIAG_MAP) {
        if (re.test(s)) return norm;
    }
    return s;
};