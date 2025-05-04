import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import PreferencesForm from "@/components/preferences/PreferencesForm"

export default async function PreferencesPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-60">
      <PreferencesForm />
    </div>
  )
}
