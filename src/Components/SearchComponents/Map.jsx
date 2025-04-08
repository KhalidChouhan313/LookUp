import React, { useState, useEffect } from "react";
import leafletImage from "leaflet-image";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { setLocation } from "../../Store/searchReducer";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

// Fix for leaflet marker icon URL
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapEvent = ({ initialLatLng }) => {
  const [markerPosition, setMarkerPosition] = useState(initialLatLng);
  const [radius, setRadius] = useState(null);
  const dispatch = useDispatch();

  useMapEvent("click", (e) => {
    const { lat, lng } = e.latlng;
    setMarkerPosition([lat, lng]);

    const initialPoint = L.latLng(initialLatLng);
    const SetPoint = L.latLng(lat, lng);
    const distance = initialPoint.distanceTo(SetPoint);
    setRadius(distance);

    const map = e.target;

    if (map._loaded) {
      leafletImage(map, (err, canvas) => {
        if (err) {
          toast.error("Error capturing map image");
          return;
        }
        const screenShot = canvas.toDataURL();
        dispatch(
          setLocation({
            lat,
            lng,
            radius: distance,
            screenShot: screenShot,
          })
        );
      });
    } else {
      toast.error("Map is not fully loaded yet.");
    }

    // Update location state
    dispatch(
      setLocation({
        lat,
        lng,
        radius: distance,
      })
    );
  });

  return (
    <Marker position={markerPosition}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
};

function MapComponent() {
  const [location, setLocationData] = useState({ lat: 24.8607, lng: 67.0011 });

  useEffect(() => {
    const infoApiKey = import.meta.env.VITE_IPINFO_KEY;
    if (!infoApiKey) {
      toast.error("IPInfo API key is not defined");
      return;
    }

    fetch(`https://ipinfo.io?token=${infoApiKey}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("IPInfo Location Data:", data);
        const [lat, lng] = data.loc.split(",");
        setLocationData({
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        });
      })
      .catch((err) => {
        console.error("Error fetching location from IPInfo:", err);
        toast.error("Error fetching location");
      });
  }, []);

  return (
    <div style={{ height: "90%", width: "95%", borderRadius: "10px" }}>
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvent initialLatLng={[location.lat, location.lng]} />
      </MapContainer>
    </div>
  );
}

export default MapComponent;
