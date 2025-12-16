import { NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Mock data for when API key is missing
const MOCK_RESTAURANTS = [
    {
        id: "mock-1",
        name: "The Golden Spoon",
        rating: 4.8,
        user_ratings_total: 124,
        vicinity: "123 Main St, Anytown",
        geometry: { location: { lat: 0, lng: 0 } },
        opening_hours: { open_now: true },
        photos: [],
    },
    {
        id: "mock-2",
        name: "Sushi Master",
        rating: 4.6,
        user_ratings_total: 89,
        vicinity: "456 Oak Ave, Anytown",
        geometry: { location: { lat: 0, lng: 0 } },
        opening_hours: { open_now: false },
        photos: [],
    },
    {
        id: "mock-3",
        name: "Burger King (But Better)",
        rating: 4.9,
        user_ratings_total: 2300,
        vicinity: "789 Pine Ln, Anytown",
        geometry: { location: { lat: 0, lng: 0 } },
        opening_hours: { open_now: true },
        photos: [],
    },
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const radiusMiles = parseFloat(searchParams.get("radius") || "1");

    if (!lat || !lng) {
        return NextResponse.json(
            { error: "Latitude and Longitude are required" },
            { status: 400 }
        );
    }

    // If no API key, return mock data
    if (!GOOGLE_PLACES_API_KEY) {
        console.warn("No Google Places API Key found. Returning mock data.");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return NextResponse.json({ results: MOCK_RESTAURANTS, isMock: true });
    }

    try {
        // Use Text Search (New API) which supports minRating filter
        const url = "https://places.googleapis.com/v1/places:searchText";

        // Calculate bounding box based on radius
        // 1 mile is approx 1609.34 meters
        const radiusMeters = radiusMiles * 1609.34;

        // 1 degree latitude is approx 111,000 meters
        const latDelta = radiusMeters / 111000;
        // 1 degree longitude is approx 111,000 * cos(lat) meters
        const lngDelta = radiusMeters / (111000 * Math.cos(lat * (Math.PI / 180)));

        const south = lat - latDelta;
        const north = lat + latDelta;
        const west = lng - lngDelta;
        const east = lng + lngDelta;

        const requestBody = {
            textQuery: "restaurant",
            minRating: 4.5, // Server-side filtering!
            maxResultCount: 20,
            locationRestriction: {
                rectangle: {
                    low: { latitude: south, longitude: west },
                    high: { latitude: north, longitude: east },
                },
            },
            openNow: false, // Optional: set to true if user only wants open places
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
                "X-Goog-FieldMask": "places.id,places.displayName,places.rating,places.userRatingCount,places.formattedAddress,places.location,places.regularOpeningHours,places.photos",
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to fetch from Google Places API");
        }

        const places = data.places || [];

        // Map new API format to the shape our frontend expects
        const results = places.map((place: any) => ({
            id: place.id,
            name: place.displayName?.text || "Unknown",
            rating: place.rating,
            user_ratings_total: place.userRatingCount,
            vicinity: place.formattedAddress,
            geometry: {
                location: {
                    lat: place.location.latitude,
                    lng: place.location.longitude,
                },
            },
            opening_hours: {
                open_now: place.regularOpeningHours?.openNow || false,
            },
            photos: place.photos ? place.photos.map((p: any) => ({
                photo_reference: p.name,
                height: p.heightPx,
                width: p.widthPx
            })) : [],
        }));

        // Sort by rating (highest first)
        results.sort((a: any, b: any) => b.rating - a.rating);

        return NextResponse.json({ results, isMock: false });
    } catch (error: any) {
        console.error("Error fetching restaurants:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
