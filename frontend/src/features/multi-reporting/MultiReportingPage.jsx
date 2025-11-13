// import React, { useMemo, useState } from 'react';
// import ReportUploader from './components/ReportUploader.jsx';
// import PolicyUploader from './components/PolicyUploader.jsx';
// import AnalyzePanel from './components/AnalyzePanel.jsx';
// import ResultsTable from './components/ResultsTable.jsx';
// import ExplainModal from './components/ExplainModal.jsx';

// export default function MultiReportingPage() {
//   const [reports, setReports] = useState([]); // {reportId, filename, extractedMeta}
//   const [policy, setPolicy] = useState(null); // {policyId, clauses}
//   const [rows, setRows] = useState([]);
//   const [explainRow, setExplainRow] = useState(null);

//   const canAnalyze = useMemo(() => reports.length >= 2 && !!policy, [reports, policy]);

//   return (
//     <div style={{ maxWidth: 1000, margin: '20px auto', padding: 16 }}>
//       <h2 className='text-4xl font-medium text-blue-900 text-center' >Multiple Reporting and clause</h2>
//       <div className='flex flex-row h-15 align-items-center justify-between' >
//       <p style={{ marginTop: 6, opacity: 0.8, boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px' }} className=' px-5 rounded-full py-3.5'>Upload reports one by one (min 2, max 5)</p>
//       <p style={{ marginTop: 6, opacity: 0.8, boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px' }} className=' px-5 rounded-full py-3.5'>Upload reports one by one (min 2, max 5)</p>
//       </div>
//       <ReportUploader onUploaded={(r) => setReports(prev => [...prev, r])}
//         onRemoved={(id) => setReports(prev => prev.filter(x => x.reportId !== id))} />

//       <div style={{ opacity: reports.length >= 2 ? 1 : 0.5, pointerEvents: reports.length >= 2 ? 'auto' : 'none' }}>
//         <PolicyUploader onUploaded={(p) => setPolicy(p)} />
//       </div>

//       <AnalyzePanel canAnalyze={canAnalyze}
//         reports={reports} policy={policy}
//         onAnalyzed={(res) => setRows(res.rows || [])} />

//       <ResultsTable rows={rows} onExplain={(row) => setExplainRow(row)} />

//       {explainRow && (
//         <ExplainModal row={explainRow} onClose={() => setExplainRow(null)} />
//       )}
//     </div>
//   );
// }




























import React, { useMemo, useState, useEffect, useRef } from "react";
import gsap from "gsap";
import ReportUploader from "./components/ReportUploader.jsx";
import PolicyUploader from "./components/PolicyUploader.jsx";
import AnalyzePanel from "./components/AnalyzePanel.jsx";
import ResultsTable from "./components/ResultsTable.jsx";
import ExplainModal from "./components/ExplainModal.jsx";
import "./marquee.css"; // 👈 CSS for marquee only
import { useTranslation } from 'react-i18next';

export default function MultiReportingPage() {
  const [reports, setReports] = useState([]);
  const [policy, setPolicy] = useState(null);
  const [rows, setRows] = useState([]);
  const [explainRow, setExplainRow] = useState(null);
   const { t } = useTranslation();
  const canAnalyze = useMemo(
    () => reports.length >= 2 && !!policy,
    [reports, policy]
  );

  const headerRef = useRef(null);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);

  useEffect(() => {
    // Heading animation
    gsap.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Container fade
    gsap.from(containerRef.current, {
      opacity: 0,
      duration: 1.2,
      delay: 0.3,
      ease: "power2.inOut",
    });

    // Sections stagger
    gsap.from(sectionRefs.current, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      delay: 0.5,
      ease: "back.out(1.7)",
    });
  }, []);

  return (
    <div className="bg-[#f5f5f5]">
      <div
        ref={containerRef}
        className="container-blur max-w-5xl bg-[#f5f5f5] mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        {/* Heading */}
        <h2
          ref={headerRef}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 text-center mb-6"
        >
          {t('Multiple Reporting and Clause')}
        </h2>

        {/* Marquee (CSS only) */}
        <div className="marquee-container mb-8 ">
          <div className="marquee-track">
            {Array.from({ length: 10 }).map((_, i) => (
              <p
                key={i}
                className="px-6 py-4 rounded-full shadow-md bg-[#f5f5f5] text-center text-base sm:text-lg"
              >
                {t('Upload reports one by one (min 2, max 5)')}
              </p>
            ))}
          </div>
        </div>

        {/* Report Uploader */}
        <div ref={(el) => (sectionRefs.current[0] = el)} className="mb-6 rounded-xl"
          style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset" }}
        >
          <ReportUploader
            onUploaded={(r) => setReports((prev) => [...prev, r])}
            onRemoved={(id) =>
              setReports((prev) => prev.filter((x) => x.reportId !== id))
            }
          />
        </div>

        {/* Policy Uploader */}
        <div
          ref={(el) => (sectionRefs.current[1] = el)}
          style={{
            opacity: reports.length >= 2 ? 1 : 0.5,
            pointerEvents: reports.length >= 2 ? "auto" : "none",
            boxShadow: "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
          }}
          
     
          className="mb-6 rounded-2xl"
        >
          <PolicyUploader onUploaded={(p) => setPolicy(p)} />
        </div>

        {/* Analyze Panel */}
        <div ref={(el) => (sectionRefs.current[2] = el)} className="mb-6 " 
          
          
          >
          <AnalyzePanel
            canAnalyze={canAnalyze}
            reports={reports}
            policy={policy}
            onAnalyzed={(res) => setRows(res.rows || [])}
          />
        </div>

        {/* Results Table */}
        <div ref={(el) => (sectionRefs.current[3] = el)} className="mb-6 rounded-2xl"
          
          style={{boxShadow: "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",}}
          >
          <ResultsTable rows={rows} onExplain={(row) => setExplainRow(row)} />
        </div>

        {/* Explain Modal */}
        {explainRow && (
          <ExplainModal row={explainRow} onClose={() => setExplainRow(null)} />
        )}
      </div>
    </div>
  );
}
