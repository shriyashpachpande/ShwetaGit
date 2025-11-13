// import React, { useState } from 'react';
// import { postFile, del } from '../../../libs/api-client.js';

// const ALLOWED = ['.pdf', '.txt', '.png', '.jpeg', '.jpg', '.doc', '.docx'];

// export default function ReportUploader({ onUploaded, onRemoved }) {
//     const [list, setList] = useState([]); // local preview list with progress

//     const handleFiles = async (files) => {
//         for (const f of files) {
//             const ext = '.' + f.name.split('.').pop().toLowerCase();
//             if (!ALLOWED.includes(ext)) { alert(`Unsupported: ${ext}`); continue; }
//             const tempId = `${Date.now()}-${f.name}`;
//             setList(prev => [...prev, { tempId, name: f.name, size: f.size, progress: 'Uploading...' }]);
//             try {
//                 const res = await postFile('/api/multi-report/upload', f);
//                 setList(prev => prev.map(it => it.tempId === tempId
//                     ? { ...it, progress: 'Done', res, size: it.size ?? it.res?.size ?? it.res?.bytes ?? 0 }
//                     : it
//                 ));
//                 onUploaded?.(res);
//             } catch (e) {
//                 setList(prev => prev.map(it => it.tempId === tempId ? { ...it, progress: 'Error' } : it));
//             }
//         }
//     };

//     const removeItem = async (item) => {
//         if (item.res?.reportId) {
//             try { await del(`/api/multi-report/${item.res.reportId}`); } catch { }
//             onRemoved?.(item.res.reportId);
//         }
//         setList(prev => prev.filter(x => x !== item));
//     };

//     return (
//         <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, margin: '12px 0' }}>
//             <h3>Reports</h3>
//             <div onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
//                 onDragOver={(e) => e.preventDefault()}
//                 style={{  padding: 20, borderRadius: 8, textAlign: 'center', marginBottom: 12 }}>
//                 Drag & drop files here or
//                 <input type="file" multiple onChange={(e) => handleFiles(e.target.files)} style={{ display: 'block', margin: '10px auto' }} />
//                 <small>Allowed: .pdf, .txt, .png, .jpeg, .jpg, .doc, .docx</small>
//             </div>
//             <ul>
//                 {list.map((it, idx) => (
//                     <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
//                         <span>{it.name} — {Math.round((it.size || 0) / 1024)} KB — {it.progress}</span>
//                         <button onClick={() => removeItem(it)}>Remove</button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }















import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { postFile, del } from '../../../libs/api-client.js';
import { useTranslation } from 'react-i18next';
const ALLOWED = ['.pdf', '.txt', '.png', '.jpeg', '.jpg', '.doc', '.docx'];

export default function ReportUploader({ onUploaded, onRemoved }) {
    const [list, setList] = useState([]);
    const containerRef = useRef(null);
    const listRef = useRef([]);
   const { t } = useTranslation();
    useEffect(() => {
        // container fade
        gsap.from(containerRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
        });
    }, []);

    useEffect(() => {
        // animate list items when added
        listRef.current.forEach((el, i) => {
            if (el) {
                gsap.from(el, {
                    x: -40,
                    opacity: 0,
                    duration: 0.5,
                    delay: i * 0.05,
                    ease: 'back.out(1.7)',
                });
            }
        });
    }, [list]);

    const handleFiles = async (files) => {
        for (const f of files) {
            const ext = '.' + f.name.split('.').pop().toLowerCase();
            if (!ALLOWED.includes(ext)) {
                alert(`Unsupported: ${ext}`);
                continue;
            }
            const tempId = `${Date.now()}-${f.name}`;
            setList((prev) => [
                ...prev,
                { tempId, name: f.name, size: f.size, progress: 'Uploading...' },
            ]);
            try {
                const res = await postFile('/api/multi-report/upload', f);
                setList((prev) =>
                    prev.map((it) =>
                        it.tempId === tempId
                            ? {
                                ...it,
                                progress: 'Done',
                                res,
                                size:
                                    it.size ??
                                    it.res?.size ??
                                    it.res?.bytes ??
                                    0,
                            }
                            : it
                    )
                );
                onUploaded?.(res);
            } catch (e) {
                setList((prev) =>
                    prev.map((it) =>
                        it.tempId === tempId ? { ...it, progress: 'Error' } : it
                    )
                );
            }
        }
    };

    const removeItem = async (item) => {
        if (item.res?.reportId) {
            try {
                await del(`/api/multi-report/${item.res.reportId}`);
            } catch { }
            onRemoved?.(item.res.reportId);
        }
        // animate out
        const idx = list.findIndex((x) => x === item);
        if (listRef.current[idx]) {
            gsap.to(listRef.current[idx], {
                x: 40,
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                    setList((prev) => prev.filter((x) => x !== item));
                },
            });
        }
    };

    return (
        <div
            ref={containerRef}
            className="border border-gray-300 rounded-xl p-4 sm:p-6 mb-6 bg-[#f5f5f5] shadow-sm"
        >
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center text-blue-900">{t('Reports')}</h3>

            {/* Drop area (no continuous animation now) */}
            <div
                onDrop={(e) => {
                    e.preventDefault();
                    handleFiles(e.dataTransfer.files);
                }}
                onDragOver={(e) => e.preventDefault()}
                className="rounded-lg p-6 sm:p-8 text-center mb-4   transition"
            >
                <p className="text-xl  text-left text-shadow-black">
                    {t('Drag & drop files here or')}
                </p>
                <input
                    type="file"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                    className=" p-2 rounded-md w-full mt-3 cursor-pointer"
                    style={{
                        boxShadow:
                            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                    }}
                />
                <small className="block mt-2 text-gray-500">
                    {t('Allowed: .pdf, .txt, .png, .jpeg, .jpg, .doc, .docx')}
                </small>
            </div>

            {/* <ul>
                {list.map((it, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                        <span  >{it.name} — {Math.round((it.size || 0) / 1024)} KB — {it.progress}</span>
                        <button onClick={() => removeItem(it)}>Remove</button>
                    </li>
                ))}
            </ul> */}




            <ul className="list-none p-0 m-0">
                {list.map((it, idx) => (
                    <li
                        key={idx}
                        className="cursor-pointer hover:bg-[#e8e5e5c8] flex flex-col border-b border-gray-300 sm:flex-row justify-between sm:items-center gap- py-2 px-5 rounded-md mb-2 "
                        style={{ boxShadow: "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px" }}
                    >
                        <span>
                            {it.name} — {Math.round((it.size || 0) / 1024)} KB — {t(it.progress)}
                        </span>
                        <button className="text-red-500 cursor-pointer  hover:text-red-700" onClick={() => removeItem(it)}>
                            {t('Remove')}
                        </button>
                    </li>
                ))}
            </ul>



        </div>
    );
}
