// import React, { useState } from 'react';
// import { postFile, postJson } from '../../../libs/api-client.js';

// export default function PolicyUploader({ onUploaded }) {
//     const [mode, setMode] = useState('file');
//     const [text, setText] = useState('');
//     const [status, setStatus] = useState('');

//     const upload = async () => {
//         setStatus('Uploading...');
//         try {
//             let res;
//             if (mode === 'file') {
//                 const input = document.getElementById('policy-file-input');
//                 const file = input.files?.[0];
//                 if (!file) return setStatus('Choose a file first');
//                 res = await postFile('/api/multi-policy/upload', file);
//             } else {
//                 res = await postJson('/api/multi-policy/upload', { text });
//             }
//             setStatus('Done');
//             onUploaded?.(res);
//         } catch (e) {
//             setStatus('Error');
//         }
//     };

//     return (
//         <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, margin: '12px 0' }}>
//             <h3>Policy</h3>
//             <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
//                 <button onClick={() => setMode('file')} disabled={mode === 'file'}>Upload File</button>
//                 <button onClick={() => setMode('text')} disabled={mode === 'text'}>Paste Text</button>
//             </div>
//             {mode === 'file' ? (
//                 <div>
//                     <input id="policy-file-input" type="file" />
//                 </div>
//             ) : (
//                 <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} style={{ width: '100%' }} placeholder="Paste policy text here..." />
//             )}

//             <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
//                 <button onClick={upload}>Save Policy</button>
//                 <small>{status}</small>
//             </div>
//             <p style={{ opacity: 0.7, marginTop: 6 }}>Tip: Policy section is enabled after 2 report uploads.</p>
//         </div>
//     );
// }






















































// import React, { useState, useRef, useEffect } from "react";
// import { postFile, postJson } from "../../../libs/api-client.js";
// import gsap from "gsap";

// export default function PolicyUploader({ onUploaded }) {
//     const [mode, setMode] = useState("file");
//     const [text, setText] = useState("");
//     const [status, setStatus] = useState("");

//     // refs for animation
//     const containerRef = useRef(null);
//     const headingRef = useRef(null);
//     const buttonsRef = useRef([]);
//     const inputRef = useRef(null);
//     const saveRef = useRef(null);

//     useEffect(() => {
//         // container fade-in
//         gsap.from(containerRef.current, {
//             opacity: 0,
//             y: 30,
//             duration: 0.8,
//             ease: "power2.out",
//         });

//         // heading slide
//         gsap.from(headingRef.current, {
//             x: -40,
//             opacity: 0,
//             duration: 0.7,
//             delay: 0.2,
//             ease: "back.out(1.7)",
//         });

//         // buttons stagger
//         gsap.from(buttonsRef.current, {
//             y: 20,
//             opacity: 0,
//             stagger: 0.15,
//             duration: 0.6,
//             delay: 0.4,
//             ease: "power3.out",
//         });

//         // input/textarea
//         gsap.from(inputRef.current, {
//             scale: 0.95,
//             opacity: 0,
//             duration: 0.7,
//             delay: 0.6,
//             ease: "power2.out",
//         });

//         // save button
//         gsap.from(saveRef.current, {
//             y: 20,
//             opacity: 0,
//             duration: 0.6,
//             delay: 0.8,
//             ease: "power2.out",
//         });
//     }, [mode]);

//     const upload = async () => {
//         setStatus("Uploading...");
//         try {
//             let res;
//             if (mode === "file") {
//                 const input = document.getElementById("policy-file-input");
//                 const file = input.files?.[0];
//                 if (!file) return setStatus("Choose a file first");
//                 res = await postFile("/api/multi-policy/upload", file);
//             } else {
//                 res = await postJson("/api/multi-policy/upload", { text });
//             }
//             setStatus("Done ✅");
//             onUploaded?.(res);
//         } catch (e) {
//             setStatus("Error ❌");
//         }
//     };

//     return (
//         <div
//             ref={containerRef}
//             className=" bg-[#f5f5f5] border-gray-300 rounded-xl shadow-sm  p-4 sm:p-6 my-4"
//             style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}
//         >
//             {/* Heading */}
//             <h3
//                 ref={headingRef}
//                 className="text-lg sm:text-xl font-semibold text-blue-900 text-center mb-3"
//             >
//                 Policy
//             </h3>

//             {/* Mode Buttons */}
//             <div className="flex flex-wrap gap-3 mb-4">
//                 <button
//                     ref={(el) => (buttonsRef.current[0] = el)}
//                     onClick={() => setMode("file")}
//                     disabled={mode === "file"}
//                     className={`px-4 py-2 rounded-md text-sm font-medium shadow cursor-pointer ${mode === "file"
//                         ? "bg-[#f5f5f5] text-black"
//                         : "bg-[#f5f5f5] text-black hover:bg-gray-200"
//                         }`}
//                     style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}
//                 >
//                     Upload File
//                 </button>
//                 <button
//                     ref={(el) => (buttonsRef.current[1] = el)}
//                     onClick={() => setMode("text")}
//                     disabled={mode === "text"}
//                     className={`px-4 py-2 rounded-md text-sm font-medium shadow  cursor-pointer ${mode === "text"
//                         ? "bg-[#f5f5f5] text-black"
//                         : "bg-[#f5f5f5] text-black hover:bg-gray-200"
//                         }`}
//                     style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}
//                 >
//                     Paste Text
//                 </button>
//             </div>

//             {/* File or Textarea */}
//             {mode === "file" ? (
//                 <div ref={inputRef}>
//                     <input
//                         id="policy-file-input"
//                         type="file"
//                         className=" p-2 rounded-md w-full mt-3 cursor-pointer"
//                         style={{
//                             boxShadow:
//                                 "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
//                         }}
//                     />
//                 </div>
//             ) : (
//                 <textarea
//                     ref={inputRef}
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                     rows={3}
//                     placeholder="Paste policy text here..."
//                     className=" w-full flex-1 min-w-0 rounded-xl px-3 mt-5 py-2 border border-gray-300 focus:outline-none sm:px-4 sm:py-2"
//                     style={{
//                         boxShadow:
//                             "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
//                     }}
//                 />
//             )}

//             {/* Save Button + Status */}
//             <div style={{boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;"}}>
//                 <button onClick={upload}
//                     className="flex-shrink-0 px-4 py-2 rounded-full text-black font-bold cursor-pointer bg-[] sm:px-6"
//                     style={{
//                         boxShadow:
//                             "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
//                     }}
//                 >Save Policy</button>
//                 <small  className="text-black " >{status}</small>
//             </div>

//             <p className=" mt-3 text-sm">
//                 Tip: Policy section is enabled after 2 report uploads.
//             </p>
//         </div>
//     );
// }






























import React, { useState, useRef, useEffect } from "react";
import { postFile, postJson } from "../../../libs/api-client.js";
import gsap from "gsap";
import { useTranslation } from 'react-i18next';

export default function PolicyUploader({ onUploaded }) {
    const [mode, setMode] = useState("file");
    const [text, setText] = useState("");
    const [status, setStatus] = useState("");
   const { t } = useTranslation();
    // refs for animation
    const containerRef = useRef(null);
    const headingRef = useRef(null);
    const buttonsRef = useRef([]);
    const inputRef = useRef(null);
    const saveRef = useRef(null);

    useEffect(() => {
        // container fade-in
        gsap.from(containerRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power2.out",
        });

        // heading slide
        gsap.from(headingRef.current, {
            x: -40,
            opacity: 0,
            duration: 0.7,
            delay: 0.2,
            ease: "back.out(1.7)",
        });

        // buttons stagger
        gsap.from(buttonsRef.current, {
            y: 20,
            opacity: 0,
            stagger: 0.15,
            duration: 0.6,
            delay: 0.4,
            ease: "power3.out",
        });

        // input/textarea
        gsap.from(inputRef.current, {
            scale: 0.95,
            opacity: 0,
            duration: 0.7,
            delay: 0.6,
            ease: "power2.out",
        });

        // save button
        gsap.from(saveRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            delay: 0.8,
            ease: "power2.out",
            onComplete: () => {
                // Forcefully show after animation
                if (saveRef.current) {
                    saveRef.current.style.opacity = "1";
                    saveRef.current.style.visibility = "visible";
                }
            }
        });
    }, [mode]);

    const upload = async () => {
        setStatus("Uploading...");
        try {
            let res;
            if (mode === "file") {
                const input = document.getElementById("policy-file-input");
                const file = input.files?.[0];
                if (!file) return setStatus("Choose a file first");
                res = await postFile("/api/multi-policy/upload", file);
            } else {
                res = await postJson("/api/multi-policy/upload", { text });
            }
            setStatus("Done ✅");
            onUploaded?.(res);
        } catch (e) {
            setStatus("Error ❌");
        }
    };

    return (
        <div
            ref={containerRef}
            className="bg-[#f5f5f5] border-gray-300 rounded-xl shadow-sm p-4 sm:p-6 my-4"
            style={{boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;"}}
        >
            {/* Heading */}
            <h3
                ref={headingRef}
                className="text-lg sm:text-xl font-semibold text-blue-900 text-center mb-3"
            >
                {t('Policy')}
            </h3>

            {/* Mode Buttons */}
            <div className="flex flex-wrap gap-3 mb-4">
                <button
                    ref={(el) => (buttonsRef.current[0] = el)}
                    onClick={() => setMode("file")}
                    disabled={mode === "file"}
                    className={`px-4 py-2 rounded-md text-sm font-medium shadow cursor-pointer ${mode === "file"
                            ? "bg-[#f5f5f5] text-black"
                            : "bg-[#f5f5f5] text-black hover:bg-gray-200"
                        }`}
                    style={{boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;"}}
                >
                    {t('Upload File')}
                </button>
                <button
                    ref={(el) => (buttonsRef.current[1] = el)}
                    onClick={() => setMode("text")}
                    disabled={mode === "text"}
                    className={`px-4 py-2 rounded-md text-sm font-medium shadow cursor-pointer  ${mode === "text"
                            ? "bg-[#f5f5f5] text-black"
                            : "bg-[#f5f5f5] text-black hover:bg-gray-200"
                        }`}
                         style={{boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;"}}
                >
                    {t('Paste Text')}
                </button>
            </div>

            {/* File or Textarea */}
            {mode === "file" ? (
                <div ref={inputRef}>
                    <input
                        id="policy-file-input"
                        type="file"
                        className="p-2 rounded-md w-full mt-3 cursor-pointer"
                        style={{
                            boxShadow:
                                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                        }}
                    />
                </div>
            ) : (
                <textarea
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    placeholder={t('Paste policy text here...')}
                    className="w-full flex-1 min-w-0 rounded-xl px-3 mt-5 py-2 border border-gray-300 focus:outline-none sm:px-4 sm:py-2"
                    style={{
                        boxShadow:
                            "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                    }}
                />
            )}

            {/* Save Button + Status */}
            <div className="flex items-center gap-3 mt-4">
                <button
                    ref={saveRef}
                    onClick={upload}
                    className="flex-shrink-0 flex-1 px-4 py-2 rounded-xl text-black font-bold cursor-pointer bg-[#f5f5f5] sm:px-6  hover:bg-[#e8e5e5c8]"
                    style={{
                        boxShadow:
                            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                    }}
                >
                    {t('Save Policy')}
                </button>
                <small className="text-black px-3 py-2 rounded-[8px] "
                style={{boxShadow:
                            "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                    }}
                
                >{t(status)}</small>
            </div>

            <p className="mt-10 text-sm">
                {t('Tip: Policy section is enabled after 2 report uploads.')}
            </p>
        </div>
    );
}
