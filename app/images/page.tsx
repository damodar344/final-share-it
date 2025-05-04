import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ImageUploadForm from "@/components/images/ImageUploadForm";

export default async function ImagesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-60">
      <ImageUploadForm />
    </div>
  );
} 