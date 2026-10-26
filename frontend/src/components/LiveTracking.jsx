
import React, { useState, useEffect } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap
} from 'react-leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default Leaflet marker icons in Vite
const defaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// Automatically move the map when location changes
const MapUpdater = ({ position }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(
                [position.lat, position.lng],
                map.getZoom(),
                { animate: true, duration: 0.5 }
            );
        }
    }, [position, map]);

    return null;
};

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(null);
    const [locationError, setLocationError] = useState('');

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.');
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                setCurrentPosition({
                    lat: latitude,
                    lng: longitude
                });

                setLocationError('');
                console.log('Position updated:', latitude, longitude);
            },
            (error) => {
                console.error('Geolocation error:', error.message);
                setLocationError(error.message);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 3000,
                timeout: 15000
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    // Show a loading state until the first location is available
    if (!currentPosition) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">
                    {locationError || 'Fetching your location...'}
                </p>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <MapContainer
                center={[currentPosition.lat, currentPosition.lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater position={currentPosition} />

                <Marker
                    position={[
                        currentPosition.lat,
                        currentPosition.lng
                    ]}
                >
                    <Popup>
                        Your current location
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default LiveTracking;
