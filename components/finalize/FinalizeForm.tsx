"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { getUserData, finalizeListing } from "@/lib/actions";
import Image from "next/image";

export default function FinalizeForm() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditListing = () => {
    router.push("/listing");
  };

  const handlePostListing = async () => {
    try {
      await finalizeListing();
      router.push("/success");
    } catch (error) {
      console.error("Failed to finalize listing:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-60 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-60">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">
            Let's finalize your listing
          </h1>
          <p className="text-gray-600 mb-6">
            Please check if everything looks right
          </p>

          <div className="bg-white rounded-lg p-8 shadow-lg">
            {userData?.listing?.images && userData.listing.images.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mb-6">
                {userData.listing.images.map((url: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`Listing image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                  No images
                </div>
              </div>
            )}

            <h2 className="text-xl font-bold mb-2">
              {userData?.firstName} {userData?.lastName}
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-60 p-4 rounded-md">
                <p className="text-gray-600 text-sm">
                  [{userData?.gender || "Female"}] [
                  {userData?.academicLevel || "Grad Student"}] [
                  {userData?.ageGroup || "Age Group"}]
                </p>
                <h3 className="font-semibold mb-1">Listing</h3>
                <p className="text-sm">
                  {userData?.listing?.accommodationType || "Single room"} |{" "}
                  {userData?.listing?.privateBathroom || "Private Bathroom"} | $
                  {userData?.listing?.rent || "800"} |{" "}
                  {userData?.listing?.utilityIncluded ? "Utility included" : ""}
                </p>
                <p className="text-sm">
                  {userData?.listing?.amenities?.join(" | ") ||
                    "Parking Space | In-Unit Laundry | WiFi"}
                </p>
              </div>

              <div className="bg-gray-60 p-4 rounded-md">
                <h3 className="font-semibold mb-1">Interests & Lifestyle</h3>
                <p className="text-sm">
                  [{userData?.studySchedule || "Study schedule"}] [
                  {userData?.socializingPreference || "Socializing Preference"}]
                  [{userData?.hobbies?.join(", ") || "Hobbies"}]
                </p>
                <p className="text-sm">
                  [
                  {userData?.tidiness
                    ? `Tidiness of space: ${userData.tidiness}/5`
                    : "Tidiness of space"}
                  ] [{userData?.drinkingPreference || "Drinking preference"}] [
                  {userData?.smokingPreference || "Smoking preference"}]
                </p>
                <p className="text-sm">other</p>
              </div>

              <div className="bg-gray-60 p-4 rounded-md">
                <h3 className="font-semibold mb-1">Roommate Preference</h3>
                {userData?.preferences?.map((pref: string, index: number) => (
                  <p key={index} className="text-sm">
                    Prefers a roommate who: {pref}
                  </p>
                )) || (
                  <>
                    <p className="text-sm">Prefers a roommate who:</p>
                    <p className="text-sm">Prefers a roommate who:</p>
                  </>
                )}
                <p className="text-sm">
                  Guest preference: {userData?.guestPreference}/5
                </p>
                <p className="text-sm">
                  Additional Preference: {userData?.additionalPreference || "None"}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                onClick={handleEditListing}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold"
              >
                Edit Listing
              </Button>
              <Button
                onClick={handlePostListing}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold"
              >
                Post listing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
