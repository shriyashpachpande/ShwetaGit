// import { useEffect, useRef } from "react";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const Description = () => {
//     const textRef = useRef(null);

//     useEffect(() => {
//         const importantWords = ["ClauseSense", "AI-powered", "patients", "their", "healthcare"];
//         const words = textRef.current.innerText.split(" ");

//         textRef.current.innerHTML = words
//             .map((word) => {
//                 const cleanWord = word.replace(/[^a-zA-Z-]/g, "");
//                 const isImportant = importantWords.includes(cleanWord);
//                 return `<span class="word inline-block opacity-0 ${isImportant ? "text-black font-semibold" : ""
//                     }">${word}</span>`;
//             })
//             .join(" ");

//         gsap.fromTo(
//             ".word",
//             { y: 30, opacity: 0, scale: 0.9 },
//             {
//                 y: 0,
//                 opacity: 1,
//                 scale: 1,
//                 duration: 0.8,
//                 ease: "power3.out",
//                 stagger: 0.08,
//                 scrollTrigger: {
//                     trigger: textRef.current,
//                     start: "top 80%",
//                     toggleActions: "play none none none",
//                 },
//             }
//         );
//     }, []);

//     return (
//         <div className="flex justify-center items-center  text-center mt-20 mb-20 px-4 py-0 ">
//             <p
//                 ref={textRef}
//                 className="text-[36px] md:text-[32px] sm:text-[26px] max-w-4xl leading-relaxed"
//                 style={{ color: "#0000008C" }}
//             >
//                 ClauseSense is an AI-powered platform designed to simplify and clarify
//                 complex medical documents and insurance policies. Our mission is to
//                 empower patients with instant, trusted answers, ensuring they understand
//                 their healthcare rights and options.
//             </p>
//         </div>
//     );
// };

// export default Description;








import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTranslation } from 'react-i18next';
gsap.registerPlugin(ScrollTrigger);

const Description = () => {
  const textRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const importantWords = ["ClauseSense", "AI-powered", "patients", "their", "healthcare"];
    const words = textRef.current.innerText.split(" ");

    textRef.current.innerHTML = words
      .map((word) => {
        const cleanWord = word.replace(/[^a-zA-Z-]/g, "");
        const isImportant = importantWords.includes(cleanWord);
        return `<span class="word inline-block opacity-0 ${
          isImportant ? "text-black font-semibold" : ""
        }">${word}</span>`;
      })
      .join(" ");

    gsap.fromTo(
      ".word",
      { y: 30, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <div className="flex justify-center items-center text-center mt-12 sm:mt-16 md:mt-20 mb-12 sm:mb-16 md:mb-20 px-4">
      <p
        ref={textRef}
        className="text-lg sm:text-xl md:text-2xl lg:text-[30px] max-w-md sm:max-w-2xl md:max-w-4xl leading-loose"
        style={{
          color: "#0000008C",
          lineHeight: "1.9", // 👈 extra spacing between lines
        }}
      >
        {t('ClauseSense is an AI-powered platform designed to simplify and clarify complex medical documents and insurance policies. Our mission is to empower patients with instant, trusted answers, ensuring they understand their healthcare rights and options.')}
      </p>
    </div>
  );
};

export default Description;
