import React, { useEffect, useState } from "react";

const NearbyHospitalsPage = () => {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    // Check if geolocation available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log("User coords:", position.coords);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  }, []);

  return (
    <div className="w-full h-screen p-4">
      <iframe
        src="https://nearby-hospitals-lac.vercel.app/"
        className="w-full h-full rounded-xl"
        frameBorder="0"
        title="Nearby Hospitals"
        allow="geolocation"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
      {coords && (
        <p className="mt-2 text-sm text-gray-500">
          Your location: {coords.lat}, {coords.lng}
        </p>
      )}
    </div>
  );
};

export default NearbyHospitalsPage;
