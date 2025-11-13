export function exportRowsToCsv(filename, rows) {
    const headers = ['Report File', 'Name', 'Age', 'Diagnosis', 'Treatment', 'Covered', 'Policy Clause', 'Limit', 'Confidence'];
const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const lines = [headers.join(',')].concat(
    rows.map(r => [
        r.reportFile, r.name, r.age, r.diagnosis, r.treatment, r.covered, r.policyClause, r.limit, r.confidence
    ].map(escape).join(','))
);
const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = filename;
a.click();
}