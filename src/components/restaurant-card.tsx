import { Star, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export interface Restaurant {
    id: string;
    name: string;
    rating: number;
    user_ratings_total: number;
    vicinity: string;
    photos?: {
        photo_reference: string;
        height: number;
        width: number;
    }[];
    opening_hours?: {
        open_now: boolean;
    };
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
}

interface RestaurantCardProps {
    restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
    const photoUrl =
        restaurant.photos && restaurant.photos.length > 0
            ? `/api/photo?name=${restaurant.photos[0].photo_reference}`
            : null;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 w-full bg-gray-200">
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={restaurant.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <span className="text-sm">No Image Available</span>
                    </div>
                )}
            </div>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                    <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-bold text-yellow-700">
                            {restaurant.rating}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                            ({restaurant.user_ratings_total})
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-start text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1 mt-1 shrink-0" />
                    <span className="text-sm">{restaurant.vicinity}</span>
                </div>
                {restaurant.opening_hours && (
                    <div className="mt-2">
                        <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${restaurant.opening_hours.open_now
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {restaurant.opening_hours.open_now ? "Open Now" : "Closed"}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
