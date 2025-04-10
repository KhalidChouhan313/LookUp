import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLocation } from "../../Store/searchReducer";
import { toast } from "react-toastify";

function MapComponent() {
  const dispatch = useDispatch();
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setCoords({ lat: latitude, lng: longitude });

        const screenShotURL = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7Clabel:U%7C${latitude},${longitude}&key=YOUR_API_KEY`;

        dispatch(
          setLocation({
            lat: latitude,
            lng: longitude,
            screenShot: screenShotURL,
          })
        );

        setLocationAllowed(true);
        setLocationDenied(false);
      },
      (error) => {
        console.error("Error getting location", error);
        toast.error("Error getting location. Please enable location services.");
        if (error.code === error.PERMISSION_DENIED) {
          setLocationDenied(true);
        }

        setLocationAllowed(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        if (permissionStatus.state === "granted") {
          requestLocation();
        } else if (permissionStatus.state === "denied") {
          setLocationDenied(true);
        } else {
          requestLocation();
        }

        permissionStatus.onchange = () => {
          if (permissionStatus.state === "granted") {
            requestLocation();
          } else if (permissionStatus.state === "denied") {
            setLocationDenied(true);
          }
        };
      });
  }, [dispatch]);

  return (
    <div>
      {coords.lat && coords.lng ? (
        <iframe
          title="User Location"
          src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
          className="w-full h-[20vh] md:h-[50vh] rounded-lg shadow-md"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      ) : locationDenied ? (
        <div>
          <p>Location access is required to show your position.</p>
          <button
            onClick={requestLocation}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Enable Location
          </button>
        </div>
      ) : (
        <p>Detecting location...</p>
      )}
    </div>
  );
}

export default MapComponent;
