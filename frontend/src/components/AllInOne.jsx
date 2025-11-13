// // src/components/AllInOne.jsx
// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";
// import allInOneImage from "../assets/images/allinone.avif";

// export default function AllInOne() {
//   const textRef = useRef(null);
//   const imageWrapperRef = useRef(null);
//   const rotatingImageRef = useRef(null);

//   useEffect(() => {
//     // Animate text section sliding in from left
//     gsap.from(textRef.current, {
//       x: -100,
//       opacity: 0,
//       duration: 1.5,
//       ease: "power3.out",
//     });

//     // Image wrapper fade in
//     gsap.from(imageWrapperRef.current, {
//       opacity: 0,
//       duration: 1.8,
//       ease: "power2.out",
//     });

//     // Continuous slow rotation of image
//     gsap.to(rotatingImageRef.current, {
//       rotate: 360,
//       duration: 30,
//       repeat: -1,
//       ease: "linear",
//     });
//   }, []);

//   return (
//     <section className="w-full bg-[#f5f5f5]  py-16 px-4 sm:px-6 lg:px-40 ">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

//         {/* Text Content */}
//         <div ref={textRef} className="space-y-6">
//           <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-950">
//             All-in-One Platform
//           </h2>
//           <p className="text-lg sm:text-xl text-gray-600 leading-relaxed text-justify text-wrap">
//             Simplify your operations with an all-in-one platform that integrates essential tools and provides everything you need in one place.
//             We believe in creating tools that are not only powerful but easy to use.
//             Our goal is to help you achieve more, with less effort.
//           </p>
          
//         </div>

//         {/* Image with Overlay and Rotation */}
//         <div ref={imageWrapperRef} className="relative flex justify-center bg-transparent">
//           {/* Overlay Layer */}
//           <div className="absolute inset-0 bg-[#f5f5f5] opacity-30 rounded-xl pointer-events-none"></div>

//           {/* Rotating Image */}
//           <img
//             ref={rotatingImageRef}
//             src={allInOneImage}
//             alt="All in One Platform Illustration"
//             className="w-full max-w-md sm:max-w-lg rounded-xl "
//           />
//         </div>
//       </div>
//     </section>
//   );
// }























// src/components/AllInOne.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import allInOneImage from "../assets/images/allinone.avif";
import { useTranslation } from "react-i18next";

export default function AllInOne() {
  const textRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const rotatingImageRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Animate text section sliding in from left
    gsap.from(textRef.current, {
      x: -100,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
    });

    // Image wrapper fade in
    gsap.from(imageWrapperRef.current, {
      opacity: 0,
      duration: 1.8,
      ease: "power2.out",
    });

    // Continuous slow rotation of image
    gsap.to(rotatingImageRef.current, {
      rotate: 360,
      duration: 30,
      repeat: -1,
      ease: "linear",
    });
  }, []);

  return (
    <section className="w-full bg-[#f5f5f5] py-16 px-4 sm:px-6 lg:px-40">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Text Content */}
        <div ref={textRef} className="space-y-6">
          {/* ✅ Using translations */}
          <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-950">
            {t("All-in-One Platform")}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed text-justify text-wrap">
            {t("Simplify your operations with an all-in-one platform that integrates essential tools and provides everything you need in one place. We believe in creating tools that are not only powerful but easy to use. Our goal is to help you achieve more, with less effort.")}
          </p>
        </div>

        {/* Image with Overlay and Rotation */}
        <div ref={imageWrapperRef} className="relative flex justify-center bg-transparent">
          {/* Overlay Layer */}
          <div className="absolute inset-0 bg-[#f5f5f5] opacity-30 rounded-xl pointer-events-none"></div>

          {/* Rotating Image */}
          <img
            ref={rotatingImageRef}
            src={allInOneImage}
            alt={t("allInOneTitle")}
            className="w-full max-w-md sm:max-w-lg rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
