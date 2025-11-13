import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SchemeList() {
  const [schemes, setSchemes] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE + "/api";

useEffect(() => {
  axios.get(`${API_BASE}/govt-schemes/list`)
    .then(res => setSchemes(res.data.schemes))
    .catch(err => console.error(err));
}, []);

  return (
    <div>
      <h2>Existing Govt Schemes</h2>
      {schemes.map((s, idx) => (
        <div key={idx}>
          <h3>{s.schemeName}</h3>
          <p><strong>Diseases:</strong> {s.coveredDiseases.join(', ')}</p>
          <p><strong>Limit:</strong> {s.maxClaimLimit}</p>
          <p><strong>Description:</strong> {s.description}</p>
        </div>
      ))}
    </div>
  );
}
