import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import FirstCard from "./FirstCard";
import SecondCard from "./SecondCard";
import ThirdCard from "./ThirdCard";
import ExtraFeatures from "./ExtraFeatures";
import FourthCard from "./FourthCard";
import FifthCard from "./FifthCard";

gsap.registerPlugin(ScrollTrigger);

const Cards = () => {
  const [showExtra, setShowExtra] = useState(false);
  const cardsRef = useRef([]);
  const extraRef = useRef(null);

  // Animate main cards (bottom to top, staggered)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.3,
        scrollTrigger: {
          trigger: ".cards-container",
          start: "top 85%",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  // Scroll when opening ExtraFeatures
  useEffect(() => {
    if (showExtra && extraRef.current) {
      extraRef.current.scrollToSelf();
    }
  }, [showExtra]);

  const handleCardClick = (card) => {
    if (card === "third") {
      if (showExtra) {
        // 🔥 Play Exit Animation first
        extraRef.current.playExit().then(() => {
          setShowExtra(false);
        });
      } else {
        setShowExtra(true);
      }
    } else {
      if (showExtra) {
        extraRef.current.playExit().then(() => {
          setShowExtra(false);
        });
      }
    }
  };

  return (
    <div
      className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 cards-container"
      onClick={(e) => {
        if (
          showExtra &&
          !extraRef.current?.container?.contains(e.target) &&
          !cardsRef.current[2]?.contains(e.target)
        ) {
          extraRef.current.playExit().then(() => setShowExtra(false));
        }
      }}
    >
      {/* 3 Main Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          ref={(el) => (cardsRef.current[0] = el)}
          onClick={() => handleCardClick("first")}
          className="cursor-pointer"
        >
          <FirstCard />
        </div>
        <div
          ref={(el) => (cardsRef.current[1] = el)}
          onClick={() => handleCardClick("second")}
          className="cursor-pointer"
        >
          <SecondCard />
        </div>
        <div
          ref={(el) => (cardsRef.current[2] = el)}
          onClick={() => handleCardClick("third")}
          className="cursor-pointer"
        >
          <ThirdCard />
        </div>


        
        <div
          ref={(el) => (cardsRef.current[2] = el)}
          onClick={() => handleCardClick("third")}
          className="cursor-pointer"
        >
          <FourthCard />
        </div>
        <div
          ref={(el) => (cardsRef.current[2] = el)}
          onClick={() => handleCardClick("third")}
          className="cursor-pointer"
        >
          <FifthCard />
        </div>
        
      </div>

      {/* Extra Features */}
      {showExtra && (
        <div className="mt-12">
          <ExtraFeatures ref={extraRef} />
        </div>
      )}
    </div>
  );
};

export default Cards;





