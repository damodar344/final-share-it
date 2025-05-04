import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const session = await getSession();

  console.log({ session });

  if (!session) {
    redirect("/login");
  }

  if (!session.emailVerified) {
    redirect("/signup/email");
  }

  return (
    <div className="min-h-screen bg-gray-60">
      <ProfileForm />
    </div>
  );
}
