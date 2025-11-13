// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";
// import card1 from "../../assets/card1.mp4"; // ✅ Correct path

// gsap.registerPlugin(ScrollTrigger);

// const FirstCard = () => {
//   const cardRef = useRef(null);

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
//     <div
//       ref={cardRef}
//       className="bg-[#f5f5f5] rounded-2xl shadow-lg p-6 flex flex-col items-center text-center"
//     style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
//     >
//       {/* Video */}
//       <div className="w-full h-50  overflow-hidden mb-4">
//         <video
//           className="w-full h-full object-cover"
//           autoPlay
//           loop
//           muted
//           playsInline
//           src={card1} // ✅ Dynamic import
//         />
//       </div>

//       {/* Text */}
//       <h3 className="text-lg font-bold text-gray-900">Smart Analyzer</h3>
//       <p className="text-gray-600 text-sm mt-2">
//         Single doc upload → Coverage summary.
//       </p>
//     </div>
//   );
// };

// export default FirstCard;

















// FirstCard.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom"; // ✅ Added
import card1 from "../../assets/card1.mp4"; // ✅ Correct path
import {Link} from "react-router-dom"
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const FirstCard = () => {
  const cardRef = useRef(null);
  const navigate = useNavigate(); // ✅ Added
    const { t } = useTranslation();

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

  return (
    <Link to='/analyzer' onClick={() => { scrollTo(0, 0);}} >
    <div
      ref={cardRef}
      onClick={() => navigate("/analyzer")} // ✅ Navigate on click
      className="bg-[#f5f5f5] rounded-2xl shadow-lg p-6 flex flex-col items-center text-center cursor-pointer"
      style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
    >
      {/* Video */}
      <div className="w-full h-50 overflow-hidden mb-4">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={card1}
        />
      </div>

      {/* Text */}
      <h3 className="text-lg font-bold text-gray-900">{t('Smart Analyzer')}</h3>
      <p className="text-gray-600 text-sm mt-2">
        {t('Single doc upload → Coverage summary.')}
      </p>
    </div>
    </Link>
  );
};

export default FirstCard;
