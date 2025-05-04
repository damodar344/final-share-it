"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TOWSON_EMAIL_DOMAIN = "@students.towson.edu";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check for error and message in URL params
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const messageParam = searchParams.get("message");

    if (errorParam) {
      // Map NextAuth error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        "CredentialsSignin": "Invalid email or password",
        "Default": "An error occurred during sign in"
      };
      
      setError(errorMessages[errorParam] || errorMessages.Default);
    }

    if (messageParam) {
      setMessage(messageParam);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const validateEmail = (email: string) => {
  //   return email.toLowerCase().endsWith(TOWSON_EMAIL_DOMAIN);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // if (!validateEmail(formData.email)) {
    //   setError(`Only Towson University email addresses (${TOWSON_EMAIL_DOMAIN}) are allowed`);
    //   setIsLoading(false);
    //   return;
    // }

    try {
      const result = await signIn("credentials", {
        email: formData.email.toLowerCase(),
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // Display the error message from the server
        setError(result.error);
      } else {
        router.push("/dashboard");
        router.refresh();
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
        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-md text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-green-500 text-white rounded-md text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
               Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-500 text-white border-gray-400"
              disabled={isLoading}
              placeholder={`example${TOWSON_EMAIL_DOMAIN}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-500 text-white border-gray-400"
              disabled={isLoading}
            />
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-yellow-400 hover:text-yellow-500">
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center text-sm mt-4">
            <Link href="/signup" className="text-white underline">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
