// src/components/Loading.jsx
import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="w-16 h-16 border-10 border-[#f5f5f5] border-dotted rounded-full animate-spin"></div>
    </div>
  );
}
