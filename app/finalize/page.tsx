'use client';

import { Suspense } from "react";
import FinalizeForm from "@/components/finalize/FinalizeForm";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { Loader2 } from "lucide-react";

export default function FinalizePage() {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
          </div>
        }>
          <FinalizeForm />
        </Suspense>
      </div>
    </AuthWrapper>
  );
}
