"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveContactInfo } from "@/lib/actions"

export default function ContactForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    preferredContact: "",
  })

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, phone: e.target.value }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }))
  }

  const handlePreferredContactChange = (value: string) => {
    setFormData((prev) => ({ ...prev, preferredContact: value }))
  }

  const handleSubmit = async () => {
    try {
      await saveContactInfo(formData)
      router.push("/finalize")
    } catch (error) {
      console.error("Failed to save contact info:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-60">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-600 rounded-lg p-8 shadow-lg text-white">
            <h1 className="text-2xl font-bold text-center mb-6">Please enter contact Information</h1>

            <div className="space-y-6">
              <div>
                <p className="mb-2">Cellphone No.</p>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="bg-gray-500 text-white border-gray-400"
                />
              </div>

              <div>
                <p className="mb-2">Email address</p>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  className="bg-gray-500 text-white border-gray-400"
                />
              </div>

              <div>
                <p className="mb-2">Preferred way of being contacted</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => handlePreferredContactChange("Email")}
                    className={`flex-1 ${formData.preferredContact === "Email" ? "bg-green-500 text-white font-semibold shadow-md" : "bg-yellow-400/80 text-gray-800 hover:bg-yellow-400"}`}
                  >
                    Email
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handlePreferredContactChange("Phone No.")}
                    className={`flex-1 ${formData.preferredContact === "Phone No." ? "bg-green-500 text-white font-semibold shadow-md" : "bg-yellow-400/80 text-gray-800 hover:bg-yellow-400"}`}
                  >
                    Phone No.
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
