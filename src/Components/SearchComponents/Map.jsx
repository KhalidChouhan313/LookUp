// MapComponent.jsx
import React, { useState } from "react";
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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapEvent = () => {
  const [markerPosition, setMarkerPosition] = useState([24.8607, 67.0011]);
  const [radius, setRadius] = useState(null);
  const dispatch = useDispatch();
  useMapEvent({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      const initialPoint = L.latLng(24.8607, 67.0011);
      const SetPoint = L.latLng(lat, lng);
      const distance = initialPoint.distanceTo(SetPoint);
      setRadius(distance);

      const map = e.target;
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

      dispatch(
        setLocation({
          lat,
          lng,
          radius: distance,
        })
      );
    },
  });
  return (
    <Marker position={markerPosition}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
};

function MapComponent() {
  return (
    <div style={{ height: "90%", width: "95%", borderRadius: "10px" }}>
      <MapContainer
        center={[24.8607, 67.0011]}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvent />
      </MapContainer>
    </div>
  );
}

export default MapComponent;
