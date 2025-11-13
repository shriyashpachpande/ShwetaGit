// import Cards from "./services/Cards";
// import TitleServices from "./services/TitleServices";

// const Services = () => {
//     return (
//         <div className="h-auto flex flex-col items-center justify-center bg-gray-100  px-4 sm:px-6 lg:px-8">
//             <TitleServices />
//             <Cards/>
//         </div>
//     );
// };

// export default Services;






import { useState, useRef, useEffect } from "react";
import Cards from "./services/Cards";
import TitleServices from "./services/TitleServices";
import ExtraFeatures from "./services/ExtraFeatures";

const Services = () => {
  const [isExtraOpen, setIsExtraOpen] = useState(false);
  const extraRef = useRef(null);
  const thirdCardRef = useRef(null);

  // Detect outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isExtraOpen &&
        extraRef.current &&
        !extraRef.current.contains(e.target) &&
        thirdCardRef.current &&
        !thirdCardRef.current.contains(e.target)
      ) {
        setIsExtraOpen(false); // Close if clicked outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExtraOpen]);

  return (
    <div id="services" className="h-auto flex flex-col items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <TitleServices />
      <Cards
        onThirdCardClick={() => setIsExtraOpen(!isExtraOpen)}
        thirdCardRef={thirdCardRef}
      />
      {isExtraOpen && <ExtraFeatures ref={extraRef} />}
    </div>
  );
};

export default Services;
