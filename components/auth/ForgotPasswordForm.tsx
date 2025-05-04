"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const TOWSON_EMAIL_DOMAIN = "@students.towson.edu";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const validateEmail = (email: string) => {
  //   return email.toLowerCase().endsWith(TOWSON_EMAIL_DOMAIN);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    // if (!validateEmail(email)) {
    //   setError(`Only Towson University email addresses (${TOWSON_EMAIL_DOMAIN}) are allowed`);
    //   setIsLoading(false);
    //   return;
    // }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        setError(data.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-gray-600 rounded-lg p-8 shadow-lg text-white">
        {!success ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
            <p className="text-gray-300 mb-6 text-center">
              Enter your Towson University email address and we'll send you instructions to reset your password.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-500 text-white rounded-md text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                   Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-500 text-white border-gray-400"
                  placeholder={`example${TOWSON_EMAIL_DOMAIN}`}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
            <p className="text-gray-300 mb-6">
              If an account exists with this email address, we've sent instructions to reset your password.
            </p>
          </div>
        )}

        <div className="text-center text-sm mt-6">
          <Link href="/login" className="text-white underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 