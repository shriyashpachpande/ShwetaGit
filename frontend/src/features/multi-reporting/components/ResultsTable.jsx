// import React from 'react';
// import { exportRowsToCsv } from '../../../libs/csv-export.js';

// export default function ResultsTable({ rows, onExplain }) {
//     if (!rows?.length) return null;
//     return (
//         <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//                 <h3>Results</h3>
//                 <button onClick={() => exportRowsToCsv('multi-report-results.csv', rows)}>Download CSV</button>
//             </div>
//             <div style={{ overflowX: 'auto' }}>
//                 <table className="table">
//                     <thead>
//                         <tr>
//                             <th>Report File</th><th>Name</th><th>Age</th><th>Diagnosis</th><th>Treatment</th><th>Covered</th><th>Policy Clause</th><th>Limit</th><th>Confidence</th><th>Explain</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {rows.map((r, i) => (
//                             <tr key={i}>
//                                 <td>{r.reportFile}</td>
//                                 <td>{r.name}</td>
//                                 <td>{r.age}</td>
//                                 <td>{r.diagnosis}</td>
//                                 <td>{r.treatment}</td>
//                                 <td><b>{r.covered}</b></td>
//                                 <td>{r.policyClause}</td>
//                                 <td>{r.limit}</td>
//                                 <td>{r.confidence}%</td>
//                                 <td><button onClick={() => onExplain?.(r)}>View</button></td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }



























































import React from "react";
import { exportRowsToCsv } from "../../../libs/csv-export.js";
import { useTranslation } from 'react-i18next';

export default function ResultsTable({ rows, onExplain }) {
  const { t } = useTranslation();
  if (!rows?.length) return null;
  return (
    <div className="bg-[#f5f5f5] shadow-md rounded-xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <h3 className="text-xl font-semibold text-gray-800"> {t('Results')}</h3>
        <button
          onClick={() => exportRowsToCsv("multi-report-results.csv", rows)}
          className="px-4 py-2 rounded-lg bg-[#f5f5f5] text-gray-600 text-sm font-medium hover:bg-[#e8e5e5c8] cursor-pointer transition-all shadow-sm"
        >
          {t('Download CSV')}
        </button>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 text-center">{t('Report File')}</th>
              <th className="px-4 py-2 text-center">{t('Name')}</th>
              <th className="px-4 py-2 text-center">{t('Age')}</th>
              <th className="px-4 py-2 text-center">{t('Diagnosis')}</th>
              <th className="px-4 py-2 text-center">{t('Treatment')}</th>
              <th className="px-4 py-2 text-center">{t('Covered')}</th>
              <th className="px-4 py-2 text-center">{t('Policy Clause')}</th>
              <th className="px-4 py-2 text-center">{t('Limit')}</th>
              <th className="px-4 py-2 text-center">{t('Confidence')}</th>
              <th className="px-4 py-2 text-center">{t('Explain')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className="odd:bg-white even:bg-gray-50 transition-all hover:bg-[#e8e5e5c8]"
              >
                <td className="px-4 py-2 border border-gray-200">{r.reportFile}</td>
                <td className="px-4 py-2 border border-gray-200">{r.name}</td>
                <td className="px-4 py-2 border border-gray-200">{r.age}</td>
                <td className="px-4 py-2 border border-gray-200">{r.diagnosis}</td>
                <td className="px-4 py-2 text-justify border border-gray-200">{r.treatment}</td>
                <td className="px-4 py-2 font-semibold border border-gray-200 text-green-700">
                  {r.covered}
                </td>
                <td className="px-4 py-2 border border-gray-200">{r.policyClause}</td>
                <td className="px-4 py-2 border border-gray-200">{r.limit}</td>
                <td className="px-4 py-2 border border-gray-200">{r.confidence}%</td>
                <td className="px-4 py-2 border border-gray-200">
                  <button
                    onClick={() => onExplain?.(r)}
                    className="px-3 py-1 rounded-md bg-black text-white text-sm hover:bg-blue-900 cursor-pointer transition-all"
                  >
                    {t('View')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
