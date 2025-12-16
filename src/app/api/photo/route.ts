import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const key = process.env.GOOGLE_PLACES_API_KEY;

    if (!name || !key) {
        return new NextResponse("Missing name or API key", { status: 400 });
    }

    try {
        // Construct the URL for the Places API Media endpoint
        // Format: https://places.googleapis.com/v1/{name}/media?key=...
        const url = `https://places.googleapis.com/v1/${name}/media?key=${key}&maxHeightPx=400&maxWidthPx=400`;

        const response = await fetch(url);

        if (!response.ok) {
            return new NextResponse("Failed to fetch image from Google", { status: response.status });
        }

        // Stream the image back to the client
        return new NextResponse(response.body, {
            headers: {
                "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
                "Cache-Control": "public, max-age=3600, s-maxage=3600",
            },
        });
    } catch (error) {
        console.error("Error fetching image:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
