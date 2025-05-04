import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  name: string;
  email: string;
  preferredContact: string;
  phone?: string;
}

interface Listing {
  _id: string;
  id: string;
  images: string[];
  rent: number;
  accommodationType: string;
  privateBathroom: string;
  distanceFromCampus: number;
  utilityIncluded: boolean;
  amenities: string[];
  userId: string;
  user: User;
}

export function useListings(filter: 'all' | 'my' = 'all') {
  const { data: session } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      if (!session?.user?.id && filter === 'my') {
        setIsLoading(false);
        return;
      }

      try {
        const url = filter === 'my' 
          ? `/api/listings?userId=${session?.user?.id}`
          : '/api/listings';
          
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
          setListings(data.listings);
        } else if (response.status === 401) {
          // Handle unauthorized silently by setting empty listings
          setListings([]);
        }
        // Ignore other errors to prevent console messages
      } catch (error) {
        // Set empty listings on error instead of logging
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchListings();
  }, [session?.user?.id, filter]);

  return { listings, isLoading };
} 