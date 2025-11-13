
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Star } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const priceTitle = () => {
  

  return (
    <section className="w-full flex flex-col items-center justify-center text-center pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8">
      {/* Badge */}
      <div className="service-badge bg-gray-100 text-gray-800 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium shadow-md flex items-center">
        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 fill-gray-500" />
        <span className="px-2 sm:px-3">SERVICES</span>
      </div>

      {/* Title */}
      <h2 className="service-title text-left-animate text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mt-6">
        Confused by insurance policies?
      </h2>
      <h2 className="service-title text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900 mt-4">
        ↓
      </h2>
      <h2 className="service-title text-right-animate text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mt-2">
        DocBot simplifies them instantly.
      </h2>

      {/* Subtitle */}
      <p className="service-subtitle text-subtitle text-gray-600 text-base sm:text-lg md:text-xl mt-6 sm:mt-10 max-w-md sm:max-w-xl md:max-w-2xl">
        Explore powerful AI solutions for document analysis, insurance clarity,
        and healthcare insights—built to deliver value.
      </p>
    </section>
  );
};

export default priceTitle;



