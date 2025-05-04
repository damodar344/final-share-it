"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createAccount } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const TOWSON_EMAIL_DOMAIN = "@students.towson.edu";

export default function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName) {
        setError("Please fill in all fields");
        return;
      }
      setError("");
      setStep(2);
    }
  };

  // const validateEmail = (email: string) => {
  //   return email.toLowerCase().endsWith(TOWSON_EMAIL_DOMAIN);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // if (!validateEmail(formData.email)) {
    //   setError(`Only Towson University email addresses (${TOWSON_EMAIL_DOMAIN}) are allowed`);
    //   setLoading(false);
    //   return;
    // }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await createAccount({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push("/signup/email");
    } catch (error: any) {
      // Handle specific error messages from the backend
      if (error.message === "User already exists") {
        setError("An account with this email already exists");
      } else if (error.message.includes("validation failed")) {
        setError("Please check your inputs and try again");
      } else if (error.message.includes("MongoDB")) {
        setError("Unable to connect to the database. Please try again later");
      } else {
        setError(error.message || "An error occurred during signup");
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {step === 1 ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="bg-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="bg-gray-700 text-white"
            />
          </div>
          <Button
            type="button"
            onClick={handleNextStep}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800"
          >
            Next
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-gray-700 text-white"
              placeholder={`example${TOWSON_EMAIL_DOMAIN}`}
            />
            {/* <p className="text-sm text-gray-300">
              Only Towson University email addresses are allowed
            </p> */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="bg-gray-700 text-white"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating account...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
        </>
      )}

      {error && (
        <div className="p-3 bg-red-500 text-white rounded-md text-center">
          {error}
        </div>
      )}

      <div className="text-center text-sm">
        <Link href="/login" className="text-white underline">
          I already have an account (LOGIN)
        </Link>
      </div>
    </form>
  );
}
