"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-60">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-yellow-300 rounded-lg p-8 shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                {/* Celebration icon/image */}
                <div className="text-4xl">🎉</div>
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-4">
              Woohoo! Your Listing has been posted!
            </h1>

            <Link href="/dashboard" className="text-blue-600 underline">
              view your listing here
            </Link>
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 w-full bg-black text-white p-4 flex justify-between">
        <div>Terms & Support</div>
        <div>Designed by Damodar Dhital</div>
      </footer>
    </div>
  );
}
