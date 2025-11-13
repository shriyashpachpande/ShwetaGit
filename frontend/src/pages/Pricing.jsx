// import React, { useMemo, useRef, useState, useEffect } from "react";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { createCheckout, getMySubscription, openPortal } from "../api";
// import { useAuth, useUser, useClerk } from "@clerk/clerk-react";
// import { Star } from "lucide-react";
// import toast from "react-hot-toast";

// // GSAP react plugin
// gsap.registerPlugin(useGSAP);

// export default function Pricing() {
//   const { getToken } = useAuth();
//   const { user, isSignedIn } = useUser();
//   const { signOut } = useClerk();

//   const [billing, setBilling] = useState("monthly"); // "monthly" | "yearly"
//   const [subInfo, setSubInfo] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Scopes
//   const sectionRef = useRef(null);
//   const logoutBtnRef = useRef(null);

//   // Segmented control refs
//   const segRef = useRef(null);
//   const indicatorRef = useRef(null);

//   const plans = {
//     monthly: {
//       Starter: "Starter_monthly",
//       Pro: "Pro_monthly",
//       Enterprise: "Enterprise_monthly",
//     },
//     yearly: {
//       Starter: "Starter_yearly",
//       Pro: "Pro_yearly",
//       Enterprise: "Enterprise_yearly",
//     },
//   };

//   // Welcome text split into words for stagger
//   const welcomeJSX = useMemo(() => {
//     const displayName =
//       user?.fullName ||
//       user?.username ||
//       user?.primaryEmailAddress?.emailAddress ||
//       "User";
//     const parts = `Welcome, ${displayName}`.split(" ");
//     return (
//       <p aria-label={`Welcome, ${displayName}`} className="select-none">
//         {parts.map((w, i) => (
//           <span key={i} className="word inline-block opacity-0 translate-y-2 px-1">
//             {w}
//             {i < parts.length - 1 ? " " : ""}
//           </span>
//         ))}
//       </p>
//     );
//   }, [user]);

//   // Page entrance animations
//   useGSAP(
//     (context, contextSafe) => {
//       const mm = gsap.matchMedia(sectionRef);

//       mm.add(
//         {
//           reduce: "(prefers-reduced-motion: reduce)",
//           sm: "(max-width: 640px)",
//           md: "(min-width: 641px) and (max-width: 1024px)",
//           lg: "(min-width: 1025px)",
//         },
//         (ctx) => {
//           const { reduce, sm, md, lg } = ctx.conditions;
//           const select = context.selector;

//           const badge = select(".service-badge") || null;
//           const title = select(".service-title") || null;
//           const subtitle = select(".service-subtitle") || null;

//           const welcomeBox = select(".welcome-box") || null;
//           const words = select(".word") || [];
//           const logoutBtn = logoutBtnRef.current || null;

//           if (badge) gsap.set(badge, { opacity: 0, y: reduce ? 0 : 8 });
//           if (title) gsap.set(title, { opacity: 0, y: reduce ? 0 : 10 });
//           if (subtitle) gsap.set(subtitle, { opacity: 0, y: reduce ? 0 : 10 });
//           if (welcomeBox) gsap.set(welcomeBox, { opacity: 0, y: reduce ? 0 : (sm ? 8 : 12) });
//           if (logoutBtn) gsap.set(logoutBtn, { opacity: 0, y: reduce ? 0 : 8, scale: reduce ? 1 : 0.97 });

//           const ease = "power3.out";
//           const dur = reduce ? 0.25 : sm ? 0.45 : md ? 0.55 : 0.65;

//           const tl = gsap.timeline({ defaults: { ease } });

//           if (badge) tl.to(badge, { opacity: 1, y: 0, duration: dur });
//           if (title) tl.to(title, { opacity: 1, y: 0, duration: dur }, "-=30%");
//           if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: dur }, "-=25%");
//           if (welcomeBox) tl.to(welcomeBox, { opacity: 1, y: 0, duration: dur }, "-=15%");

//           if (words.length) {
//             tl.to(
//               words,
//               {
//                 opacity: 1,
//                 y: 0,
//                 duration: reduce ? 0.16 : 0.28,
//                 stagger: { amount: reduce ? 0.12 : sm ? 0.3 : lg ? 0.5 : 0.4, from: "start" },
//               },
//               "-=20%"
//             );
//           }

//           if (logoutBtn) {
//             tl.to(
//               logoutBtn,
//               { opacity: 1, y: 0, scale: 1, duration: reduce ? 0.18 : 0.26 },
//               "-=10%"
//             );

//             if (!reduce) {
//               const onEnter = contextSafe(() =>
//                 gsap.to(logoutBtn, { y: -2, scale: 1.02, duration: 0.18, ease: "power2.out" })
//               );
//               const onLeave = contextSafe(() =>
//                 gsap.to(logoutBtn, { y: 0, scale: 1, duration: 0.22, ease: "power2.out" })
//               );

//               logoutBtn.addEventListener?.("pointerenter", onEnter);
//               logoutBtn.addEventListener?.("pointerleave", onLeave);

//               ctx.add(() => {
//                 logoutBtn.removeEventListener?.("pointerenter", onEnter);
//                 logoutBtn.removeEventListener?.("pointerleave", onLeave);
//               });
//             }
//           }

//           return () => { };
//         }
//       );

//       return () => mm.revert();
//     },
//     { scope: sectionRef, dependencies: [isSignedIn] }
//   ); // Entrance animations [11][3]

//   // Segmented toggle underline animation
//   useEffect(() => {
//     if (!segRef.current || !indicatorRef.current) return;
//     const mm = gsap.matchMedia(segRef);
//     mm.add({ reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
//       const { reduce } = ctx.conditions;
//       const xPercent = billing === "yearly" ? 100 : 0; // 0 => Monthly, 100 => Yearly
//       gsap.to(indicatorRef.current, {
//         xPercent,
//         duration: reduce ? 0 : 0.35,
//         ease: "power3.out",
//       });
//     });
//     return () => mm.revert();
//   }, [billing]);

//   // API handlers
//   async function startCheckout(priceKey) {
//     try {
//       setLoading(true);
//       const token = await getToken();
//       const { url, error } = await createCheckout(priceKey, token);
//       if (url) window.location.href = url;
//       else alert("Checkout failed: " + (error || "Unknown error"));
//     } catch (err) {
//       alert("Checkout failed: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function checkMySub() {
//     try {
//       setLoading(true);
//       const token = await getToken();
//       const info = await getMySubscription(token);
//       setSubInfo(info);
//     } catch (err) {
//       alert("Failed to fetch subscription: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function manageBilling() {
//     try {
//       setLoading(true);
//       const token = await getToken();
//       const { url } = await openPortal(token);
//       if (url) window.location.href = url;
//       else toast.error("Failed to open billing portal.");
//     } catch (err) {
//       alert("Failed to open portal: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div
//       id="services"
//       ref={sectionRef}
//       className="h-auto flex flex-col items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8"
//     >
//       <section className="w-full flex flex-col items-center justify-center text-center pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8">
//         {/* Badge */}
//         <div className="service-badge bg-gray-100 text-gray-800 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium shadow-md flex items-center">
//           <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 fill-gray-500" />
//           <span className="px-2 sm:px-3">SERVICES</span>
//         </div>

//         {/* User Info & Logout */}
//         {isSignedIn ? (
//           <div
//             className="
//               welcome-box mt-5 mb-2
//               flex items-center gap-3 justify-between flex-wrap
//               rounded-lg border border-gray-300 bg-[#f5f5f5]
//               px-3 py-2 sm:px-4 sm:py-2
//               shadow-[0_3px_6px_rgba(0,0,0,0.16),0_3px_6px_rgba(0,0,0,0.23)]
//             "
//           >
//             <div className="text-sm sm:text-base md:text-[17px] font-medium px-4 text-gray-900">
//               {welcomeJSX}
//             </div>
//             <button
//               ref={logoutBtnRef}
//               className="
//                 logout-btn
//                 flex-shrink-0 px-4 sm:px-6 py-2
//                 rounded-xl text-black font-bold
//                 bg-[#f5f5f5] border border-gray-200 hover:bg-[#edededc8]
//                 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer
//                 focus:outline-none focus:ring-2 focus:ring-blue-500/40
//               "
//               onClick={() => signOut({ redirectUrl: "/" })}
//             >
//               Logout
//             </button>
//           </div>
//         ) : (
//           <p className="mt-5 text-black bg-[#f5f5f5]">⚠️ Please sign in to subscribe.</p>
//         )}

//         {/* Title */}
//         <h2 className="service-title text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mt-4">
//           Simple Price For All.
//         </h2>

//         {/* Subtitle */}
//         <p className="service-subtitle text-gray-600 text-base sm:text-lg md:text-xl mt-0 sm:mt-10 max-w-md sm:max-w-xl md:max-w-2xl">
//           Flexible pricing plans that fit your budget & scale with needs.
//         </p>
//       </section>

//       {/* Billing segmented control */}
//       <div
//         ref={segRef}
//         className="relative mb-6 inline-flex w-full max-w-xs sm:max-w-sm items-center justify-around
//              rounded-full bg-[#f5f5f5] shadow-md ring-1 ring-black/5 px-1 py-1 cursor-pointer"
//         role="group"
//         aria-label="Billing period"
//         style={{boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;"}}
//       >
//         {/* moving black underline */}
//         <span
//           ref={indicatorRef}
//           aria-hidden="true"
//           className="pointer-events-none absolute bottom-0 h-[3px] w-1/2 rounded-full active:bg-black cursor-pointer"
//           style={{ left: 0, transform: "translateX(0%)" }} // default Monthly
//         />

//         <button
//           type="button"
//           className={`relative z-10 flex-1 select-none cursor-pointer rounded-full px-4 py-2 text-sm sm:text-base font-medium transition-colors
//       ${billing === "monthly" ? "text-gray-900" : "text-gray-500 hover:text-gray-800"}`}
//           onClick={() => setBilling("monthly")}
//           aria-pressed={billing === "monthly"}
//         >
//           Monthly
//         </button>

//         <span className="mx-1 hidden sm:inline-block h-6 w-px bg-[#f5f5f5]"
//           style={{ boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px" }}
//         />

//         <button
//           type="button"
//           className={`relative z-10 flex-1 select-none cursor-pointer rounded-full px-4 py-2 text-sm sm:text-base font-medium transition-colors
//       ${billing === "yearly" ? "text-gray-900" : "text-gray-400 hover:text-gray-800"}`}
//           onClick={() => setBilling("yearly")}
//           aria-pressed={billing === "yearly"}
//         >
//           <span className="inline-flex items-center gap-2">
//             Yearly
//             <span className="inline-flex items-center cursor-pointer rounded-xl bg-[#f5f5f5] px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm"
//               style={{ boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px" }}
//             >
//               30% off
//             </span>
//           </span>
//         </button>
//       </div>

//       {/* Plans */}
//       <div className="flex flex-wrap gap-5 mt-5" 
//       style={{boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;"}}
//       >
//         {["Starter", "Pro", "Enterprise"].map((plan) => (
//           <div
//             key={plan}
//             className="min-w-[200px] rounded-xl border border-gray-300 bg-[#F5F5F5] p-5 shadow-sm"
//           >
//             <h3 className="font-semibold">{plan.toUpperCase()}</h3>
//             <p className="text-gray-600 mt-1">
//               {billing === "monthly" ? `Monthly plan` : `Yearly plan (30% off)`}
//             </p>
//             <button
//               onClick={() => startCheckout(plans[billing][plan])}
//               disabled={!isSignedIn || loading}
//               className="border mt-3 px-3 py-1 rounded disabled:cursor-not-allowed"
//             >
//               {loading ? "Processing..." : "Get Started"}
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Subscription Info */}
//       <div className="mt-10">
//         <button
//           onClick={checkMySub}
//           disabled={!isSignedIn || loading}
//           className="border px-3 py-1 rounded disabled:cursor-not-allowed"
//         >
//           {loading ? "Loading..." : "Check My Subscription"}
//         </button>

//         {subInfo && (
//           <div className="mt-5 space-y-1">
//             <p>Status: {subInfo.active ? " Active" : " Inactive"}</p>
//             {subInfo.active && (
//               <>
//                 <p>Plan: {subInfo.plan}</p>
//                 <p>Days left: {subInfo.daysLeft}</p>
//                 <p>Renews on: {new Date(subInfo.currentPeriodEnd).toDateString()}</p>
//                 <button
//                   onClick={manageBilling}
//                   disabled={loading}
//                   className="border px-3 py-1 rounded mt-2"
//                 >
//                   Manage Billing
//                 </button>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





























import React, { useMemo, useRef, useState, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { createCheckout, getMySubscription, openPortal } from "../api";
import { useAuth, useUser, useClerk } from "@clerk/clerk-react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(useGSAP);

export default function Pricing() {
  const { getToken } = useAuth();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const [billing, setBilling] = useState("monthly");
  const [subInfo, setSubInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Scopes
  const sectionRef = useRef(null);
  const logoutBtnRef = useRef(null);

  // Segmented control refs
  const segRef = useRef(null);
  const indicatorRef = useRef(null);

  // Cards wrapper
  const cardsWrapRef = useRef(null);

  const plans = {
    monthly: {
      Starter: "Starter_monthly",
      Pro: "Pro_monthly",
      Enterprise: "Enterprise_monthly",
    },
    yearly: {
      Starter: "Starter_yearly",
      Pro: "Pro_yearly",
      Enterprise: "Enterprise_yearly",
    },
  };

  // Fixed price maps (as Provided)
  const monthlyPrice = { Starter: 800, Pro: 1700, Enterprise: 4700 };
  const yearlyPrice = { Starter: 4200, Pro: 7500, Enterprise: 11000 };
  const unitLabel = billing === "monthly" ? "/month" : "/year";

  // Welcome words
  const welcomeJSX = useMemo(() => {
    const displayName =
      user?.fullName ||
      user?.username ||
      user?.primaryEmailAddress?.emailAddress ||
      "User";
    const parts = `Welcome, ${displayName}`.split(" ");
    return (
      <p aria-label={`Welcome, ${displayName}`} className="select-none">
        {parts.map((w, i) => (
          <span key={i} className="word inline-block opacity-0 translate-y-2 px-1">
            {w}
            {i < parts.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    );
  }, [user]); // Conditional rendering pattern is standard React best practice. [1][2]

  // Page entrance (badge/title/subtitle/welcome/logout)
  useGSAP(
    (context, contextSafe) => {
      const mm = gsap.matchMedia(sectionRef);

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          sm: "(max-width: 640px)",
          md: "(min-width: 641px) and (max-width: 1024px)",
          lg: "(min-width: 1025px)",
        },
        (ctx) => {
          const { reduce, sm, md, lg } = ctx.conditions;
          const select = context.selector;

          const badge = select(".service-badge") || null;
          const title = select(".service-title") || null;
          const subtitle = select(".service-subtitle") || null;

          const welcomeBox = select(".welcome-box") || null;
          const words = select(".word") || [];
          const logoutBtn = logoutBtnRef.current || null;

          if (badge) gsap.set(badge, { opacity: 0, y: reduce ? 0 : 8 });
          if (title) gsap.set(title, { opacity: 0, y: reduce ? 0 : 10 });
          if (subtitle) gsap.set(subtitle, { opacity: 0, y: reduce ? 0 : 10 });
          if (welcomeBox) gsap.set(welcomeBox, { opacity: 0, y: reduce ? 0 : (sm ? 8 : 12) });
          if (logoutBtn) gsap.set(logoutBtn, { opacity: 0, y: reduce ? 0 : 8, scale: reduce ? 1 : 0.97 });

          const ease = "power3.out";
          const dur = reduce ? 0.25 : sm ? 0.45 : md ? 0.55 : 0.65;

          const tl = gsap.timeline({ defaults: { ease } });

          if (badge) tl.to(badge, { opacity: 1, y: 0, duration: dur });
          if (title) tl.to(title, { opacity: 1, y: 0, duration: dur }, "-=30%");
          if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: dur }, "-=25%");
          if (welcomeBox) tl.to(welcomeBox, { opacity: 1, y: 0, duration: dur }, "-=15%");

          if (words.length) {
            tl.to(
              words,
              {
                opacity: 1,
                y: 0,
                duration: reduce ? 0.16 : 0.28,
                stagger: { amount: reduce ? 0.12 : sm ? 0.3 : lg ? 0.5 : 0.4, from: "start" },
              },
              "-=20%"
            );
          }

          if (logoutBtn) {
            tl.to(
              logoutBtn,
              { opacity: 1, y: 0, scale: 1, duration: reduce ? 0.18 : 0.26 },
              "-=10%"
            );

            if (!reduce) {
              const onEnter = contextSafe(() =>
                gsap.to(logoutBtn, { y: -2, scale: 1.02, duration: 0.18, ease: "power2.out" })
              );
              const onLeave = contextSafe(() =>
                gsap.to(logoutBtn, { y: 0, scale: 1, duration: 0.22, ease: "power2.out" })
              );

              logoutBtn.addEventListener?.("pointerenter", onEnter);
              logoutBtn.addEventListener?.("pointerleave", onLeave);

              ctx.add(() => {
                logoutBtn.removeEventListener?.("pointerenter", onEnter);
                logoutBtn.removeEventListener?.("pointerleave", onLeave);
              });
            }
          }

          return () => { };
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [isSignedIn] }
  ); // Responsive entrance using matchMedia for motion preferences and breakpoints. [3][4]

  // Segmented toggle underline animation
  useEffect(() => {
    if (!segRef.current || !indicatorRef.current) return;
    const mm = gsap.matchMedia(segRef);
    mm.add({ reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      const { reduce } = ctx.conditions;
      const xPercent = billing === "yearly" ? 100 : 0;
      gsap.to(indicatorRef.current, {
        xPercent,
        duration: reduce ? 0 : 0.35,
        ease: "power3.out",
      });
    });
    return () => mm.revert();
  }, [billing]); // Underline slides between Monthly and Yearly reliably via translate percentages. [3][4]

  // Cards entrance: 1->left, 2->bottom, 3->right; sequential + inner words stagger
  useLayoutEffect(() => {
    const wrap = cardsWrapRef.current;
    if (!wrap) return;

    const mm = gsap.matchMedia(wrap);

    mm.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        sm: "(max-width: 640px)",
        md: "(min-width: 641px) and (max-width: 1024px)",
        lg: "(min-width: 1025px)",
      },
      (ctx) => {
        const { reduce } = ctx.conditions;
        const cards = wrap.querySelectorAll("[data-card]");

        gsap.set(cards, { autoAlpha: 0 });

        const fromStates = [
          { x: -40, y: 0 }, // 1st: left -> right
          { x: 0, y: 40 },  // 2nd: bottom -> top
          { x: 40, y: 0 },  // 3rd: right -> left
        ];

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        cards.forEach((card, i) => {
          const dir = fromStates[i] || { x: 0, y: 30 };
          tl.fromTo(
            card,
            { ...dir, autoAlpha: 0, scale: reduce ? 1 : 0.98 },
            { x: 0, y: 0, autoAlpha: 1, scale: 1, duration: reduce ? 0.25 : 0.6 },
            i === 0 ? 0 : ">+=0.08"
          );

          const inner = card.querySelectorAll("[data-in]");
          tl.from(
            inner,
            {
              y: reduce ? 0 : 10,
              autoAlpha: 0,
              duration: reduce ? 0.15 : 0.35,
              stagger: { each: reduce ? 0.02 : 0.06, from: "start" },
            },
            "<+=0.02"
          );
        });

        return () => tl.kill();
      }
    );

    return () => mm.revert();
  }, []); // Sequenced stagger entrances are a common GSAP pattern for lists/grids. [3][5]

  // API handlers
  async function startCheckout(priceKey) {
    try {
      setLoading(true);
      const token = await getToken();
      const { url, error } = await createCheckout(priceKey, token);
      if (url) window.location.href = url;
      else alert("Checkout failed: " + (error || "Unknown error"));
    } catch (err) {
      alert("Checkout failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function checkMySub() {
    try {
      setLoading(true);
      const token = await getToken();
      const info = await getMySubscription(token);
      setSubInfo(info);
    } catch (err) {
      alert("Failed to fetch subscription: " + err.message);
    } finally {
      setLoading(false);
    }
  }
  const { t } = useTranslation();
  async function manageBilling() {
    try {
      setLoading(true);
      const token = await getToken();
      const { url } = await openPortal(token);
      if (url) window.location.href = url;
      else toast.error("Failed to open billing portal.");
    } catch (err) {
      alert("Failed to open portal: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      id="services"
      ref={sectionRef}
      className="h-auto flex flex-col items-center justify-center bg-[#f5f5f5] px-4 sm:px-6 lg:px-8"
    >
      <section className="w-full flex flex-col items-center justify-center text-center pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8">
        {/* Badge */}
        <div className="service-badge bg-[#f5f5f5] text-gray-800 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium shadow-md flex items-center">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 fill-gray-500" />
          <span className="px-2 sm:px-3">{t('SERVICES')}</span>
        </div>

        {/* User Info & Logout */}
        {isSignedIn ? (
          <div
            className="
              welcome-box mt-5 mb-2
              flex items-center gap-3 justify-between flex-wrap
              rounded-lg border border-gray-300 bg-[#f5f5f5]
              px-3 py-2 sm:px-4 sm:py-2
              shadow-[0_3px_6px_rgba(0,0,0,0.16),0_3px_6px_rgba(0,0,0,0.23)]
            "
          >
            <div className="text-sm sm:text-base md:text-[17px] font-medium px-4 text-gray-900">
              {welcomeJSX}
            </div>
            <button
              ref={logoutBtnRef}
              className="
                logout-btn
                flex-shrink-0 px-4 sm:px-6 py-2
                rounded-xl text-black font-bold
                bg-[#f5f5f5] border border-gray-200 hover:bg-[#edededc8]
                disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
              "
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              {t('Logout')}
            </button>
          </div>
        ) : (
          <p className="mt-5 text-black bg-[#f5f5f5]"> {t('Please sign in to subscribe.')}</p>
        )}

        {/* Title */}
        <h2 className="service-title text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mt-4">
          {t('Simple Price For All.')}
        </h2>

        {/* Subtitle */}
        <p className="service-subtitle text-gray-600 text-base sm:text-lg md:text-xl mt-0 sm:mt-10 max-w-md sm:max-w-xl md:max-w-2xl">
          {t('Flexible pricing plans that fit your budget & scale with needs.')}
        </p>
      </section>

      {/* Billing segmented control */}
      <div
        ref={segRef}
        className="relative mb-6 inline-flex w-full max-w-xs sm:max-w-sm items-center justify-around
         rounded-full bg-[#f5f5f5] shadow-md ring-1 px-1 py-1 cursor-pointer"
        role="group"
        aria-label="Billing period"
        style={{ boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px" }}
      >
        {/* moving black underline */}
        <span
          ref={indicatorRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 h-[3px] w-1/2 rounded-full"
          style={{ left: 0, transform: "translateX(0%)" }}
        />

        <button
          type="button"
          className={`relative z-10 flex-1 select-none cursor-pointer rounded-full px-4 py-2 text-sm sm:text-base font-medium transition-colors
      ${billing === "monthly" ? "text-gray-900" : "text-gray-500 hover:text-gray-800"}`}
          onClick={() => setBilling("monthly")}
          aria-pressed={billing === "monthly"}
        >
          {t('Monthly')}
        </button>

        <span
          className="mx-1 hidden sm:inline-block h-6 w-px bg-[#f5f5f5]"
          style={{ boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px" }}
        />

        <button
          type="button"
          className={`relative z-10 flex-1 select-none cursor-pointer rounded-full px-4 py-2 text-sm sm:text-base font-medium transition-colors
      ${billing === "yearly" ? "text-gray-900" : "text-gray-400 hover:text-gray-800"}`}
          onClick={() => setBilling("yearly")}
          aria-pressed={billing === "yearly"}
        >
          <span className="inline-flex items-center gap-2">
            {t('Yearly')}
            <span
              className="inline-flex items-center cursor-pointer rounded-xl bg-[#f5f5f5] px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm"
              style={{ boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px" }}
            >
              {t('30% off')}
            </span>
          </span>
        </button>
      </div>

      {/* Plans with animations */}
      <div
        ref={cardsWrapRef}
        className="flex flex-wrap gap-6 mt-8 w-full justify-center"
      >
        {["Starter", "Pro", "Enterprise"].map((plan) => {
          const price = billing === "monthly" ? monthlyPrice[plan] : yearlyPrice[plan];
          return (
            <div
              key={plan}
              data-card
              className="
                  flex flex-col text-left
                  flex-1 min-w-[260px] max-w-[480px]
                  rounded-3xl bg-[#f5f5f5] p-7 sm:p-8
                "
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.15) 0px 13px 27px -5px, rgba(0, 0, 0, 0.25) 0px 8px 16px -8px",
              }}
            >
              {/* Header */}
              <h3 data-in className="font-semibold text-xl sm:text-2xl tracking-tight">
                {t(plan)}
              </h3>

              {/* Price row (dynamic by billing) */}
              <div data-in className="mt-4 flex items-end gap-2">
                <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                  ₹{price}
                </span>
                <span className="mb-1 text-gray-600">{unitLabel}</span>
              </div>

              {/* Subcopy */}
              <p data-in className="mt-4 text-gray-600 leading-relaxed max-w-full text-justify">
                {plan === "Starter" &&
                  t("Ideal for businesses ready to explore AI and intelligent automation")}
                {plan === "Pro" &&
                  t("Built for companies that want to gain an edge with AI‑powered automation")}
                {plan === "Enterprise" &&
                  t("For businesses aiming to harness AI and automation to lead their industry")}
              </p>

              {/* CTA */}
              <button
                data-in
                onClick={() => startCheckout(plans[billing][plan].toLowerCase())}
                disabled={!isSignedIn || loading}
                className="
                    mt-6 inline-flex w-full sm:w-auto items-center justify-center
                    rounded-xl px-5 py-3 font-bold text-blue-900 cursor-pointer 
                    disabled:cursor-not-allowed
                    bg-[#f5f5f5] hover:bg-[#ececec] focus:outline-none focus:ring-2 focus:ring-black/30
                    
                  "
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                }}
              >
                {t(loading ? "Processing..." : "Get Started")}
              </button>

              {/* Divider */}
              <div data-in className="mt-6 h-px w-full bg-[#f5f5f5]" />

              {/* Features list */}
              <ul className="mt-6 space-y-3 text-gray-800 w-full max-w-[34ch]">
                <li data-in className="flex items-start gap-2 ">
                  <span className="translate-y-[2px]">✓</span>
                  <p className="text-gray-800">
                    {plan === "Starter" && t("Basic AI Tools")}
                    {plan === "Pro" && t("Advanced AI Tools")}
                    {plan === "Enterprise" && t("Fully Customized AI Solutions")}
                  </p>
                </li>
                <li data-in className="flex items-start gap-2 ">
                  <span className="translate-y-[2px]">✓</span>
                  <p className="text-gray-800">
                    {plan === "Starter" && t("Limited Automation Features")}
                    {plan === "Pro" && t("Customizable Workflows")}
                    {plan === "Enterprise" && t("Unlimited Integrations")}
                  </p>
                </li>
                <li data-in className="flex items-start gap-2 ">
                  <span className="translate-y-[2px]">✓</span>
                  <p className="text-gray-800">
                    {plan === "Starter" && t("Real‑Time Reporting")}
                    {plan === "Pro" && t("AI‑Powered Analytics")}
                    {plan === "Enterprise" && t("Advanced Reporting & Insights")}
                  </p>
                </li>
                <li data-in className="flex items-start gap-2 ">
                  <span className="translate-y-[2px]">✓</span>
                  <p className="text-gray-800">
                    {plan === "Starter" && t("Basic Chatbot Integration")}
                    {plan === "Pro" && t("Premium Chatbot Features")}
                    {plan === "Enterprise" && t("Scalable AI Solutions")}
                  </p>
                </li>
                <li data-in className="flex items-start gap-2 ">
                  <span className="translate-y-[2px]">✓</span>
                  <p className="text-gray-800">
                    {plan === "Pro" && t("Cross‑Platform Integrations")}
                    {plan === "Enterprise" && t("Team Collaboration Features")}
                  </p>
                </li>
                {plan === "Enterprise" && (
                  <li data-in className="flex items-start gap-2 ">
                    <span className="translate-y-[2px]">✓</span>
                    <p className="text-gray-800">{t('Priority Feature Access')}</p>
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Subscription Info */}
      <div className="mt-10">
        <button
          onClick={checkMySub}
          disabled={!isSignedIn || loading}
          className="flex-shrink-0 px-4 py-2 rounded-xl text-black font-bold 
                     disabled:bg-[#f5f5f5] disabled:cursor-not-allowed cursor-pointer sm:px-6"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          }}
        >
          {t(loading ? "Loading..." : "Check My Subscription")}
        </button>

        {subInfo && (
          <div
            className="mt-5 space-y-1.5 rounded-xl "
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            }}
          >
            <p className="px-2 ">
              <span className="font-bold">{('Status:')}</span>{' '}
              {subInfo.active ? ('Active') : ('Inactive')}
            </p>

            {subInfo.active && (
              <>
                <p className="px-2">
                  <span className="font-bold">{('Plan:')}</span>{' '}
                  {subInfo.plan}
                </p>

                <p className="px-2">
                  <span className="font-bold">{('Days left:')}</span>{' '}
                  {subInfo.daysLeft}
                </p>

                <p className="px-2">
                  <span className="font-bold">{('Renews on:')}</span>{' '}
                  {new Date(subInfo.currentPeriodEnd).toDateString()}
                </p>

                <button
                  onClick={manageBilling}
                  disabled={loading}
                  className=" px-3 py-1 rounded mt-2"
                >
                  {t('Manage Billing')}
                </button>
              </>
            )}
          </div>
        )}


      </div>
    </div>
  );
}
