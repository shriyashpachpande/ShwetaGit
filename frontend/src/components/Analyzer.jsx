// // src/components/Analyzer.jsx
// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import gsap from "gsap";
// import demoVideo from "../assets/card4.mp4";
// import { speak } from "../utils/speak";
// import adminVideo from "../assets/analyzer.mp4"
// import { toggleSpeak } from "../utils/speak";
// import { useTranslation } from 'react-i18next';
// import Loading from "./Loading";


// const API = "http://localhost:5000/api";

// const Analyzer = () => {
//   const [reportFile, setReportFile] = useState(null);
//   const [reportText, setReportText] = useState("");
//   const [policyFile, setPolicyFile] = useState(null);
//   const [policyText, setPolicyText] = useState("");
//   const [report, setReport] = useState(null);
//   const [policy, setPolicy] = useState(null);
//   const [analysis, setAnalysis] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);


//   const reportRef = useRef(null);
//   const policyRef = useRef(null);
//   const analyzeRef = useRef(null);
//   const videoRef = useRef(null);

//   const { t, i18n } = useTranslation();
//   // GSAP animations
//   useEffect(() => {
//     gsap.from([reportRef.current, policyRef.current], {
//       y: 60,
//       opacity: 0,
//       duration: 1,
//       stagger: 0.2,
//       ease: "power3.out",
//     });

//     gsap.from([analyzeRef.current, videoRef.current], {
//       y: 80,
//       opacity: 0,
//       duration: 1.2,
//       stagger: 0.3,
//       ease: "power3.out",
//       delay: 0.3,
//     });

//     document.documentElement.style.scrollBehavior = "smooth";
//   }, []);

//   const uploadReport = async () => {
//     try {
//       setIsLoading(true);  // Start loading
//       const form = new FormData();
//       if (reportFile) form.append("file", reportFile);
//       else {
//         if (!reportText.trim()) return toast.error("Paste report text or choose a file");
//         form.append("textInput", reportText.trim());
//       }

//       // ✅ Add this line to send selected language to backend
//       form.append("language", i18n.language);

//       const { data } = await axios.post(`${API}/report/upload`, form, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setReport(data.report);
//       setPolicy(null);
//       setAnalysis(null);
//       toast.success("Report uploaded");
//     } catch (e) {
//       toast.error(e?.response?.data?.error || "Report upload failed");
//     }
//     finally {
//     setIsLoading(false);  // Stop loading
//   }
//   };


//   const uploadPolicy = async () => {
//     try {
//        setIsLoading(true);  // Start loading
//       const form = new FormData();
//       if (policyFile) form.append("file", policyFile);
//       else {
//         if (!policyText.trim()) return toast.error("Paste policy text or choose a file");
//         form.append("textInput", policyText.trim());
//       }
//       form.append("language", i18n.language);

//       form.append("policyName", "User Policy");
//       const { data } = await axios.post(`${API}/policy/upload`, form, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setPolicy(data.policy);
//       setAnalysis(null);
//       toast.success("Policy uploaded");
//     } catch (e) {
//       toast.error(e?.response?.data?.error || "Policy upload failed");
//     }
//     finally {
//     setIsLoading(false);  // Stop loading
//   }
//   };

//   const analyze = async () => {
//     try {
//        setIsLoading(true);  // Start loading
//       if (!report || !policy) return toast.error("Upload report and policy first");

//       const { data } = await axios.post(`${API}/analyze`, {
//         reportId: report._id,
//         policyId: policy._id,
//         language: i18n.language,  // 🔥 Send the selected language
//       });

//       setAnalysis(data.analysis);
//       toast.success("Analysis ready");
//     } catch (e) {
//       toast.error(e?.response?.data?.error || "Analyze failed");
//     }
//     finally {
//     setIsLoading(false);  // Stop loading
//   }
//   };


//   return (
//     <div className="w-full h-auto bg-transparent p-4 sm:p-6 lg:px-8 custom-scrollbar">
//        {/* Loading Animation */}
//     {isLoading && <Loading />}
//       {/* Top Row: Report & Policy */}

//       {/* Background video */}
//       <video
//         className="fixed inset-0 w-screen h-screen object-cover -z-9"
//         src={adminVideo}
//         autoPlay
//         muted
//         loop
//         playsInline
//         preload="auto"
//       />
//       <div className="fixed inset-0 bg-white opacity-70 -z-5"></div>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto mb-6 lg:px-[30px]">
//         {/* Report */}
//         <section
//           ref={reportRef}
//           className="bg-transparent backdrop-blur-md border-2 border-white shadow-lg rounded-xl p-6 transition-transform hover:scale-[1.02]"
//           style={{ boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px" }}
//         >
//           <h3 className="text-3xl font-bold mb-4 text-blue-950">{t('Report')}</h3>
//           <div className="flex-1">
//             <input
//               type="file"
//               accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
//               onChange={(e) => setReportFile(e.target.files[0] || null)}
//               className="p-2 rounded-md w-full mt-3 cursor-pointer text-gray-600"
//               style={{
//                 boxShadow:
//                   "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
//               }}
//             />
//           </div>
//           <div className="text-center mb-3 mt-3 text-gray-500">{t('or')}</div>
//           <textarea
//             rows={4}
//             placeholder={t('Paste report text...')}
//             value={reportText}
//             onChange={(e) => setReportText(e.target.value)}
//             className="flex-1 min-w-0 rounded-xl w-full px-3 py-2 border-1 border-white  text-blue-900 placeholder-gray-800 focus:outline-none sm:px-4 sm:py-2"
//             style={{
//               boxShadow:
//                 "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
//             }}
//           />
//           <button
//             onClick={uploadReport}
//             className="px-4 py-2 mt-5 bg-black/80 text-white rounded-md w-full font-bold cursor-pointer"
//             style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}
//           >
//             {t('Upload Report')}
//           </button>
//           {report && (
//             <div className="mt-4 divide-y divide-gray-400">
//               <div className="py-2 text-justify"><b>{t('Diagnosis')}:</b> {report.diagnosis || "-"}</div>
//               <div className="py-2 text-justify"><b>{t('Severity')}:</b> {report.severity || "-"}</div>
//               <div className="py-2 text-justify"><b>{t('Treatment')}:</b> {report.treatment || "-"}</div>
//               <div className="py-2 text-justify"><b>{t('Description')}:</b> {report.description || "-"}</div>
//               <div className="py-2 text-justify"><b>{t('Summary')}:</b> {report.summary || "-"}</div>

//               {/* 🔊 Listen Button */}
//               <button
//                 onClick={() =>
//                   toggleSpeak(
//                     `Diagnosis: ${report.diagnosis}. Severity: ${report.severity}. Treatment: ${report.treatment}. Description: ${report.description}. Summary: ${report.summary}`
//                   )
//                 }
//                 className="mt-3 px-3 py-2 cursor-pointer bg-[#f5f5f5] text-black rounded-md"
//                 style={{
//                   boxShadow:
//                     "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
//                 }}
//               >
//                 {t('🔊 Listen / Stop')}
//               </button>
//             </div>
//           )}

//         </section>

//         {/* Policy */}
//         <section
//           ref={policyRef}
//           className={`bg-[#f5f5f5 rounded-xl p-6 border-2 border-white transition-transform text-black mb-15 hover:scale-[1.02] ${!report ? "opacity-100" : ""}`}
//           style={{ boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px" }}
//         >
//           <h3 className="text-3xl font-bold mb-4 text-blue-950">{t('Policy')}</h3>
//           <input
//             type="file"
//             accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
//             onChange={(e) => setPolicyFile(e.target.files[0] || null)}
//             disabled={!report}
//             className="p-2 rounded-md w-full mt-3 cursor-pointer text-gray-600 disabled:cursor-not-allowed"
//             style={{
//               boxShadow:
//                 "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
//             }}
//           />
//           <div className="text-center mb-3 text-gray-500 py-2">{t('or')}</div>
//           <textarea
//             rows={4}
//             placeholder={t('Paste policy text...')}
//             value={policyText}
//             onChange={(e) => setPolicyText(e.target.value)}
//             disabled={!report}
//             className="flex-1 min-w-0 rounded-xl w-full px-3 py-2 border-1 border-white  text-blue-900 placeholder-gray-800 focus:outline-none sm:px-4 sm:py-2 disabled:cursor-not-allowed"
//             style={{
//               boxShadow:
//                 "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
//             }}
//           />
//           <button
//             onClick={uploadPolicy}
//             disabled={!report}
//             className="px-4 py-2 mt-5 bg-black/80 text-white rounded-md w-full font-bold cursor-pointer disabled:cursor-not-allowed"
//             style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}
//           >
//             {t('Upload Policy')}
//           </button>
//           {policy && (
//             <div className="mt-4 divide-y divide-gray-400">
//               <div className="py-2"><b>{t('Policy Name')}:</b> {policy.policyName}</div>
//               <div className="py-2"><b>{t('File')}:</b> {policy.filename || "—"}</div>
//               <div className="py-2"><b>{t('Clauses')}:</b> {policy.clauses?.length || 0}</div>
//             </div>
//           )}
//         </section>
//       </div>

//       {/* Bottom Row: Analyze & Video */}
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto lg:px-[30px]">
//         {/* Analyze (3/4) */}
//         <section
//           ref={analyzeRef}
//           className="bg-transparent border-2 border-white shadow-lg rounded-xl p-6 transition-transform hover:scale-[1.02] lg:col-span-3"
//           style={{ boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px" }}
//         >
//           <h3 className="text-3xl font-bold mb-4 text-blue-950">{t('Analyze')}</h3>
//           <button
//             onClick={analyze}
//             disabled={!report || !policy}
//             className="px-4 py-2 mt-5 bg-black/80  text-white rounded-md w-full font-bold cursor-pointer disabled:cursor-not-allowed"
//             style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}
//           >
//             {t('Compare Latest')}
//           </button>
//           {analysis && (
//             <div className="mt-4 divide-y divide-gray-400">
//               <div className="py-2"><b>{t('Decision')}:</b> {t(analysis.decision)}</div>
//               <div className="py-2"><b>{t('Clause')}:</b> {analysis.clauseRef || "-"}</div>
//               <div className="py-2"><b>{t('Limit')}:</b> {analysis.resultJson?.limit || "-"}</div>
//               <div className="py-2 text-justify"><b>{t('Justification')}:</b> {analysis.justification || "-"}</div>
//               <div className="py-2"><b>{t('Confidence')}:</b> {analysis.confidence || "-"}</div>
//               <button
//                 onClick={() =>
//                   toggleSpeak(
//                     `Decision: ${analysis.decision}. Clause: ${analysis.clauseRef || "-"}. Limit: ${analysis.resultJson?.limit || "-"}. Justification: ${analysis.justification || "-"}. Confidence: ${analysis.confidence || "-"}`
//                   )
//                 }
//                 className="mt-3 px-3 py-2 cursor-pointer bg-black/80  text-white rounded-md"
//                 style={{
//                   boxShadow:
//                     "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
//                 }}
//               >
//                 {t('🔊 Listen / Stop')}
//               </button>
//             </div>
//           )}
//         </section>

//         {/* Video (1/4) */}
//         <section
//           ref={videoRef}
//           className="bg-transparent shadow-lg rounded-xl p-6 flex border-2 border-white flex-col transition-transform hover:scale-[1.02] lg:col-span-1"
//           style={{ boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px" }}
//         >
//           <video
//             autoPlay
//             loop
//             muted
//             playsInline
//             className="w-full rounded-lg mb-4"
//           >
//             <source src={demoVideo} type="video/mp4" />
//             {t('Your browser does not support the video tag.')}
//           </video>
//           <div className="text-center">
//             <h3 className="text-xl font-bold mb-2 text-blue-900">{t('Automated Workflows')}</h3>
//             <p className="text-gray-600 text-justify">
//               {t('Automate workflows to streamline tasks, boost efficiency, and save time')}
//             </p>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Analyzer;



















































































// // src/components/Analyzer.jsx
// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import gsap from "gsap";
// import demoVideo from "../assets/card4.mp4";
// import { speak } from "../utils/speak";
// import adminVideo from "../assets/analyzer.mp4"
// import { toggleSpeak } from "../utils/speak";
// import { useTranslation } from 'react-i18next';
// import Loading from "./Loading";

// const API = "http://localhost:5000/api";

// const Analyzer = () => {
//   const [reportFile, setReportFile] = useState(null);
//   const [reportText, setReportText] = useState("");
//   const [policyFile, setPolicyFile] = useState(null);
//   const [policyText, setPolicyText] = useState("");
//   const [report, setReport] = useState(null);
//   const [policy, setPolicy] = useState(null);
//   const [analysis, setAnalysis] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const reportRef = useRef(null);
//   const policyRef = useRef(null);
//   const analyzeRef = useRef(null);
//   const videoRef = useRef(null);

//   const { t, i18n } = useTranslation();

//   // GSAP animations
//   useEffect(() => {
//     gsap.from([reportRef.current, policyRef.current], {
//       y: 60,
//       opacity: 0,
//       duration: 1,
//       stagger: 0.2,
//       ease: "power3.out",
//     });

//     gsap.from([analyzeRef.current, videoRef.current], {
//       y: 80,
//       opacity: 0,
//       duration: 1.2,
//       stagger: 0.3,
//       ease: "power3.out",
//       delay: 0.3,
//     });

//     document.documentElement.style.scrollBehavior = "smooth";
//   }, []);

//   const uploadReport = async () => {
//     try {
//       setIsLoading(true);  // Start loading
//       const form = new FormData();
//       if (reportFile) form.append("file", reportFile);
//       else {
//         if (!reportText.trim()) return toast.error("Paste report text or choose a file");
//         form.append("textInput", reportText.trim());
//       }
//       // ✅ send selected language to backend
//       form.append("language", i18n.language);

//       const { data } = await axios.post(`${API}/report/upload`, form,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       setReport(data.report);
//       setPolicy(null);
//       setAnalysis(null);
//       toast.success("Report uploaded");
//     } catch (e) {
//       toast.error(e?.response?.data?.error || "Report upload failed");
//     } finally {
//       setIsLoading(false);  // Stop loading
//     }
//   };

//   const uploadPolicy = async () => {
//     try {
//       setIsLoading(true);  // Start loading
//       const form = new FormData();
//       if (policyFile) form.append("file", policyFile);
//       else {
//         if (!policyText.trim()) return toast.error("Paste policy text or choose a file");
//         form.append("textInput", policyText.trim());
//       }
//       form.append("language", i18n.language);
//       form.append("policyName", "User Policy");

//       const { data } = await axios.post(`${API}/policy/upload`, form,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       setPolicy(data.policy);
//       setAnalysis(null);
//       toast.success("Policy uploaded");
//     } catch (e) {
//       toast.error(e?.response?.data?.error || "Policy upload failed");
//     } finally {
//       setIsLoading(false);  // Stop loading
//     }
//   };

//   const analyze = async () => {
//     try {
//       setIsLoading(true);  // Start loading
//       if (!report || !policy) return toast.error("Upload report and policy first");

//       const { data } = await axios.post(`${API}/analyze`, {
//         reportId: report._id,
//         policyId: policy._id,
//         language: i18n.language,  // 🔥 Send the selected language
//       });

//       setAnalysis(data.analysis);
//       toast.success("Analysis ready");
//     } catch (e) {
//       toast.error(e?.response?.data?.error || "Analyze failed");
//     } finally {
//       setIsLoading(false);  // Stop loading
//     }
//   };

//   // ADD: Govt Scheme checker (minimal addition)
//   const checkGovtScheme = async () => {
//     try {
//       if (!report?.diagnosis) return toast.error("No diagnosis available");
//       const { data } = await axios.post(`${API}/govt-schemes/check`, {
//         diagnosis: report.diagnosis,
//       });
//       if (!data.covered) {
//         toast.error("No Government Scheme covers this condition");
//         setAnalysis((prev) => ({ ...(prev || {}), govtSchemes: [] }));
//         return;
//       }
//       toast.success("Covered under Government Scheme(s)");
//       setAnalysis((prev) => ({ ...(prev || {}), govtSchemes: data.schemes }));
//     } catch (e) {
//       toast.error("Error checking govt schemes");
//     }
//   };

//   return (
//     <div className="w-full h-auto bg-transparent p-4 sm:p-6 lg:px-8 custom-scrollbar">
//       {/* Loading Animation */}
//       {isLoading && <Loading />}
//       {/* Top Row: Report & Policy */}

//       {/* Background video */}
//       <video
//         className="fixed inset-0 w-screen h-screen object-cover -z-9"
//         src={adminVideo}
//         autoPlay
//         muted
//         loop
//         playsInline
//         preload="auto"
//       />
//       <div className="fixed inset-0 bg-white opacity-70 -z-5"></div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto mb-6 lg:px-[30px]">
//         {/* Report */}
//         <section
//           ref={reportRef}
//           className="bg-transparent backdrop-blur-md border-2 border-white shadow-lg rounded-xl p-6 transition-transform hover:scale-[1.02]"
//           style={{ boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px" }}
//         >
//           <h3 className="text-3xl font-bold mb-4 text-blue-950">{t('Report')}</h3>
//           <div className="flex-1">
//             <input
//               type="file"
//               accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
//               onChange={(e) => setReportFile(e.target.files[0] || null)}
//               className="p-2 rounded-md w-full mt-3 cursor-pointer text-gray-600"
//               style={{
//                 boxShadow:
//                   "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
//               }}
//             />
//           </div>
//           <div className="text-center mb-3 mt-3 text-gray-500">{t('or')}</div>
//           <textarea
//             rows={4}
//             placeholder={t('Paste report text...')}
//             value={reportText}
//             onChange={(e) => setReportText(e.target.value)}
//             className="flex-1 min-w-0 rounded-xl w-full px-3 py-2 border-1 border-white  text-blue-900 placeholder-gray-800 focus:outline-none sm:px-4 sm:py-2"
//             style={{
//               boxShadow:
//                 "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
//             }}
//           />
//           <button
//             onClick={uploadReport}
//             className="px-4 py-2 mt-5 bg-black/80 text-white rounded-md w-full font-bold cursor-pointer"
//             style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}
//           >
//             {t('Upload Report')}
//           </button>
//           {report && (
//             <div className="mt-4 divide-y divide-gray-400">
//               <div className="py-2 text-justify"><b>{t('Diagnosis')}:</b> {report.diagnosis || "-"}</div>
//               <div className="py-2 text-justify"><b>{t('Severity')}:</b> {report.severity || "-"}</div>
//               <div className="py-2 text-justify"><b>{t('Treatment')}:</b> {report.treatment || "-"}</div>
//               <div className="py-2 text-justify"><b>{t('Description')}:</b> {report.description || "-"}</div>
//               <div className="py-2 text-justify"><b>{t('Summary')}:</b> {report.summary || "-"}</div>

//               {/* 🔊 Listen Button */}
//               <button
//                 onClick={() =>
//                   toggleSpeak(
//                     `Diagnosis: ${report.diagnosis}. Severity: ${report.severity}. Treatment: ${report.treatment}. Description: ${report.description}. Summary: ${report.summary}`
//                   )
//                 }
//                 className="mt-3 px-3 py-2 cursor-pointer bg-[#f5f5f5] text-black rounded-md"
//                 style={{
//                   boxShadow:
//                     "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
//                 }}
//               >
//                 {t('🔊 Listen / Stop')}
//               </button>
//             </div>
//           )}
//         </section>

//         {/* Policy */}
//         <section
//           ref={policyRef}
//           className={`bg-[#f5f5f5 rounded-xl p-6 border-2 border-white transition-transform text-black mb-15 hover:scale-[1.02] ${!report ? "opacity-100" : ""}`}
//           style={{ boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px" }}
//         >
//           <h3 className="text-3xl font-bold mb-4 text-blue-950">{t('Policy')}</h3>
//           <input
//             type="file"
//             accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
//             onChange={(e) => setPolicyFile(e.target.files[0] || null)}
//             disabled={!report}
//             className="p-2 rounded-md w-full mt-3 cursor-pointer text-gray-600 disabled:cursor-not-allowed"
//             style={{
//               boxShadow:
//                 "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
//             }}
//           />
//           <div className="text-center mb-3 text-gray-500 py-2">{t('or')}</div>
//           <textarea
//             rows={4}
//             placeholder={t('Paste policy text...')}
//             value={policyText}
//             onChange={(e) => setPolicyText(e.target.value)}
//             disabled={!report}
//             className="flex-1 min-w-0 rounded-xl w-full px-3 py-2 border-1 border-white  text-blue-900 placeholder-gray-800 focus:outline-none sm:px-4 sm:py-2 disabled:cursor-not-allowed"
//             style={{
//               boxShadow:
//                 "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
//             }}
//           />
//           <button
//             onClick={uploadPolicy}
//             disabled={!report}
//             className="px-4 py-2 mt-5 bg-black/80 text-white rounded-md w-full font-bold cursor-pointer disabled:cursor-not-allowed"
//             style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}
//           >
//             {t('Upload Policy')}
//           </button>
//           {policy && (
//             <div className="mt-4 divide-y divide-gray-400">
//               <div className="py-2"><b>{t('Policy Name')}:</b> {policy.policyName}</div>
//               <div className="py-2"><b>{t('File')}:</b> {policy.filename || "—"}</div>
//               <div className="py-2"><b>{t('Clauses')}:</b> {policy.clauses?.length || 0}</div>
//             </div>
//           )}
//         </section>
//       </div>

//       {/* Bottom Row: Analyze & Video */}
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto lg:px-[30px]">
//         {/* Analyze (3/4) */}
//         <section
//           ref={analyzeRef}
//           className="bg-transparent border-2 border-white shadow-lg rounded-xl p-6 transition-transform hover:scale-[1.02] lg:col-span-3"
//           style={{ boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px" }}
//         >
//           <h3 className="text-3xl font-bold mb-4 text-blue-950">{t('Analyze')}</h3>
//           <button
//             onClick={analyze}
//             disabled={!report || !policy}
//             className="px-4 py-2 mt-5 bg-black/80  text-white rounded-md w-full font-bold cursor-pointer disabled:cursor-not-allowed"
//             style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}
//           >
//             {t('Compare Latest')}
//           </button>

//           {/* ADD: Check Govt Schemes button */}
//           <button
//             onClick={checkGovtScheme}
//             disabled={!report}
//             className="px-4 py-2 mt-3 bg-[#f5f5f5] text-black rounded-md w-full font-bold cursor-pointer disabled:cursor-not-allowed"
//             style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}
//           >
//             {t('Check Govt Schemes')}
//           </button>

//           {analysis && (
//             <div className="mt-4 divide-y divide-gray-400">
//               <div className="py-2"><b>{t('Decision')}:</b> {t(analysis.decision)}</div>
//               <div className="py-2"><b>{t('Clause')}:</b> {analysis.clauseRef || "-"}</div>
//               <div className="py-2"><b>{t('Limit')}:</b> {analysis.resultJson?.limit || "-"}</div>
//               <div className="py-2 text-justify"><b>{t('Justification')}:</b> {analysis.justification || "-"}</div>
//               <div className="py-2"><b>{t('Confidence')}:</b> {analysis.confidence || "-"}</div>
//               <button
//                 onClick={() =>
//                   toggleSpeak(
//                     `Decision: ${analysis.decision}. Clause: ${analysis.clauseRef || "-"}. Limit: ${analysis.resultJson?.limit || "-"}. Justification: ${analysis.justification || "-"}. Confidence: ${analysis.confidence || "-"}`
//                   )
//                 }
//                 className="mt-3 px-3 py-2 cursor-pointer bg-black/80  text-white rounded-md"
//                 style={{
//                   boxShadow:
//                     "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
//                 }}
//               >
//                 {t('🔊 Listen / Stop')}
//               </button>
//             </div>
//           )}

//           {/* ADD: Govt Schemes Result */}
//           {analysis?.govtSchemes && (
//             <div className="mt-6 p-4 bg-transparent border-2 border-gray-600 rounded-lg">
//               <h3 className="text-xl font-bold text-black mb-3">
//                 Government Schemes
//               </h3>
//               <p>
//                 <b>Status:</b>{" "}
//                 {analysis.govtSchemes.length > 0 ? (
//                   <span className="text-black font-bold">✅ Covered</span>
//                 ) : (
//                   <span className="text-red-600 font-bold">❌ Not Covered</span>
//                 )}
//               </p>
//               {analysis.govtSchemes.length > 0 && (
//                 <ul className="space-y-3 mt-3">
//                   {analysis.govtSchemes.map((scheme, idx) => (
//                     <li
//                       key={idx}
//                       className="p-3 bg-transparent  rounded-lg shadow"
//                     >
//                       <p>
//                         <b>Scheme Name:</b> {scheme.schemeName}
//                       </p>
//                       <p>
//                         <b>Max Claim Limit:</b> ₹{scheme.maxClaimLimit}
//                       </p>
//                       <p>
//                         <b>Description:</b> {scheme.description}
//                       </p>
//                       <p>
//                         <b>Covered Diseases:</b>{" "}
//                         {scheme.coveredDiseases.join(", ")}
//                       </p>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           )}
//         </section>

//         {/* Video (1/4) */}
//         <section
//           ref={videoRef}
//           className="bg-transparent shadow-lg rounded-xl p-6 flex border-2 border-white flex-col transition-transform hover:scale-[1.02] lg:col-span-1"
//           style={{ boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px" }}
//         >
//           <video
//             autoPlay
//             loop
//             muted
//             playsInline
//             className="w-full rounded-lg mb-4"
//           >
//             <source src={demoVideo} type="video/mp4" />
//             {t('Your browser does not support the video tag.')}
//           </video>
//           <div className="text-center">
//             <h3 className="text-xl font-bold mb-2 text-blue-900">{t('Automated Workflows')}</h3>
//             <p className="text-gray-600 text-justify">
//               {t('Automate workflows to streamline tasks, boost efficiency, and save time')}
//             </p>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Analyzer;















































import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import gsap from "gsap";
import demoVideo from "../assets/analyzer-card.mp4";
import adminVideo from "../assets/analyzer.mp4";
import { toggleSpeak } from "../utils/speak";
import { useTranslation } from "react-i18next";
import Loading from "./Loading";

const API = import.meta.env.VITE_API_BASE + "/api";


const Analyzer = () => {
  const [reportFile, setReportFile] = useState(null);
  const [reportText, setReportText] = useState("");
  const [policyFile, setPolicyFile] = useState(null);
  const [policyText, setPolicyText] = useState("");
  

  const [report, setReport] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const reportRef = useRef(null);
  const policyRef = useRef(null);
  const analyzeRef = useRef(null);
  const videoRef = useRef(null);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    gsap.from([reportRef.current, policyRef.current], {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });
    gsap.from([analyzeRef.current, videoRef.current], {
      y: 80,
      opacity: 0,
      duration: 1.2,
      stagger: 0.3,
      ease: "power3.out",
      delay: 0.3,
    });
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  const uploadReport = async () => {
    try {
      setIsLoading(true);
      const form = new FormData();
      if (reportFile) {
        form.append("file", reportFile);
      } else {
        if (!reportText.trim())
          return toast.error("Paste report text or choose a file");
        form.append("textInput", reportText.trim());
      }
      form.append("language", i18n.language);

      const { data } = await axios.post(`${API}/report/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setReport(data.report);
      setPolicy(null);
      setAnalysis(null);
      toast.success("Report uploaded");
    } catch (e) {
      toast.error(e?.response?.data?.error || "Report upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPolicy = async () => {
    try {
      setIsLoading(true);
      const form = new FormData();
      if (policyFile) {
        form.append("file", policyFile);
      } else {
        if (!policyText.trim())
          return toast.error("Paste policy text or choose a file");
        form.append("textInput", policyText.trim());
      }
      form.append("language", i18n.language);
      form.append("policyName", "User Policy");

      const { data } = await axios.post(`${API}/policy/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPolicy(data.policy);
      setAnalysis(null);
      toast.success("Policy uploaded");
    } catch (e) {
      toast.error(e?.response?.data?.error || "Policy upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const analyze = async () => {
    try {
      setIsLoading(true);
      if (!report || !policy) return toast.error("Upload report and policy first");

      const { data } = await axios.post(`${API}/analyze`, {
        reportId: report._id,
        policyId: policy._id,
        language: i18n.language,
      });

      setAnalysis(data.analysis);
      toast.success("Analysis ready");
    } catch (e) {
      toast.error(e?.response?.data?.error || "Analyze failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Helpers to render panels safely
  const p = report?.panels || {};
  const cbc = p?.cbc || null;
  const renal = p?.renal || null;
  const widal = p?.widal || null;

  const StatRow = ({ label, value, unit }) => (
    <div className="flex items-center justify-between py-1">
      <span className="text-blue-900">{label}</span>
      <span className="font-semibold">
        {value ?? "—"} {value != null && unit ? unit : ""}
      </span>
    </div>
  );

  const checkGovtScheme = async () => {
    try {
      if (!report?.diagnosis) return toast.error("No diagnosis available");
      const { data } = await axios.post(`${API}/govt-schemes/check`, {
        diagnosis: report.diagnosis,
      });
      if (!data.covered) {
        toast.error("No Government Scheme covers this condition");
        setAnalysis((prev) => ({ ...(prev || {}), govtSchemes: [] }));
        return;
      }
      toast.success("Covered under Government Scheme(s)");
      setAnalysis((prev) => ({ ...(prev || {}), govtSchemes: data.schemes }));
    } catch (e) {
  console.log(e); // ya console.error(e)
}
  };

  return (
    <div className="w-full h-auto bg-transparent p-4 sm:p-6 lg:px-8 custom-scrollbar">
      {isLoading && <Loading />}

      <video
        className="fixed inset-0 w-screen h-screen object-cover -z-9"
        src={adminVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="fixed inset-0 bg-white opacity-70 -z-5"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto mb-6 lg:px-[30px]">
        {/* Report */}
        <section
          ref={reportRef}
          className="bg-transparent backdrop-blur-md border-2 border-white shadow-lg rounded-xl p-6 transition-transform hover:scale-[1.02]"
          style={{
            boxShadow:
              "rgba(14,30,37,0.12) 0px 2px 4px 0px, rgba(14,30,37,0.32) 0px 2px 16px 0px",
          }}
        >
          <h3 className="text-3xl font-bold mb-4 text-blue-950">
            {t("Report")}
          </h3>

          <div className="flex-1">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              onChange={(e) => setReportFile(e.target.files[0] || null)}
              className="p-2 rounded-md w-full mt-3 cursor-pointer text-gray-600"
              style={{
                boxShadow:
                  "rgba(0,0,0,0.16) 0px 3px 6px, rgba(0,0,0,0.23) 0px 3px 6px",
              }}
            />
          </div>

          <div className="text-center mb-3 mt-3 text-gray-500">{t("or")}</div>

          <textarea
            rows={4}
            placeholder={t("Paste report text...")}
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            className="flex-1 min-w-0 rounded-xl w-full px-3 py-2 border-1 border-white text-blue-900 placeholder-gray-800 focus:outline-none sm:px-4 sm:py-2"
            style={{
              boxShadow:
                "rgba(0,0,0,0.19) 0px 10px 20px, rgba(0,0,0,0.23) 0px 6px 6px",
            }}
          />

          <button
            onClick={uploadReport}
            className="px-4 py-2 mt-5 bg-black/80 text-white rounded-md w-full font-bold cursor-pointer"
            style={{
              boxShadow:
                "rgba(0,0,0,0.16) 0px 3px 6px, rgba(0,0,0,0.23) 0px 3px 6px",
            }}
          >
            {t("Upload Report")}
          </button>

          {(cbc || renal || widal) && (
            <div className="pt-4">
              <h4 className="text-2xl font-bold mb-2 text-blue-950">
                {t("Extracted Panels")}
              </h4>

              {/* CBC */}
              {cbc && (
                <div className="mb-4 rounded-lg border border-gray-300 bg-transparent p-4">
                  <h5 className="text-xl font-semibold mb-2">{t("CBC")}</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <StatRow
                      label={t("Hemoglobin")}
                      value={cbc.haemoglobin_g_dl}
                      unit="g/dL"
                    />
                    <StatRow
                      label={t("RBC")}
                      value={cbc.rbc_million_per_cumm}
                      unit="million/cumm"
                    />
                    <StatRow
                      label={t("WBC")}
                      value={cbc.wbc_per_cumm}
                      unit="/cumm"
                    />
                    <StatRow
                      label={t("Platelets")}
                      value={cbc.platelets_per_cumm}
                    />
                    <StatRow
                      label={t("HCT")}
                      value={cbc.haematocrit_pct}
                      unit="%"
                    />
                    <StatRow label={t("MCV")} value={cbc.mcv_fl} unit="fL" />
                    <StatRow label={t("MCH")} value={cbc.mch_pg} unit="pg" />
                    <StatRow
                      label={t("MCHC")}
                      value={cbc.mchc_g_dl}
                      unit="g/dL"
                    />
                    <StatRow label={t("RDW")} value={cbc.rdw_fl} unit="fL" />
                  </div>
                  {cbc.diff_wbc_pct && (
                    <div className="mt-2 text-sm text-blue-950">
                      {t("Differential")}: N{" "}
                      {cbc.diff_wbc_pct.polymorphs ?? "—"}% · E{" "}
                      {cbc.diff_wbc_pct.eosinophils ?? "—"}% · L{" "}
                      {cbc.diff_wbc_pct.lymphocytes ?? "—"}% · B{" "}
                      {cbc.diff_wbc_pct.basophils ?? "—"}% · M{" "}
                      {cbc.diff_wbc_pct.monocytes ?? "—"}%
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {report && (
            <div className="mt-4 divide-y divide-gray-400">
              <div className="py-2 text-justify">
                <b>{t("Diagnosis")}:</b> {report.diagnosis || "-"}
              </div>
              <div className="py-2 text-justify">
                <b>{t("Accuracy")}:</b> {report.severity || "-"}
              </div>
              <div className="py-2 text-justify">
                <b>{t("Treatment")}:</b> {report.treatment || "-"}
              </div>
              <div className="py-2 text-justify">
                <b>{t("Description")}:</b> {report.description || "-"}
              </div>
              <div className="py-2 text-justify">
                <b>{t("Summary")}:</b> {report.summary || "-"}
              </div>

              <button
                onClick={() =>
                  toggleSpeak(
                    `Diagnosis: ${report.diagnosis}. Severity: ${report.severity}. Treatment: ${report.treatment}. Description: ${report.description}. Summary: ${report.summary}`
                  )
                }
                className="mt-3 px-3 py-2 cursor-pointer bg-[#f5f5f5] text-black rounded-md"
                style={{
                  boxShadow:
                    "rgba(0,0,0,0.16) 0px 3px 6px, rgba(0,0,0,0.23) 0px 3px 6px",
                }}
              >
                {t("🔊 ")}
              </button>
              
            </div>
          )}
        </section>

        {/* Policy */}
        <section
          ref={policyRef}
          className={`bg-transparent rounded-xl p-6 border-2 border-white transition-transform text-black mb-15 hover:scale-[1.02] ${
            !report ? "opacity-100" : ""
          }`}
          style={{
            boxShadow:
              "rgba(14,30,37,0.12) 0px 2px 4px 0px, rgba(14,30,37,0.32) 0px 2px 16px 0px",
          }}
        >
          <h3 className="text-3xl font-bold mb-4 text-blue-950">
            {t("Policy")}
          </h3>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            onChange={(e) => setPolicyFile(e.target.files[0] || null)}
            disabled={!report}
            className="p-2 rounded-md w-full mt-3 cursor-pointer text-gray-600 disabled:cursor-not-allowed"
            style={{
              boxShadow:
                "rgba(0,0,0,0.16) 0px 3px 6px, rgba(0,0,0,0.23) 0px 3px 6px",
            }}
          />
          <div className="text-center mb-3 text-gray-500 py-2">{t("or")}</div>
          <textarea
            rows={4}
            placeholder={t("Paste policy text...")}
            value={policyText}
            onChange={(e) => setPolicyText(e.target.value)}
            disabled={!report}
            className="flex-1 min-w-0 rounded-xl w-full px-3 py-2 border-1 border-white text-blue-900 placeholder-gray-800 focus:outline-none sm:px-4 sm:py-2 disabled:cursor-not-allowed"
            style={{
              boxShadow:
                "rgba(0,0,0,0.19) 0px 10px 20px, rgba(0,0,0,0.23) 0px 6px 6px",
            }}
          />
          <button
            onClick={uploadPolicy}
            disabled={!report}
            className="px-4 py-2 mt-5 bg-black/80 text-white rounded-md w-full font-bold cursor-pointer disabled:cursor-not-allowed"
            style={{
              boxShadow:
                "rgba(0,0,0,0.16) 0px 3px 6px, rgba(0,0,0,0.23) 0px 3px 6px",
            }}
          >
            {t("Upload Policy")}
          </button>
          {policy && (
            <div className="mt-4 divide-y divide-gray-400">
              <div className="py-2">
                <b>{t("Policy Name")}:</b> {policy.policyName}
              </div>
              <div className="py-2">
                <b>{t("File")}:</b> {policy.filename || "—"}
              </div>
              <div className="py-2">
                <b>{t("Clauses")}:</b> {policy.clauses?.length || 0}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Analyze & Video */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto lg:px-[30px]">
        <section
          ref={analyzeRef}
          className="bg-transparent border-2 border-white shadow-lg rounded-xl p-6 transition-transform hover:scale-[1.02] lg:col-span-3"
          style={{
            boxShadow:
              "rgba(14,30,37,0.12) 0px 2px 4px 0px, rgba(14,30,37,0.32) 0px 2px 16px 0px",
          }}
        >
          <h3 className="text-3xl font-bold mb-4 text-blue-950">
            {t("Analyze")}
          </h3>
          <button
            onClick={analyze}
            disabled={!report || !policy}
            className="px-4 py-2 mt-5 bg-black/80 text-white rounded-md w-full font-bold cursor-pointer disabled:cursor-not-allowed"
            style={{
              boxShadow:
                "rgba(0,0,0,0.16) 0px 3px 6px, rgba(0,0,0,0.23) 0px 3px 6px",
            }}
          >
            {t("Compare Latest")}
          </button>
          <button
            onClick={checkGovtScheme}
            disabled={!report}
            className="px-4 py-2 mt-3 bg-[#f5f5f5] text-black rounded-md w-full font-bold cursor-pointer disabled:cursor-not-allowed"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            }}
          >
            {t("Check Govt Schemes")}
          </button>

          {analysis && (
            <div className="mt-4 divide-y divide-gray-400">
              <div className="py-2">
                <b>{t("Decision")}:</b> {t(analysis.decision)}
              </div>
              <div className="py-2">
                <b>{t("Clause")}:</b> {analysis.clauseRef || "-"}
              </div>
              <div className="py-2">
                <b>{t("Limit")}:</b> {analysis.resultJson?.limit || "-"}
              </div>
              <div className="py-2 text-justify">
                <b>{t("Justification")}:</b> {analysis.justification || "-"}
              </div>
              <div className="py-2">
                <b>{t("Confidence")}:</b> {analysis.confidence || "-"}
              </div>
              <button
                onClick={() =>
                  toggleSpeak(
                    `Decision: ${analysis.decision}. Clause: ${
                      analysis.clauseRef || "-"
                    }. Limit: ${
                      analysis.resultJson?.limit || "-"
                    }. Justification: ${
                      analysis.justification || "-"
                    }. Confidence: ${analysis.confidence || "-"}`
                  )
                }
                className="mt-3 px-3 py-2 cursor-pointer bg-black/80 text-white rounded-md"
                style={{
                  boxShadow:
                    "rgba(0,0,0,0.16) 0px 3px 6px, rgba(0,0,0,0.23) 0px 3px 6px",
                }}
              >
                {t("🔊 Listen / Stop")}
              </button>
            </div>
          )}

          {/* Govt Schemes Result */}
          {analysis?.govtSchemes && (
            <div className="mt-6 p-4 bg-transparent border-2 border-gray-600 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-3">
                Government Schemes
              </h3>
              <p>
                <b>Status:</b>{" "}
                {analysis.govtSchemes.length > 0 ? (
                  <span className="text-black font-bold">✅ Covered</span>
                ) : (
                  <span className="text-red-600 font-bold">❌ Not Covered</span>
                )}
              </p>
              {analysis.govtSchemes.length > 0 && (
                <ul className="space-y-3 mt-3">
                  {analysis.govtSchemes.map((scheme, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-transparent rounded-lg shadow"
                    >
                      <p>
                        <b>Scheme Name:</b> {scheme.schemeName}
                      </p>
                      <p>
                        <b>Max Claim Limit:</b> ₹{scheme.maxClaimLimit}
                      </p>
                      <p>
                        <b>Description:</b> {scheme.description}
                      </p>
                      <p>
                        <b>Covered Diseases:</b>{" "}
                        {scheme.coveredDiseases.join(", ")}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        <section
          ref={videoRef}
          className="bg-transparent shadow-lg rounded-xl p-6 flex border-2 border-white flex-col transition-transform hover:scale-[1.02] lg:col-span-1"
          style={{
            boxShadow:
              "rgba(14,30,37,0.12) 0px 2px 4px 0px, rgba(14,30,37,0.32) 0px 2px 16px 0px",
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full rounded-lg mb-4"
          >
            <source src={demoVideo} type="video/mp4" />
            {t("Your browser does not support the video tag.")}
          </video>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2 text-blue-900">
              {t("Automated Workflows")}
            </h3>
            <p className="text-gray-600 text-justify">
              {t(
                "Automate workflows to streamline tasks, boost efficiency, and save time"
              )}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analyzer;
