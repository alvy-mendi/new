"use client";

import { useState } from "react";
import { LocationButton } from "@/components/location-button";
import { RestaurantCard, Restaurant } from "@/components/restaurant-card";
import { UtensilsCrossed } from "lucide-react";

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [isMock, setIsMock] = useState(false);

  const [radius, setRadius] = useState(1);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const fetchRestaurants = async (lat: number, lng: number, r: number) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    setRestaurants([]);

    try {
      const response = await fetch(`/api/restaurants?lat=${lat}&lng=${lng}&radius=${r}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch restaurants");
      }

      setRestaurants(data.results);
      if (data.isMock) {
        setIsMock(true);
      } else {
        setIsMock(false);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationFound = (lat: number, lng: number) => {
    setUserLocation({ lat, lng });
    fetchRestaurants(lat, lng, radius);
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseInt(e.target.value);
    setRadius(newRadius);
    if (userLocation) {
      fetchRestaurants(userLocation.lat, userLocation.lng, newRadius);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-blue-600 flex items-center justify-center rounded-full bg-blue-100 mb-4">
            <UtensilsCrossed className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-2">
            Gourmet Finder
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find highly-rated restaurants (4.5+) within {radius} mile{radius > 1 ? 's' : ''} of your current location.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 py-6">
          <div className="w-full max-w-xs">
            <label htmlFor="radius-range" className="block mb-2 text-sm font-medium text-gray-900">
              Search Radius: {radius} mile{radius > 1 ? 's' : ''}
            </label>
            <input
              id="radius-range"
              type="range"
              min="1"
              max="5"
              value={radius}
              onChange={handleRadiusChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 mi</span>
              <span>5 mi</span>
            </div>
          </div>

          <LocationButton
            onLocationFound={handleLocationFound}
            onError={(msg) => setError(msg)}
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isMock && searched && !loading && !error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Demo Mode:</strong> Showing mock data because no API key was provided.
                </p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        )}

        {!loading && searched && restaurants.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No restaurants found nearby with a 4.5+ rating. Tough crowd!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </main>
  );
}
