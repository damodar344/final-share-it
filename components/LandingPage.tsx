import Link from "next/link"
import Header from "./Header"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-60">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold mb-6">Find Your Perfect University Roommate</h1>
          <p className="text-xl mb-8 max-w-2xl">
            ShareIT connects university students looking for compatible roommates. Create a profile, list your space,
            and find your ideal match.
          </p>
          <div className="flex gap-4">
            <Link
              href="/signup"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-6 rounded-full"
            >
              Get Started
            </Link>
            <Link href="/login" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full">
              Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
