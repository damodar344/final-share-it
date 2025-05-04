import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import ListingCard from "@/components/ListingCard";
import connectToDatabase from "@/lib/db";
import { Listing, User, ContactInfo } from "@/lib/models";
import { Types } from "mongoose";
import Header from "@/components/Header";
import Link from "next/link";
import { Search, Users, Shield, Building, ChevronDown } from "lucide-react";
import Accordion from "@/components/ui/accordion";

interface MongoListing {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  images: string[];
  rent: string;
  accommodationType: string;
  privateBathroom: string;
  distanceFromCampus: string;
  utilityIncluded: boolean;
  amenities: string[];
  status: string;
}

interface MongoUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
}

interface MongoContactInfo {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  phone?: string;
  email?: string;
  preferredContact: string;
}

const features = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Easy Search",
    description: "Find the perfect accommodation that matches your preferences with our advanced search filters."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Compatible Roommates",
    description: "Connect with like-minded students who share your lifestyle and academic goals."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Verified Listings",
    description: "All listings are verified to ensure a safe and reliable housing experience."
  },
  {
    icon: <Building className="w-6 h-6" />,
    title: "Various Options",
    description: "Choose from a wide range of housing options, from private rooms to shared apartments."
  }
];

const stats = [
  { number: "2000+", label: "Active Listings" },
  { number: "5000+", label: "Happy Students" },
  { number: "50+", label: "Universities" },
  { number: "95%", label: "Success Rate" }
];

const faqs = [
  {
    question: "How does ShareIT work?",
    answer: "ShareIT connects students looking for housing with verified listings and potential roommates. Create an account, set your preferences, and start browsing listings that match your criteria."
  },
  {
    question: "Is ShareIT free to use?",
    answer: "Yes, ShareIT is completely free for students to use. You can browse listings, connect with potential roommates, and use all platform features without any cost."
  },
  {
    question: "How are listings verified?",
    answer: "Our team verifies each listing through a thorough process including property documentation, owner verification, and regular updates to ensure accuracy and reliability."
  },
  {
    question: "Can I find roommates through ShareIT?",
    answer: "Yes! ShareIT helps you find compatible roommates based on your preferences, study habits, and lifestyle choices to ensure a harmonious living arrangement."
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-amber-50 to-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect Student Housing
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Connect with fellow students, find compatible roommates, and discover the perfect place to stay near your campus.
            </p>
            <div className="space-y-4 md:space-y-0 md:space-x-4">
              <Link 
                href="/dashboard"
                className="inline-block bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
              >
                Browse Listings
              </Link>
              <Link 
                href="/signup"
                className="inline-block bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 border border-amber-200 transition-colors"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <ChevronDown className="w-8 h-8 text-amber-500 animate-bounce" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 text-amber-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 lg:py-24 bg-amber-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg text-amber-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Create Account</h3>
                <p className="text-gray-600">Sign up and complete your profile with your preferences</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Browse Listings</h3>
                <p className="text-gray-600">Search through verified listings that match your criteria</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Connect</h3>
                <p className="text-gray-600">Contact potential roommates and find your perfect match</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">ShareIT</h3>
              <p className="text-gray-400">Making student housing search easier and more reliable.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ShareIT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
