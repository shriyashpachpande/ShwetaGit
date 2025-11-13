import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import { useTranslation } from 'react-i18next';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TitleServices = () => {
   const { t } = useTranslation();
  useEffect(() => {
    // Function to animate text word by word
    const animateText = (selector, fromX = 0) => {
      const el = document.querySelector(selector);
      if (!el) return;

      const words = el.textContent.split(" ");
      el.innerHTML = words
        .map(
          (word) =>
            `<span class="inline-block opacity-0 translate-y-4">${word}</span>`
        )
        .join(" ");

      gsap.fromTo(
        `${selector} span`,
        { x: fromX, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: selector,
            start: "top 85%",
          },
        }
      );
    };

    animateText(".text-left-animate", -50); // Left animation
    animateText(".text-right-animate", 50); // Right animation
    animateText(".text-subtitle"); // Subtitle animation
  }, []);

  return (
    <section className="w-full flex flex-col items-center justify-center text-center pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8">
      {/* Badge */}
      <div className="service-badge bg-gray-100 text-gray-800 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium shadow-md flex items-center">
        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 fill-gray-500" />
        <span className="px-2 sm:px-3">{t('SERVICES')}</span>
      </div>

      {/* Title */}
      <h2 className="service-title text-left-animate text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mt-6">
        {t('Confused by insurance policies?')}
      </h2>
      <h2 className="service-title text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900 mt-4">
        ↓
      </h2>
      <h2 className="service-title text-right-animate text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mt-2">
        {t('DocBot simplifies them instantly')}
      </h2>

      {/* Subtitle */}
      <p className="service-subtitle text-subtitle text-gray-600 text-base sm:text-lg md:text-xl mt-6 sm:mt-10 max-w-md sm:max-w-xl md:max-w-2xl">
        {t('Explore powerful AI solutions for document analysis, insurance clarity, and healthcare insights—built to deliver value.')}
      </p>
    </section>
  );
};

export default TitleServices;
















// import { useEffect } from "react";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";
// import { Star } from "lucide-react";

// if (typeof window !== "undefined") {
//   gsap.registerPlugin(ScrollTrigger);
// }

// const TitleServices = () => {
//   useEffect(() => {
//     // Function to animate text word by word
//     const animateText = (selector, fromX) => {
//       const el = document.querySelector(selector);
//       if (!el) return;

//       const words = el.textContent.split(" ");
//       el.innerHTML = words
//         .map(
//           (word) =>
//             `<span class="inline-block opacity-0 translate-y-4">${word}</span>`
//         )
//         .join(" ");

//       gsap.fromTo(
//         `${selector} span`,
//         { x: fromX, opacity: 0 },
//         {
//           x: 0,
//           opacity: 1,
//           duration: 0.6,
//           ease: "power3.out",
//           stagger: 0.08,
//           scrollTrigger: {
//             trigger: selector,
//             start: "top 85%",
//           },
//         }
//       );
//     };

//     animateText(".text-left-animate", -50); // Left animation
//     animateText(".text-right-animate", 50); // Right animation
//   }, []);

//   return (
//     <section className="w-full flex flex-col items-center justify-center text-center pt-2 pb-10 px-6">
//       {/* Badge */}
//       <div className="service-badge bg-gray-100 text-gray-800 px-4 py-1 rounded-full text-sm font-medium shadow-md flex items-center">
//         <Star className="w-4 h-4 text-gray-500 fill-gray-500" />
//         <span className="px-3">SERVICES</span>
//       </div>

//       {/* Title */}
//       <h2 className="service-title text-left-animate text-4xl md:text-4xl font-bold text-blue-800 mt-7">
//         Confused by insurance policies?
//       </h2>
//       <h2 className="service-title text-4xl md:text-3xl font-bold text-gray-900 mt-5">
//         ↓
//       </h2>
//       <h2 className="service-title text-right-animate text-4xl md:text-4xl font-bold text-blue-900 mt-2">
//         DocBot simplifies them instantly.
//       </h2>

//       {/* Subtitle */}
//       <p className="service-subtitle text-gray-600 text-lg md:text-xl mt-10 max-w-2xl">
//         Explore powerful AI solutions for document analysis, insurance clarity,
//         and healthcare insights—built to deliver value.
//       </p>
//     </section>
//   );
// };

// export default TitleServices;
