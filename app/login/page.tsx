"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-600 rounded-lg p-8 shadow-lg text-white">
            <h1 className="text-2xl font-bold text-center">
              Sign in to your account
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-500 text-white rounded-md text-center">
                {error}
              </div>
            )}

            <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
