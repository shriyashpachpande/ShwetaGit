import { useState } from 'react';
import axios from 'axios';

export default function CheckCoverage() {
  const [diagnosis, setDiagnosis] = useState('');
  const [result, setResult] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE + "/api";

const handleCheck = async () => {
  try {
    const res = await axios.post(`${API_BASE}/analyze/check-coverage`, { diagnosis });
    setResult(res.data);
  } catch (e) {
    alert('Coverage check failed.');
    console.error(e);
  }
};

  return (
    <div>
      <h2>Check Govt Scheme Coverage</h2>
      <input type="text" placeholder="Enter Diagnosis" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
      <button onClick={handleCheck}>Check Coverage</button>

      {result && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#eef' }}>
          {result.isCovered ? (
            <>
              ✅ Covered under <strong>{result.schemeName}</strong><br />
              Limit: {result.limit}<br />
              Note: {result.description}
            </>
          ) : (
            <>
              ❌ No matching government scheme found for this diagnosis.
            </>
          )}
        </div>
      )}
    </div>
  );
}
