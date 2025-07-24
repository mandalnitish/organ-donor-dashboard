import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function LeafletMap({ marker, label }) {
  return (
    <MapContainer center={[marker.lat, marker.lng]} zoom={13} scrollWheelZoom={false} style={{ height: "300px", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[marker.lat, marker.lng]} icon={icon}>
        <Popup>{label}</Popup>
      </Marker>
    </MapContainer>
  );
}
