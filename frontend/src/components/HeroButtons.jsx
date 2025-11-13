// import { useEffect } from "react";
// import gsap from "gsap";

// const HeroButtons = () => {
//   useEffect(() => {
//     const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });

//     // 🔥 Left Button: Full left se aaye
//     tl.fromTo(
//       ".left-btn",
//       { x: "-100vw", opacity: 0 },
//       { x: 0, opacity: 1 },
//       0.2
//     );

//     // 🔥 Right Button: Full right se aaye
//     tl.fromTo(
//       ".right-btn",
//       { x: "100vw", opacity: 0 },
//       { x: 0, opacity: 1 },
//       0.2
//     );
//   }, []);

//   return (
//     <div className="flex gap-4 justify-center mt-6">
//       <button
//         className="left-btn bg-black text-white cursor-pointer px-6 py-3 rounded-xl font-medium transition-all duration-300"
//         style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 10px" }} // Normal state shadow
//         onMouseEnter={(e) =>
//           (e.currentTarget.style.boxShadow =
//             "rgba(0, 0, 0, 0.35) 0px 5px 15px")
//         }
//         onMouseLeave={(e) =>
//           (e.currentTarget.style.boxShadow =
//             "rgba(0, 0, 0, 0.25) 0px 4px 10px")
//         }
//       >
//         Get Instant Answers
//       </button>

//       <button
//         className="right-btn bg-white text-black cursor-pointer px-6 py-3 rounded-xl font-medium transition-all duration-300"
//         style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 10px" }}
//         onMouseEnter={(e) =>
//           (e.currentTarget.style.boxShadow =
//             "rgba(0, 0, 0, 0.35) 0px 5px 15px")
//         }
//         onMouseLeave={(e) =>
//           (e.currentTarget.style.boxShadow =
//             "rgba(0, 0, 0, 0.25) 0px 4px 10px")
//         }
//       >
//         See Our Services
//       </button>
//     </div>
//   );
// };

// export default HeroButtons;







































import { useEffect } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom"; 
import { useTranslation } from 'react-i18next';

const HeroButtons = () => {
    const { t } = useTranslation();
   const navigate = useNavigate(); 
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });

    // 🔥 Left Button: Full left se aaye
    tl.fromTo(
      ".left-btn",
      { x: "-100vw", opacity: 0 },
      { x: 0, opacity: 1 },
      0.2
    );

    // 🔥 Right Button: Full right se aaye
    tl.fromTo(
      ".right-btn",
      { x: "100vw", opacity: 0 },
      { x: 0, opacity: 1 },
      0.2
    );
  }, []);

  const handleScrollToServices = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };


  return (
    <div className="flex gap-4 justify-center mt-6">
      <button
      onClick={() => navigate("/analyzer")}
        className="left-btn bg-black text-white cursor-pointer px-6 py-3 rounded-xl font-medium transition-all duration-300"
        style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 10px" }} // Normal state shadow
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow =
            "rgba(0, 0, 0, 0.35) 0px 5px 15px")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow =
            "rgba(0, 0, 0, 0.25) 0px 4px 10px")
        }
      >
        {t('Get Instant Answers')}
      </button>

      <button
        className="right-btn bg-white text-black cursor-pointer px-6 py-3 rounded-xl font-medium transition-all duration-300"
        style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 10px" }}
        onClick={handleScrollToServices}  
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow =
            "rgba(0, 0, 0, 0.35) 0px 5px 15px")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow =
            "rgba(0, 0, 0, 0.25) 0px 4px 10px")
        }
      >
        {t('See Our Services')}
      </button>
    </div>
  );
};

export default HeroButtons;
