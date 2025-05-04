"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { savePreferences } from "@/lib/actions";
import { LoadingButton } from "@/components/ui/LoadingButton";

export default function PreferencesForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    preferences: [] as string[],
    guestPreference: 0,
    additionalPreference: "",
  });

  const handlePreferenceToggle = (preference: string) => {
    setFormData((prev) => {
      const preferences = [...prev.preferences];
      if (preferences.includes(preference)) {
        return {
          ...prev,
          preferences: preferences.filter((p) => p !== preference),
        };
      } else {
        return { ...prev, preferences: [...preferences, preference] };
      }
    });
  };

  const handleGuestPreferenceChange = (value: number) => {
    setFormData((prev) => ({ ...prev, guestPreference: value }));
  };

  const handleAdditionalPreferenceChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, additionalPreference: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setLoading(true);

      // Validate required fields
      if (formData.preferences.length === 0) {
        setError("Please select at least one preference");
        return;
      }

      if (!formData.guestPreference) {
        setError("Please select guest preference");
        return;
      }

      await savePreferences(formData);
      router.push("/images");
    } catch (error: any) {
      console.error("Failed to save preferences:", error);
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
              Roommate Preference
            </h1>

            <div className="space-y-6">
              <div>
                <p className="mb-2">I prefer a roommate who:</p>
                <div className="space-y-2">
                  {[
                    "is a student",
                    "is from the same academic Level",
                    "has the same gender",
                    "has the same prefered study schedule",
                    "has the same cleanliness preference",
                    "doesn't have pets",
                    "is in the same age group",
                  ].map((preference) => (
                    <Button
                      key={preference}
                      type="button"
                      onClick={() => handlePreferenceToggle(preference)}
                      className={`w-full text-left justify-start transition-all duration-200 ${
                        formData.preferences.includes(preference)
                          ? "bg-green-500 text-white font-semibold shadow-md"
                          : "bg-yellow-400/80 text-gray-800 hover:bg-yellow-400"
                      }`}
                    >
                      {preference}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2">Are you okay with guests often</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      onClick={() => handleGuestPreferenceChange(value)}
                      className={`w-12 h-12 transition-all duration-200 ${
                        formData.guestPreference === value
                          ? "bg-green-500 text-white font-semibold shadow-md"
                          : "bg-yellow-400/80 text-gray-800 hover:bg-yellow-400"
                      }`}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
                <div className="flex text-sm mt-1">
                  <span className="w-12 text-center">No</span>
                  <span className="w-12"></span>
                  <span className="w-12 text-center">Sometimes</span>
                  <span className="w-16"></span>
                  <span className="w-20 text-center">Yes</span>
                </div>
              </div>

              <div>
                <p className="mb-2">Additional Preference</p>
                <Textarea
                  placeholder="Type here"
                  value={formData.additionalPreference}
                  onChange={handleAdditionalPreferenceChange}
                  className="bg-yellow-400/80 text-gray-800 h-24 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <LoadingButton
                onClick={handleSubmit}
                loading={loading}
                loadingText="Saving preferences..."
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
