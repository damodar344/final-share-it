'use client';

import { Suspense, useState, useEffect } from "react";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { Loader2 } from "lucide-react";
import { useListings } from "@/lib/hooks/useListings";
import Tabs from "@/components/ui/tabs";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { listings: myListings, isLoading: isLoadingMy } = useListings('my');
  const { listings: allListings, isLoading: isLoadingAll } = useListings('all');

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const tabs = [
    {
      label: "My Listings",
      content: (
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
          </div>
        }>
          {isLoadingMy ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
            </div>
          ) : myListings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No listings yet
              </h3>
              <p className="text-gray-600">
                Create your first listing to start sharing your space
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </Suspense>
      ),
    },
    {
      label: "All Listings",
      content: (
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
          </div>
        }>
          {isLoadingAll ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
            </div>
          ) : allListings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No listings available
              </h3>
              <p className="text-gray-600">
                Check back later for new listings
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </Suspense>
      ),
    },
  ];

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <a
              href="/listing"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-6 py-2 rounded-lg transition-colors"
            >
              Create New Listing
            </a>
          </div>

          <Tabs tabs={tabs} defaultTab={activeTab} onTabChange={handleTabChange} />
        </main>
      </div>
    </AuthWrapper>
  );
}
