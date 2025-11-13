import React from 'react';

export default function ExplainModal({ row, onClose }) {
    if (!row) return null;
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{ background: '#fff', padding: 16, borderRadius: 8, maxWidth: 600, width: '90%' }}>
                <h3>Explanation</h3>
                <p><b>Diagnosis:</b> {row.diagnosis}</p>
                <p><b>Covered:</b> {row.covered}   <b>Confidence:</b> {row.confidence}%</p>
                <p><b>Clause:</b> {row.policyClause}</p>
                <p style={{ whiteSpace: 'pre-wrap' }}>{row.explain || '—'}</p>
                <div style={{ textAlign: 'right' }}>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}