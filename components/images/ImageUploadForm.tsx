"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/actions";
import { LoadingButton } from "@/components/ui/LoadingButton";
import Image from "next/image";

export default function ImageUploadForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    try {
      setError(null);
      setLoading(true);

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          setError("Please upload only image files");
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadImage(formData);
        if (result.success) {
          setUploadedImages((prev) => [...prev, result.url]);
        }
      }

      if (uploadedImages.length > 0) {
        router.push("/contact");
      }
    } catch (error: any) {
      console.error("Failed to upload images:", error);
      setError("Failed to upload images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/contact");
  };

  return (
    <div className="min-h-screen bg-gray-60">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-600 rounded-lg p-8 shadow-lg text-white">
            <h1 className="text-2xl font-bold text-center mb-6">
              Let your space speak for itself!
            </h1>
            <p className="text-center mb-8">
              Add some pictures of your listing to attract the right roommate
            </p>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
                dragActive
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-gray-400 hover:border-yellow-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-4 rounded-md cursor-pointer"
                >
                  Choose files
                </label>
              </div>
              <p className="text-gray-300">
                or drag and drop your images here
              </p>
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                {uploadedImages.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`Uploaded image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <p className="text-red-400 text-center mb-4">{error}</p>
            )}

            <div className="flex justify-between">
              <Button
                onClick={handleSkip}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Skip for now
              </Button>
              <LoadingButton
                onClick={() => router.push("/contact")}
                loading={loading}
                loadingText="Uploading..."
                disabled={uploadedImages.length === 0}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold"
              >
                Continue
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 