"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { saveProfile } from "@/lib/actions";
import { LoadingButton } from "@/components/ui/LoadingButton";

export default function ProfileForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userType: "",
    academicLevel: "",
    gender: "",
    ageGroup: "",
    studySchedule: "",
    socializingPreference: "",
    tidiness: 0,
    drinkingPreference: "",
    smokingPreference: "",
    hobbies: [] as string[],
  });

  const handleUserTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      userType: value,
      // Reset academic level when switching to University Staff
      academicLevel:
        value === "University Staff" ? "Undergraduate" : prev.academicLevel,
      // Set default values for required fields when switching to University Staff
      socializingPreference:
        value === "University Staff"
          ? "A mixture of both"
          : prev.socializingPreference,
      drinkingPreference:
        value === "University Staff" ? "No" : prev.drinkingPreference,
      smokingPreference:
        value === "University Staff" ? "No" : prev.smokingPreference,
    }));
  };

  const handleAcademicLevelChange = (value: string) => {
    setFormData((prev) => ({ ...prev, academicLevel: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleAgeGroupChange = (value: string) => {
    setFormData((prev) => ({ ...prev, ageGroup: value }));
  };

  const handleStudyScheduleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, studySchedule: value }));
  };

  const handleSocializingChange = (value: string) => {
    setFormData((prev) => ({ ...prev, socializingPreference: value }));
  };

  const handleTidinessChange = (value: number) => {
    setFormData((prev) => ({ ...prev, tidiness: value }));
  };

  const handleDrinkingChange = (value: string) => {
    setFormData((prev) => ({ ...prev, drinkingPreference: value }));
  };

  const handleSmokingChange = (value: string) => {
    setFormData((prev) => ({ ...prev, smokingPreference: value }));
  };

  const handleHobbyToggle = (hobby: string) => {
    setFormData((prev) => {
      const hobbies = [...prev.hobbies];
      if (hobbies.includes(hobby)) {
        return { ...prev, hobbies: hobbies.filter((h) => h !== hobby) };
      } else {
        return { ...prev, hobbies: [...hobbies, hobby] };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setLoading(true);

      // Validate required fields
      if (!formData.userType) {
        setError("Please select your user type");
        return;
      }

      if (!formData.gender) {
        setError("Please select your gender");
        return;
      }

      if (!formData.ageGroup) {
        setError("Please select your age group");
        return;
      }

      // For students, validate academic level
      if (formData.userType === "Student" && !formData.academicLevel) {
        setError("Please select your academic level");
        return;
      }

      // Map form values to match the enum values in the model
      const mappedFormData = {
        ...formData,
        studySchedule:
          formData.studySchedule === "Morning"
            ? "Morning Person"
            : formData.studySchedule === "Evening"
            ? "Night Owl"
            : formData.studySchedule === "Afternoon"
            ? "Flexible"
            : formData.studySchedule,
        socializingPreference:
          formData.socializingPreference === "Introvert"
            ? "I prefer my privacy"
            : formData.socializingPreference === "Extrovert"
            ? "Enjoys hanging out"
            : formData.socializingPreference === "Ambivert"
            ? "A mixture of both"
            : formData.socializingPreference,
        drinkingPreference:
          formData.drinkingPreference === "Never"
            ? "No"
            : formData.drinkingPreference === "Often"
            ? "Yes"
            : formData.drinkingPreference === "Sometimes"
            ? "Occasionally"
            : formData.drinkingPreference,
        smokingPreference:
          formData.smokingPreference === "Never"
            ? "No"
            : formData.smokingPreference === "Often"
            ? "Yes"
            : formData.smokingPreference === "Sometimes"
            ? "Occasionally"
            : formData.smokingPreference,
      };

      await saveProfile(mappedFormData);
      router.push("/listing");
    } catch (error: any) {
      console.error("Failed to save profile:", error);
      if (error.message && error.message.includes("validation failed")) {
        setError("Please check your inputs and try again");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const buttonBaseClasses = "transition-all duration-200";
  const selectedButtonClasses =
    "bg-green-500 text-white font-semibold shadow-md";
  const unselectedButtonClasses =
    "bg-yellow-400/80 text-gray-800 hover:bg-yellow-400";

  return (
    <div className="min-h-screen bg-gray-60">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-600 rounded-lg p-8 shadow-lg text-white mb-8">
            <h1 className="text-2xl font-bold text-center mb-6">
              Now Tell us about Yourself
            </h1>

            <div className="space-y-6">
              <div>
                <p className="mb-2">I am a</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => handleUserTypeChange("Student")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.userType === "Student"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Student
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleUserTypeChange("University Staff")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.userType === "University Staff"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    University Staff
                  </Button>
                </div>
              </div>

              {formData.userType === "Student" && (
                <div>
                  <p className="mb-2">
                    If student, please select your academic level
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => handleAcademicLevelChange("Undergraduate")}
                      className={`flex-1 ${buttonBaseClasses} ${
                        formData.academicLevel === "Undergraduate"
                          ? selectedButtonClasses
                          : unselectedButtonClasses
                      }`}
                    >
                      Undergraduate
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleAcademicLevelChange("Graduate")}
                      className={`flex-1 ${buttonBaseClasses} ${
                        formData.academicLevel === "Graduate"
                          ? selectedButtonClasses
                          : unselectedButtonClasses
                      }`}
                    >
                      Graduate
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleAcademicLevelChange("PhD")}
                      className={`flex-1 ${buttonBaseClasses} ${
                        formData.academicLevel === "PhD"
                          ? selectedButtonClasses
                          : unselectedButtonClasses
                      }`}
                    >
                      PhD
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <p className="mb-2">Gender</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => handleGenderChange("Female")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.gender === "Female"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Female
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleGenderChange("Male")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.gender === "Male"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Male
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleGenderChange("Non-Binary")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.gender === "Non-Binary"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Non-Binary
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-2">Age Group</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => handleAgeGroupChange("18-21")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.ageGroup === "18-21"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    18-21
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleAgeGroupChange("22-25")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.ageGroup === "22-25"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    22-25
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleAgeGroupChange("25+")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.ageGroup === "25+"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    25+
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-600 rounded-lg p-8 shadow-lg text-white">
            <h1 className="text-2xl font-bold text-center mb-6">
              Interests & Lifestyle
            </h1>

            <div className="space-y-6">
              <div>
                <p className="mb-2">What's your study schedule Like</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => handleStudyScheduleChange("Morning")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.studySchedule === "Morning"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Morning
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleStudyScheduleChange("Afternoon")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.studySchedule === "Afternoon"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Afternoon
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleStudyScheduleChange("Evening")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.studySchedule === "Evening"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Evening
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-2">How do you prefer to socialize?</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => handleSocializingChange("Introvert")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.socializingPreference === "Introvert"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Introvert
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleSocializingChange("Ambivert")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.socializingPreference === "Ambivert"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Ambivert
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleSocializingChange("Extrovert")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.socializingPreference === "Extrovert"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Extrovert
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-2">How tidy are you?</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      onClick={() => handleTidinessChange(value)}
                      className={`w-full h-12 ${buttonBaseClasses} ${
                        formData.tidiness === value
                          ? selectedButtonClasses
                          : unselectedButtonClasses
                      }`}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-between text-sm mt-1 ml-3">
                  <span>Messy</span>
                  <span>Neutral</span>
                  <span>Very Tidy</span>
                </div>
              </div>

              <div>
                <p className="mb-2">Drinking Preference</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => handleDrinkingChange("Never")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.drinkingPreference === "Never"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Never
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleDrinkingChange("Sometimes")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.drinkingPreference === "Sometimes"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Sometimes
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleDrinkingChange("Often")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.drinkingPreference === "Often"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Often
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-2">Smoking Preference</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => handleSmokingChange("Never")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.smokingPreference === "Never"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Never
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleSmokingChange("Sometimes")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.smokingPreference === "Sometimes"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Sometimes
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleSmokingChange("Often")}
                    className={`flex-1 ${buttonBaseClasses} ${
                      formData.smokingPreference === "Often"
                        ? selectedButtonClasses
                        : unselectedButtonClasses
                    }`}
                  >
                    Often
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-2">
                  Hobbies{" "}
                  <span className="text-sm">(Select all that apply)</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Reading",
                    "Gaming",
                    "Sports",
                    "Music",
                    "Art",
                    "Cooking",
                    "Travel",
                    "Movies",
                  ].map((hobby) => (
                    <Button
                      key={hobby}
                      type="button"
                      onClick={() => handleHobbyToggle(hobby)}
                      className={`${buttonBaseClasses} ${
                        formData.hobbies.includes(hobby)
                          ? selectedButtonClasses
                          : unselectedButtonClasses
                      }`}
                    >
                      {hobby}
                    </Button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500 text-white rounded-md text-center">
                  {error}
                </div>
              )}

              <LoadingButton
                onClick={handleSubmit}
                loading={loading}
                loadingText="Saving profile..."
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold"
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
