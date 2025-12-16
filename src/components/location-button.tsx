"use client";

import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface LocationButtonProps {
    onLocationFound: (lat: number, lng: number) => void;
    onError: (error: string) => void;
}

export function LocationButton({ onLocationFound, onError }: LocationButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
        if (!navigator.geolocation) {
            onError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLoading(false);
                onLocationFound(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                setLoading(false);
                let errorMessage = "Unable to retrieve your location";
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = "Location permission denied";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMessage = "Location information is unavailable";
                } else if (error.code === error.TIMEOUT) {
                    errorMessage = "The request to get user location timed out";
                }
                onError(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {loading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Locating...</span>
                </>
            ) : (
                <>
                    <MapPin className="w-5 h-5" />
                    <span>Find Restaurants Near Me</span>
                </>
            )}
        </button>
    );
}
