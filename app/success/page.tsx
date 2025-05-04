import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import SuccessPage from "@/components/success/SuccessPage"

export default async function Success() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-60">
      <SuccessPage />
    </div>
  )
}
