// // src/components/Loading.jsx
// import React from "react";

// export default function Loading() {
//   return (
//     <div className="fixed inset-0 bg-black/20 bg-opacity-10 backdrop-blur-md flex items-center justify-center z-50">
//       <div className="w-16 h-16 border-10 border-[#f5f5f5] border-dotted rounded-full animate-spin"></div>
//     </div>
//   );
// }





// src/components/Loading.jsx
import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-white animate-spin"></div>

        {/* Middle pulsing glow */}
        <div className="absolute w-12 h-12 rounded-full bg-white/20 animate-ping"></div>

        {/* Inner dot */}
        <div className="absolute w-6 h-6 rounded-full bg-white animate-pulse"></div>
      </div>

    </div>
  );
}
