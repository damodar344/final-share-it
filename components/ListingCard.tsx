"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

interface ListingCardProps {
  listing: {
    _id: string;
    id: string;
    images: string[];
    rent: number;
    accommodationType: string;
    privateBathroom: string;
    distanceFromCampus: number;
    utilityIncluded: boolean;
    amenities: string[];
    userId: string;
    user: {
      preferredContact: string;
      email?: string;
      phone?: string;
    };
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isOwner = session?.user?.id === listing.userId;
  
  const handleDelete = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/listings/${listing._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        toast.success('Listing deleted successfully');
        router.refresh();
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Get the contact value based on preferred contact method
  const getContactValue = () => {
    if (!listing.user) return null;
    
    if (listing.user.preferredContact === "Email" && listing.user.email) {
      return listing.user.email;
    } else if (listing.user.preferredContact === "Phone No." && listing.user.phone) {
      return listing.user.phone;
    }
    
    if (listing.user.preferredContact?.toLowerCase().includes("email") && listing.user.email) {
      return listing.user.email;
    } else if (
      (listing.user.preferredContact?.toLowerCase().includes("phone") || 
       listing.user.preferredContact?.toLowerCase().includes("no.")) && 
      listing.user.phone
    ) {
      return listing.user.phone;
    }
    
    return listing.user.email || listing.user.phone || null;
  };

  const contactValue = getContactValue();
  const isEmail = listing.user?.preferredContact?.toLowerCase().includes("email");

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative h-48 w-full">
        {listing.images.length > 0 ? (
          <Image
            src={listing.images[0]}
            alt={`${listing.accommodationType} preview`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            No image available
          </div>
        )}
        {isOwner && (
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-full bg-white/80 hover:bg-white"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDeleteConfirm(true);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete Listing
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Link href={`/listing/${listing.id}`} className="flex-grow">
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold">
              ${listing.rent}
              <span className="text-sm font-normal text-gray-600 ml-1">
                {listing.utilityIncluded ? "(utilities included)" : ""}
              </span>
            </h3>
            <span className="text-sm text-gray-600">
              {listing.distanceFromCampus} miles from campus
            </span>
          </div>
          <div className="space-y-1 mb-2">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">Accommodation Type:</span>
              <span className="text-sm text-gray-600">{listing.accommodationType}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">Private Bathroom:</span>
              <span className="text-sm text-gray-600">{listing.privateBathroom}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {listing.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-amber-800 px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="text-xs text-gray-600">
                +{listing.amenities.length - 3} more
              </span>
            )}
          </div>
          
          {/* Contact information at the bottom */}
          {contactValue && (
            <div className="mt-auto pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                {isEmail ? (
                  <Mail className="w-4 h-4 text-amber-500" />
                ) : (
                  <Phone className="w-4 h-4 text-amber-500" />
                )}
                <span className="truncate max-w-[200px]">{contactValue}</span>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Listing</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 