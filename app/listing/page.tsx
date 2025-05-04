'use client';

import { Suspense } from "react";
import ListingForm from "@/components/listing/ListingForm";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { Loader2 } from "lucide-react";

export default function ListingPage() {
  return (
    <AuthWrapper requireVerified>
      <div className="min-h-screen bg-gray-60">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
          </div>
        }>
          <ListingForm />
        </Suspense>
      </div>
    </AuthWrapper>
  );
}
