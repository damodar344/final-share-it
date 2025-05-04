"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getListing } from "@/lib/actions";
import Header from "@/components/Header";
import { Mail, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components
function PrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} !flex items-center justify-center absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full cursor-pointer`}
      style={{ ...style, display: "flex" }}
      onClick={onClick}
    >
      <ChevronLeft className="w-6 h-6" />
    </div>
  );
}

function NextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} !flex items-center justify-center absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full cursor-pointer`}
      style={{ ...style, display: "flex" }}
      onClick={onClick}
    >
      <ChevronRight className="w-6 h-6" />
    </div>
  );
}

export default function ListingDetailsPage() {
  const params = useParams();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListing(params.id as string);
        setListing(data);
      } catch (error) {
        setError("Failed to fetch listing details");
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  const getMailtoLink = (email: string) => {
    return `mailto:${email}?subject=Inquiry about your listing on ShareIT&body=Hi ${listing?.user?.firstName},\n\nI'm interested in your listing for ${listing?.accommodationType} at $${listing?.rent}/month.`;
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: listing?.images?.length > 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    className: "relative",
    beforeChange: (_: any, next: number) => setCurrentSlide(next),
  };

  const goToSlide = (index: number) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-60">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600 py-8">
            {error || "Listing not found"}
          </div>
          <div className="text-center">
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Image Gallery */}
          <div className="relative h-96 mb-8 bg-white rounded-lg overflow-hidden">
            <style jsx global>{`
              .slick-prev, .slick-next {
                display: flex !important;
                align-items: center;
                justify-content: center;
                z-index: 10;
              }
              .slick-prev {
                left: 16px !important;
              }
              .slick-next {
                right: 16px !important;
              }
              .slick-prev:before, .slick-next:before {
                display: none;
              }
            `}</style>
            {listing.images.length > 0 ? (
              <>
                <Slider ref={sliderRef} {...sliderSettings}>
                  {listing.images.map((image: string, index: number) => (
                    <div key={index} className="relative h-96">
                      <Image
                        src={image}
                        alt={`Listing image ${index + 1}`}
                        fill
                        className="object-contain bg-white"
                      />
                    </div>
                  ))}
                </Slider>
                {listing.images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {listing.images.map((_: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentSlide
                            ? "bg-yellow-400"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No images available
              </div>
            )}
          </div>

          {/* Listing Details */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  ${listing.rent}
                  <span className="text-lg font-normal text-gray-600 ml-2">
                    {listing.utilityIncluded ? "(utilities included)" : ""}
                  </span>
                </h1>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-gray-700">Accommodation Type:</span>
                    <span className="text-lg text-gray-600">{listing.accommodationType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-gray-700">Private Bathroom:</span>
                    <span className="text-lg text-gray-600">{listing.privateBathroom}</span>
                  </div>
                </div>
              </div>
              <a
                href={getMailtoLink(listing.user.email)}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Contact Host
              </a>
            </div>

            {/* Contact Information */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href={getMailtoLink(listing.user.email)}
                  className="flex items-center gap-2 text-gray-700 hover:text-yellow-600 transition-colors"
                >
                  <Mail className="w-5 h-5 text-gray-600" />
                  <span className="underline">{listing.user.email}</span>
                </a>
                {listing.user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">{listing.user.phone}</span>
                  </div>
                )}
                {listing.user.preferredContact && (
                  <div className="col-span-2">
                    <span className="text-gray-600">
                      Preferred contact method: {listing.user.preferredContact}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((amenity: string, index: number) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-amber-800 px-3 py-1 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Host Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About the Host</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <p className="text-gray-600">
                    {listing.user.firstName} {listing.user.lastName}
                  </p>
                  <p className="text-gray-600">{listing.user.gender}</p>
                  <p className="text-gray-600">{listing.user.academicLevel}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Lifestyle</h3>
                  <p className="text-gray-600">
                    Study Schedule: {listing.user.studySchedule}
                  </p>
                  <p className="text-gray-600">
                    Socializing: {listing.user.socializingPreference}
                  </p>
                  <p className="text-gray-600">
                    Tidiness: {listing.user.tidiness}/5
                  </p>
                  <p className="text-gray-600">
                    Drinking: {listing.user.drinkingPreference}
                  </p>
                  <p className="text-gray-600">
                    Smoking: {listing.user.smokingPreference}
                  </p>
                </div>
              </div>
              {listing.user.hobbies?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Hobbies</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.user.hobbies.map((hobby: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Roommate Preferences */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Roommate Preferences</h2>
              <div className="space-y-2">
                {listing.preferences?.roommate?.map((pref: string, index: number) => (
                  <p key={index} className="text-gray-600">
                    • {pref}
                  </p>
                ))}
                {listing.preferences?.guestPreference && (
                  <p className="text-gray-600">
                    • Guest Preference: {listing.preferences.guestPreference}/5
                  </p>
                )}
                {listing.preferences?.additionalPreference && (
                  <p className="text-gray-600">
                    • Additional: {listing.preferences.additionalPreference}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 