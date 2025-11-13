// import { useEffect, useRef } from "react";
// import gsap from "gsap";
// import Logo from "./Logo";
// import NavLinks from "./NavLinks";
// import GetStarted from "./GetStart";

// const Navbar = () => {
//   const logoRef = useRef(null);
//   const navRef = useRef(null);
//   const btnRef = useRef(null);

//   useEffect(() => {
//     const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

//     // 🔥 Animate main sections
//     tl.fromTo(
//       [logoRef.current, navRef.current, btnRef.current],
//       { y: -80, opacity: 0 }, // initial state
//       {
//         y: 0,
//         opacity: 1,
//         duration: 0.8,
//         stagger: 0.25,
//         clearProps: "all", // ensures they don't stay transformed
//       }
//     );

//     // 🔥 Animate NavLinks <a> tags
//     const navLinks = navRef.current.querySelectorAll("a");
//     gsap.fromTo(
//       navLinks,
//       { y: 20, opacity: 0 },
//       {
//         y: 0,
//         opacity: 1,
//         duration: 0.5,
//         stagger: 0.15,
//         delay: 1,
//         ease: "power2.out",
//         clearProps: "all",
//       }
//     );
//   }, []);

//   return (
//     <div className='sticky top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-2 bg-white'>
//       <div ref={logoRef}>
//         <Logo />
//       </div>
//       <div ref={navRef}>
//         <NavLinks />
//       </div>
//       <div ref={btnRef}>
//         <GetStarted />
//       </div>
//     </div>
//   );
// };

// export default Navbar;





import { useEffect, useRef } from "react";
import gsap from "gsap";
// import useHoverSpeech from "./hooks/useHoverSpeech";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import GetStarted from "./GetStart";
import LanguageSelector from './LanguageSelector';
const Navbar = () => {
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const btnRef = useRef(null);
  // useHoverSpeech();
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 🔥 Animate logo, nav & button (desktop)
    tl.fromTo(
      [logoRef.current, navRef.current, btnRef.current],
      { y: -80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.25,
        clearProps: "all",
      }
    );

    // 🔥 Animate NavLinks (desktop)
    const navLinks = navRef.current?.querySelectorAll("a");
    if (navLinks) {
      gsap.fromTo(
        navLinks,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.15,
          delay: 1,
          ease: "power2.out",
          clearProps: "all",
        }
      );
    }
  }, []);

  return (
    <div
      className="
        sticky top-0 left-0 z-50 w-full flex items-center justify-between
        px-4 md:px-16 lg:px-36 
        py-3 md:py-2 
        bg-transparent backdrop-blur-sm
        md:shadow-none shadow-md
      "
    >
      {/* 🔥 Logo */}
      <div ref={logoRef}>
        <Logo />
      </div>

      {/* 🔥 NavLinks (desktop only) */}
      <div ref={navRef} className="hidden md:block">
        <NavLinks />
      </div>

      {/* 🔥 Button (desktop only) */}
      <div ref={btnRef} className="hidden md:block">
        <GetStarted />
      </div>
      <LanguageSelector />

      {/* 🔥 Hamburger (mobile only) */}
      <div className="md:hidden">
        <NavLinks />
      </div>
    </div>
  );
};

export default Navbar;
