// // FifthCard.jsx
// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";
// import { Link } from "react-router-dom";
// import hospitalVid from "../../assets/home.mp4"; 
// import { useTranslation } from "react-i18next";

// gsap.registerPlugin(ScrollTrigger);

// const FifthCard = () => {
//   const cardRef = useRef(null);
//   const { t } = useTranslation();

//   useEffect(() => {
//     gsap.fromTo(
//       cardRef.current,
//       { opacity: 0, y: 50, scale: 0.95 },
//       {
//         opacity: 1,
//         y: 0,
//         scale: 1,
//         duration: 1,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: cardRef.current,
//           start: "top 85%",
//         },
//       }
//     );
//   }, []);

//   return (
//     <a 
//       href="https://nearby-hospitals-lac.vercel.app/" 
//       target="_blank" 
//       rel="noopener noreferrer"
//       onClick={() => { scrollTo(0, 0); }}
//     >
//       <div
//         ref={cardRef}
//         className="bg-[#f5f5f5] rounded-2xl shadow-lg p-6 flex flex-col items-center text-center cursor-pointer"
//         style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
//       >
//         {/* Video */}
//         <div className="w-full h-50 overflow-hidden mb-4 " style={{height:'235px'}}>
//           <video
//             className="w-full h-full object-cover"
//             autoPlay
//             loop
//             muted
//             playsInline
//             src={hospitalVid}
//           />
//         </div>

//         {/* Text */}
//         <h3 className="text-lg font-bold text-gray-900">
//           {t("Nearby Hospitals")}
//         </h3>
//         <p className="text-gray-600 text-sm mt-2">
//           {t("Find hospitals around you with live map.")}
//         </p>
//       </div>
//     </a>
//   );
// };

// export default FifthCard;







// src/components/FifthCard.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import hospitalVid from "../../assets/home.mp4"; 
import { useTranslation } from "react-i18next";

gsap.registerPlugin(ScrollTrigger);

const FifthCard = () => {
  const cardRef = useRef(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
        },
      }
    );
  }, []);

  const handleClick = () => {
    scrollTo(0, 0);
    navigate("/nearby-hospitals");
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className="bg-[#f5f5f5] rounded-2xl shadow-lg p-6 flex flex-col items-center text-center cursor-pointer transition-transform duration-200 hover:scale-105"
      style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <div className="w-full h-50 overflow-hidden mb-4" style={{height:'235px'}}>
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={hospitalVid}
        />
      </div>

      <h3 className="text-lg font-bold text-gray-900">
        {t("Nearby Hospitals")}
      </h3>
      <p className="text-gray-600 text-sm mt-2">
        {t("Find hospitals around you with live map.")}
      </p>
    </div>
  );
};

export default FifthCard;
