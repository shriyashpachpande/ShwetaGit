import React from 'react';

export default function Diagnoscan() {
  return (
    <div className="w-full h-screen bg-[#f5f5f5] flex flex-col items-center justify-center">
  

      <div className="w-full flex-1">
        <iframe
          src="https://dscan.onrender.com/"
          title="Medical Imaging Agent"
          className="w-full h-full"
          style={{ border: 'none' }}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
