





// src/components/AiRoute.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { NavLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const AiRoute = () => {
  const containerRef = useRef(null);
  const linksRef = useRef([]);
   const { t } = useTranslation();
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { opacity: 0, duration: 1, ease: "power3.out" } });

      // Animate each link one by one
      tl.from(linksRef.current[0], { x: -100 }) // InsureIQ left
        .from(linksRef.current[1], { x: 100 }, "-=0.5") // MediGuide right
        .from(linksRef.current[2], { x: -100 }, "-=0.5"); // DiagnoScan left
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-[#f5f5f5] shadow-lg rounded-xl p-6 w-full"
      style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
    >
      <h2 className="text-xl font-bold mb-4 text-center text-blue-900">{t('AI Tools')}</h2>
      <ul className="space-y-4">
        <li ref={(el) => (linksRef.current[0] = el)}>
          <NavLink
            // to="/insureIQ"
            className="block p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition"
          >
            {t('InsureIQ')}
          </NavLink>
        </li>
        <li ref={(el) => (linksRef.current[1] = el)}>
          <NavLink
            // to="/mediGuide"
            className="block p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition"
          >
            {t('MediGuide')}
          </NavLink>
        </li>
        <li ref={(el) => (linksRef.current[2] = el)}>
          <NavLink
            // to="/diagnoScan"
            className="block p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition"
          >
            {t('DiagnoScan')}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AiRoute;

