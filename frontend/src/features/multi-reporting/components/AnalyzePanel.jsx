import React, { useState } from 'react';
import { postJson } from '../../../libs/api-client.js';
import { useTranslation } from 'react-i18next';

export default function AnalyzePanel({ canAnalyze, reports, policy, onAnalyzed }) {
    const [loading, setLoading] = useState(false);
   const { t } = useTranslation();
    const analyze = async () => {
        if (!canAnalyze) return;
        setLoading(true);
        try {
            const body = {
                reportIds: reports.map(r => r.reportId),
                policyId: policy.policyId,
            };
            const res = await postJson('/api/multi-analyze', body);
            onAnalyzed?.(res);
        } catch (e) {
            alert('Analyze failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 16px' }}>
            <button onClick={analyze} disabled={!canAnalyze || loading}
            className='px-3 py-2 rounded-2xl hover:hover:bg-[#e8e5e5c8] cursor-pointer'
            style={{boxShadow: "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",}}
            >
                {t(loading ? 'Analyzing…' : 'Analyze')}
            </button>
            {!canAnalyze && <small>{t('Need at least 2 reports and a policy.')}</small>}
        </div>
    );
}