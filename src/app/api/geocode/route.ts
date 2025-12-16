import { NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
        return NextResponse.json(
            { error: "Address is required" },
            { status: 400 }
        );
    }

    if (!GOOGLE_PLACES_API_KEY) {
        return NextResponse.json(
            { error: "Server configuration error: Missing API Key" },
            { status: 500 }
        );
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_PLACES_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "OK") {
            return NextResponse.json(
                { error: data.error_message || "Failed to geocode address" },
                { status: 400 }
            );
        }

        const location = data.results[0].geometry.location;
        return NextResponse.json({ lat: location.lat, lng: location.lng });

    } catch (error: any) {
        console.error("Geocoding error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
