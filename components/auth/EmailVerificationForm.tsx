"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function EmailVerificationForm() {
  const router = useRouter()

  useEffect(() => {
    // Router is now guaranteed to be mounted
  }, [router])

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-gray-600 rounded-lg p-8 shadow-lg text-white">
        <h1 className="text-2xl font-bold text-center mb-4">Let's check your student status first!</h1>

        <div className="text-center mb-8">
          <p className="mb-4">We sent a verification link to your student email, please click the link to continue!</p>
        </div>

        <Button onClick={handleLogin} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold">
          Login
        </Button>

        <div className="mt-8 text-sm text-center">
          <h3 className="font-semibold mb-2">Why is this necessary?</h3>
          <p>
            At ShareIT, your safety comes first. That's why we verify every student's status—ensuring you're only
            matched with current Towson University students for a secure and trusted roommate search.
          </p>
        </div>
      </div>
    </div>
  )
}
