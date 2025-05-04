import { Suspense } from "react";
import Header from "@/components/Header";
import SignupForm from "@/components/auth/SignupForm";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-600 rounded-lg p-8 shadow-lg text-white">
            <h1 className="text-2xl font-bold text-center mb-6">
              Create Account
            </h1>
            <Suspense fallback={
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
              </div>
            }>
              <SignupForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
