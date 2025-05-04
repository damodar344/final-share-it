"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { saveListing } from "@/lib/actions";
import { LoadingButton } from "@/components/ui/LoadingButton";

export default function ListingForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    accommodationType: "",
    privateBathroom: "",
    rent: "",
    utilityIncluded: false,
    amenities: [] as string[],
    distanceFromCampus: "",
  });

  const handleAccommodationTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, accommodationType: value }));
  };

  const handleBathroomTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, privateBathroom: value }));
  };

  const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, rent: e.target.value }));
  };

  const handleUtilityChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, utilityIncluded: checked }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => {
      const amenities = [...prev.amenities];
      if (amenities.includes(amenity)) {
        return { ...prev, amenities: amenities.filter((a) => a !== amenity) };
      } else {
        return { ...prev, amenities: [...amenities, amenity] };
      }
    });
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, distanceFromCampus: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setLoading(true);

      // Validate required fields
      if (!formData.accommodationType) {
        setError("Please select accommodation type");
        return;
      }

      if (!formData.privateBathroom) {
        setError("Please select bathroom type");
        return;
      }

      if (!formData.rent) {
        setError("Please enter rent amount");
        return;
      }

      await saveListing(formData);
      router.push("/preferences");
    } catch (error: any) {
      console.error("Failed to save listing:", error);
      if (error.message && error.message.includes("validation failed")) {
        setError("Please check your inputs and try again");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-60">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-600 rounded-lg p-8 shadow-lg text-white">
            <h1 className="text-2xl font-bold text-center mb-6">
              Tell us about the space you're listing
            </h1>

            <div className="space-y-6">
              <div>
                <p className="mb-2">Accommodation Type</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => handleAccommodationTypeChange("Single room")}
                    className={`flex-1 transition-all duration-200 ${
                      formData.accommodationType === "Single room"
                        ? "bg-green-500 text-white font-semibold shadow-md"
                        : "bg-yellow-400/80 text-gray-800 hover:bg-yellow-400"
                    }`}
                  >
                    Single room
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleAccommodationTypeChange("Entire Unit")}
                    className={`flex-1 transition-all duration-200 ${
                      formData.accommodationType === "Entire Unit"
                        ? "bg-green-500 text-white font-semibold shadow-md"
                        : "bg-yellow-400/80 text-gray-800 hover:bg-yellow-400"
                    }`}
                  >
                    Entire Unit
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-2">Private Bathroom</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => handleBathroomTypeChange("Yes")}
                    className={`flex-1 transition-all duration-200 ${
                      formData.privateBathroom === "Yes"
                        ? "bg-green-500 text-white font-semibold shadow-md"
                        : "bg-yellow-400/80 text-gray-800 hover:bg-yellow-400"
                    }`}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleBathroomTypeChange("No, Shared")}
                    className={`flex-1 transition-all duration-200 ${
                      formData.privateBathroom === "No, Shared"
                        ? "bg-green-500 text-white font-semibold shadow-md"
                        : "bg-yellow-400/80 text-gray-800 hover:bg-yellow-400"
                    }`}
                  >
                    No, Shared
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-2">Rent</p>
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.rent}
                    onChange={handleRentChange}
                    className="bg-yellow-400/80 text-gray-800 pr-24 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-600">
                    per month
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="utility"
                  checked={formData.utilityIncluded}
                  onCheckedChange={handleUtilityChange}
                  className="bg-white data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                <label
                  htmlFor="utility"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Utility Included
                </label>
              </div>

              <div>
                <p className="mb-2">
                  Amenities Included{" "}
                  <span className="text-sm">(Select all that apply)</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Parking Space",
                    "In-Unit Laundry",
                    "Wi-Fi",
                    "Furnished",
                    "Dishwasher",
                    "Public Transportation",
                  ].map((amenity) => (
                    <Button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`transition-all duration-200 ${
                        formData.amenities.includes(amenity)
                          ? "bg-green-500 text-white font-semibold shadow-md"
                          : "bg-yellow-400/80 text-gray-800 hover:bg-yellow-400"
                      }`}
                    >
                      {amenity}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2">Distance from Campus</p>
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.distanceFromCampus}
                    onChange={handleDistanceChange}
                    className="bg-yellow-400/80 text-gray-800 pr-20 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-600">
                    in miles
                  </div>
                </div>
              </div>

              <LoadingButton
                onClick={handleSubmit}
                loading={loading}
                loadingText="Saving listing..."
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors duration-200"
              >
                Next
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
