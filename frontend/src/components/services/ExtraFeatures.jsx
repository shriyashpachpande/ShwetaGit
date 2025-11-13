
// import React, { useEffect, forwardRef, useRef } from "react";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const ExtraFeatures = forwardRef((props, ref) => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         ".feature-card",
//         { opacity: 0, y: 100 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 1,
//           ease: "power3.out",
//           stagger: 0.3,
//         }
//       );
//     }, containerRef);
//     return () => ctx.revert();
//   }, []);

//   return (
//     <div
//       ref={ref}
//       className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
//     >
//       <div
//         ref={containerRef}
//         className="feature-card bg-white rounded-xl shadow-lg p-6 text-center"
//         style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
//       >
//         <h3 className="text-lg font-bold text-gray-900">Feature 1</h3>
//         <p className="text-gray-600 mt-2">Details about this feature.</p>
//       </div>
//       <div
//         className="feature-card bg-white rounded-xl shadow-lg p-6 text-center"
//         style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
//       >
//         <h3 className="text-lg font-bold text-gray-900">Feature 2</h3>
//         <p className="text-gray-600 mt-2">Details about this feature.</p>
//       </div>
//       <div
//         className="feature-card bg-white rounded-xl shadow-lg p-6 text-center"
//         style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
//       >
//         <h3 className="text-lg font-bold text-gray-900">Feature 3</h3>
//         <p className="text-gray-600 mt-2">Details about this feature.</p>
//       </div>
//     </div>
//   );
// });

// export default ExtraFeatures;

















// import React, { useEffect, forwardRef, useRef } from "react";
// import gsap from "gsap";

// const ExtraFeatures = forwardRef(() => {
//     const containerRef = useRef(null);

//     useEffect(() => {
//         const ctx = gsap.context(() => {
//             const tl = gsap.timeline();
//             tl.from(".feature-1", {
//                 x: -100,
//                 opacity: 0,
//                 duration: 1,
//                 ease: "power3.out",
//             })
//                 .from(
//                     ".feature-2",
//                     {
//                         y:-100,
//                         opacity: 0,
//                         duration: 1,
//                         ease: "power3.out",
//                     },
//                     "-=0.5"
//                 )
//                 .from(
//                     ".feature-3",
//                     {
//                         x: 100,
//                         opacity: 0,
//                         duration: 1,
//                         ease: "power3.out",
//                     },
//                     "-=0.5"
//                 );
//         }, containerRef);

//         return () => ctx.revert();
//     }, []);

//     return (
//         <div
//             ref={containerRef}
//             className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
//         >
//             {/* Feature 1 */}
//             <div
//                 className="feature-1 bg-white rounded-xl shadow-lg p-6 text-center"
//                 style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
//             >
//                 <h3 className="text-lg font-bold text-gray-900">InsureIQ</h3>
//                 <p className="text-gray-600 mt-2">Instantly decode policies and simplify complex insurance coverage.</p>
//             </div>


//             {/* Feature 2 */}
//             <div
//                 className="feature-2 bg-white rounded-xl shadow-lg p-6 text-center"
//                 style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
//             >
//                 <h3 className="text-lg font-bold text-gray-900">MediGuide</h3>
//                 <p className="text-gray-600 mt-2">Your trusted health assistant for accurate medical advice anytime.</p>
//             </div>



//             {/** Feature 3 */}
//             <div
//                 className="feature-3 bg-white rounded-xl shadow-lg p-6 text-center"
//                 style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
//             >
//                 <h3 className="text-lg font-bold text-gray-900">DiagnoScan</h3>
//                 <p className="text-gray-600 mt-2">AI-powered scans to detect and explain health conditions quickly.</p>
//             </div>
//         </div>
//     );
// });

// export default ExtraFeatures;

















// import React, { useEffect, forwardRef, useRef, useImperativeHandle } from "react";
// import gsap from "gsap";

// const ExtraFeatures = forwardRef((props, ref) => {
//   const containerRef = useRef(null);

//   // 🔥 GSAP Enter Animation
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline();
//       tl.from(".feature-1", { x: -100, opacity: 0, duration: 1, ease: "power3.out" })
//         .from(".feature-2", { y: -100, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.5")
//         .from(".feature-3", { x: 100, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.5");
//     }, containerRef);

//     return () => ctx.revert();
//   }, []);

//   // 🔥 Expose Methods to Parent
//   useImperativeHandle(ref, () => ({
//     container: containerRef.current,
//     scrollToSelf: () => {
//       containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//     },
//     playExit: () => {
//       const tl = gsap.timeline();
//       tl.to(".feature-1", { x: -100, opacity: 0, duration: 0.8, ease: "power3.in" })
//         .to(".feature-2", { y: 100, opacity: 0, duration: 0.8, ease: "power3.in" }, "-=0.6")
//         .to(".feature-3", { x: 100, opacity: 0, duration: 0.8, ease: "power3.in" }, "-=0.6");
//     },
//   }));

//   return (
//     <div
//       ref={containerRef}
//       className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
//     >
//       {/* Feature 1 */}
//       <div
//         className="feature-1 bg-white rounded-xl shadow-lg p-6 text-center"
//         style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
//       >
//         <h3 className="text-lg font-bold text-gray-900">InsureIQ</h3>
//         <p className="text-gray-600 mt-2">
//           Instantly decode policies and simplify complex insurance coverage.
//         </p>
//       </div>

//       {/* Feature 2 */}
//       <div
//         className="feature-2 bg-white rounded-xl shadow-lg p-6 text-center"
//         style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
//       >
//         <h3 className="text-lg font-bold text-gray-900">MediGuide</h3>
//         <p className="text-gray-600 mt-2">
//           Your trusted health assistant for accurate medical advice anytime.
//         </p>
//       </div>

//       {/* Feature 3 */}
//       <div
//         className="feature-3 bg-white rounded-xl shadow-lg p-6 text-center"
//         style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
//       >
//         <h3 className="text-lg font-bold text-gray-900">DiagnoScan</h3>
//         <p className="text-gray-600 mt-2">
//           AI-powered scans to detect and explain health conditions quickly.
//         </p>
//       </div>
//     </div>
//   );
// });

// export default ExtraFeatures;















import React, { useEffect, forwardRef, useRef, useImperativeHandle } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';


const ExtraFeatures = forwardRef((props, ref) => {
    const containerRef = useRef(null);
   const { t } = useTranslation();
    // Enter Animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            tl.from(".feature-1", { x: -100, opacity: 0, duration: 1, ease: "power3.out" })
                .from(".feature-2", { y: -100, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.5")
                .from(".feature-3", { x: 100, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.5");
        }, containerRef);
        return () => ctx.revert();
    }, []);

    useImperativeHandle(ref, () => ({
        container: containerRef.current,
        scrollToSelf: () => {
            containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        },
        playExit: () => {
            return new Promise((resolve) => {
                const tl = gsap.timeline({
                    onComplete: resolve, // ✅ Wait till animation ends
                });
                tl.to(".feature-1", { x: -100, opacity: 0, duration: 0.6, ease: "power3.in" })
                    .to(".feature-2", { y: 100, opacity: 0, duration: 0.6, ease: "power3.in" }, "-=0.4")
                    .to(".feature-3", { x: 100, opacity: 0, duration: 0.6, ease: "power3.in" }, "-=0.4");
            });
        },
    }));

    return (
        <div
            ref={containerRef}
            className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
            <Link to='/insureIQ' onClick={() => { scrollTo(0, 0); }} >
                <div className="feature-1 bg-white rounded-xl shadow-lg p-6 text-center"
                    style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                    <h3 className="text-lg font-bold text-gray-900">{t('InsureIQ')}</h3>
                    <p className="text-gray-600 mt-2">{t('Instantly decode policies and simplify complex insurance coverage.')}</p>
                </div>
            </Link>


            <Link to='/mediGuide' onClick={() => { scrollTo(0, 0); }}>
                <div className="feature-2 bg-white rounded-xl shadow-lg p-6 text-center"
                    style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                    <h3 className="text-lg font-bold text-gray-900">{t('MediGuide')}</h3>
                    <p className="text-gray-600 mt-2">{t('Your trusted health assistant for accurate medical advice anytime.')}</p>
                </div>
            </Link>
            <Link to='/diagnoScan' onClick={() => { scrollTo(0, 0); }}>
                <div className="feature-3 bg-white rounded-xl shadow-lg p-6 text-center"
                    style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                    <h3 className="text-lg font-bold text-gray-900">{t('DiagnoScan')}</h3>
                    <p className="text-gray-600 mt-2">{t('AI-powered scans to detect and explain health conditions quickly.')}</p>
                </div>
            </Link>
        </div>
    );
});

export default ExtraFeatures;
