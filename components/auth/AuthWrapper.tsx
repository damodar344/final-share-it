import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireVerified?: boolean;
}

export default function AuthWrapper({ children, requireVerified = false }: AuthWrapperProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/login");
      return;
    }

    if (requireVerified && !session.user.emailVerified) {
      router.replace("/signup/email");
    }
  }, [session, status, requireVerified, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (!session) return null;
  if (requireVerified && !session.user.emailVerified) return null;

  return <>{children}</>;
} 