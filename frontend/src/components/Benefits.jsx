// "use client";
// import React, { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// import img1 from "../assets/images/benefit1.avif";
// import img2 from "../assets/images/benefit2.avif";
// import img3 from "../assets/images/benefit3.avif";
// import img4 from "../assets/images/benefit4.avif";
// import img5 from "../assets/images/benefit5.avif";
// import img6 from "../assets/images/benefit6.avif";

// gsap.registerPlugin(ScrollTrigger);

// const benefitsData = [
//   {
//     img: img1,
//     title: "Real-Time Collaboration",
//     desc: "Work together seamlessly with live editing and instant updates.",
//   },
//   {
//     img: img2,
//     title: "Advanced Analytics",
//     desc: "Deep insights with analytics that help you track performance.",
//   },
//   {
//     img: img3,
//     title: "Custom Dashboards",
//     desc: "Personalize your own workspace with dashboards.",
//   },
//   {
//     img: img4,
//     title: "Automated Workflows",
//     desc: "Streamline repetitive tasks with saving time automation.",
//   },
//   {
//     img: img5,
//     title: "Recurring Payments",
//     desc: "Set up and manage recurring payments effortlessly.",
//   },
//   {
//     img: img6,
//     title: "Chat Integrations",
//     desc: "Integrate chat with other tools like project management.",
//   },
// ];

// export default function Benefits() {
//   const titleRef = useRef(null);
//   const boxesRef = useRef([]);

//   useEffect(() => {
//     // Title animation (word by word)
//     const titleWords = titleRef.current.querySelectorAll("span");
//     gsap.from(titleWords, {
//       opacity: 0,
//       y: 30,
//       stagger: 0.2,
//       duration: 0.6,
//       ease: "power3.out",
//       scrollTrigger: {
//         trigger: titleRef.current,
//         start: "top 80%",
//       },
//     });

//     // Boxes animation (one by one)
//     gsap.from(boxesRef.current, {
//       opacity: 0,
//       y: 50,
//       stagger: 0.2,
//       duration: 0.8,
//       ease: "power3.out",
//       scrollTrigger: {
//         trigger: boxesRef.current[0],
//         start: "top 85%",
//       },
//     });
//   }, []);

//   return (
//     <section className="w-full bg-[#f5f5f5] text-black px-6 md:px-16 lg:px-28 py-20">
//       {/* Title */}
//       <div className="text-center mb-12">
//         <h2
//           ref={titleRef}
//           className="text-3xl md:text-5xl font-semibold leading-snug"
//         >
//           {["Our", "Benefits"].map((word, i) => (
//             <span key={i} className="inline-block mr-2">
//               {word}
//             </span>
//           ))}
//         </h2>
//         <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
//           Drive growth with powerful tools, flexible integrations, and
//           personalized customer care.
//         </p>
//       </div>

//       {/* Boxes */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:ml-0 md:ml-30 sm:mr-0 md:mr-30" >
//         {benefitsData.map((item, i) => (
//           <div
//             key={i}
//             ref={(el) => (boxesRef.current[i] = el)}
//             className="bg-[#f5f5f5] rounded-xl p-6 shadow-md flex flex-col items-start hover:scale-105 transition-transform duration-300"
//             style={{boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px"}}
//           >
//             <img src={item.img} alt={item.title} className="w-12 h-12 mb-4" />
//             <h3 className="text-lg font-semibold mb-2 text-blue-950">{item.title}</h3>
//             <p className="text-gray-600 text-sm text-justify">{item.desc}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }





















"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";

import img1 from "../assets/images/benefit1.avif";
import img2 from "../assets/images/benefit2.avif";
import img3 from "../assets/images/benefit3.avif";
import img4 from "../assets/images/benefit4.avif";
import img5 from "../assets/images/benefit5.avif";
import img6 from "../assets/images/benefit6.avif";

gsap.registerPlugin(ScrollTrigger);

export default function Benefits() {
  const { t } = useTranslation(); // ✅ Hook must be used inside the component

  // ✅ Move benefitsData inside component so it has access to `t`
  const benefitsData = [
    {
      img: img1,
      title: t("Real-Time Collaboration"),
      desc: t("Work together seamlessly with live editing and instant updates."),
    },
    {
      img: img2,
      title: t("Advanced Analytics"),
      desc: t("Deep insights with analytics that help you track performance."),
    },
    {
      img: img3,
      title: t("Custom Dashboards"),
      desc: t("Personalize your own workspace with dashboards."),
    },
    {
      img: img4,
      title: t("Automated Workflows"),
      desc: t("Streamline repetitive tasks with saving time automation."),
    },
    {
      img: img5,
      title: t("Recurring Payments"),
      desc: t("Set up and manage recurring payments effortlessly."),
    },
    {
      img: img6,
      title: t("Chat Integrations"),
      desc: t("Integrate chat with other tools like project management."),
    },
  ];

  const titleRef = useRef(null);
  const boxesRef = useRef([]);

  useEffect(() => {
    // Title animation (word by word)
    const titleWords = titleRef.current.querySelectorAll("span");
    gsap.from(titleWords, {
      opacity: 0,
      y: 30,
      stagger: 0.2,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 80%",
      },
    });

    // Boxes animation (one by one)
    gsap.from(boxesRef.current, {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: boxesRef.current[0],
        start: "top 85%",
      },
    });
  }, []);

  return (
    <section className="w-full bg-[#f5f5f5] text-black px-6 md:px-16 lg:px-28 py-20">
      {/* Title */}
      <div className="text-center mb-12">
        <h2
          ref={titleRef}
          className="text-3xl md:text-5xl font-semibold leading-snug"
        >
          {[t("Our"), t("Benefits")].map((word, i) => (
            <span key={i} className="inline-block mr-2">
              {word}
            </span>
          ))}
        </h2>
        <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
          {t(
            "Drive growth with powerful tools, flexible integrations, and personalized customer care."
          )}
        </p>
      </div>

      {/* Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:ml-0 md:ml-30 sm:mr-0 md:mr-30">
        {benefitsData.map((item, i) => (
          <div
            key={i}
            ref={(el) => (boxesRef.current[i] = el)}
            className="bg-[#f5f5f5] rounded-xl p-6 shadow-md flex flex-col items-start hover:scale-105 transition-transform duration-300"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
            }}
          >
            <img src={item.img} alt={item.title} className="w-12 h-12 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-blue-950">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm text-justify">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
