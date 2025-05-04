import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ListingCardProps {
  listing: {
    id: string;
    images: string[];
    accommodationType: string;
    privateBathroom: string;
    rent: string;
    utilityIncluded: boolean;
    amenities: string[];
    distanceFromCampus: string;
    user: {
      firstName: string;
      lastName: string;
      gender: string;
      academicLevel: string;
      studySchedule: string;
    };
    publishedAt: string;
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/listing/${listing.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          {listing.images.length > 0 ? (
            <Image
              src={listing.images[0]}
              alt={`${listing.accommodationType} by ${listing.user.firstName}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">
              ${listing.rent}
              <span className="text-sm font-normal text-gray-600">
                {listing.utilityIncluded ? " (utilities included)" : ""}
              </span>
            </h3>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(listing.publishedAt), { addSuffix: true })}
            </span>
          </div>
          <div className="space-y-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Accommodation Type:</span>
              <span className="text-sm text-gray-600">{listing.accommodationType}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Private Bathroom:</span>
              <span className="text-sm text-gray-600">{listing.privateBathroom}</span>
            </div>
          </div>
          <p className="text-gray-600 mb-2">
            {listing.distanceFromCampus} miles from campus
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="bg-gray-100 text-amber-800 text-xs px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{listing.amenities.length - 3} more
              </span>
            )}
          </div>
          <div className="border-t pt-3">
            <p className="text-sm text-gray-600">
              {listing.user.firstName} {listing.user.lastName} •{" "}
              {listing.user.gender} • {listing.user.academicLevel}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
} 