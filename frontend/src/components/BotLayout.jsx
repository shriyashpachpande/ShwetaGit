// // src/components/BotLayout.jsx
// import React from "react";
// import AiRoute from "./AiRoute";

// const BotLayout = ({ children }) => {
//   return (
//     <div className="flex flex-col bg-[#f5f5f5] md:flex-row min-h-screen p-4 gap-6">
//       {/* Left Sidebar */}
//       <div className="w-full md:w-1/3">
//         <AiRoute />
//       </div>

//       {/* Right Content */}
//       <div className="w-full md:w-2/3 bg-[#f5f5f5] shadow-md rounded-lg p-4">
//         {children}
//       </div>
//     </div>
//   );
// };

// export default BotLayout;





// src/components/BotLayout.jsx
import React from "react";
import AiRoute from "./AiRoute";

const BotLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f5f5f5] p-4 gap-6">
      
      {/* Left Sidebar (Y-axis center on desktop) */}
      <div className="w-full md:w-1/3 flex justify-center md:justify-end items-center">
        <AiRoute />
      </div>

      {/* Right Content */}
      <div className="w-full md:w-2/3 bg-[#f5f5f5] shadow-md rounded-lg p-4">
        {children}
      </div>
    </div>
  );
};

export default BotLayout;
