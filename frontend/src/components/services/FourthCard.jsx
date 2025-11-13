// FourthCard.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom"; 
import { useTranslation } from "react-i18next";
import doctorVideo from "../../assets/card1.mp4"; // ✅ Add a video or image

gsap.registerPlugin(ScrollTrigger);

const FourthCard = () => {
  const cardRef = useRef(null);
  const navigate = useNavigate(); 
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
    <div
      ref={cardRef}
      onClick={() => navigate("/book-appointment")} // ✅ Doctor Appointment Page
      className="bg-[#f5f5f5] rounded-2xl shadow-lg p-6 flex flex-col items-center text-center cursor-pointer"
      style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
    >
      {/* Video or Image */}
      <div className="w-full h-50 overflow-hidden mb-4">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={doctorVideo} // ✅ Replace with your doctor video or image
        />
      </div>

      {/* Text */}
      <h3 className="text-lg font-bold text-gray-900">{t('Doctor Appointment')}</h3>
      <p className="text-gray-600 text-sm mt-2">
        {t('Book your appointment easily with our doctors.')}
      </p>
    </div>
  );
};

export default FourthCard;
