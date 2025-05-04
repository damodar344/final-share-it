import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import { Listing } from "@/lib/models";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let listings;
    if (userId) {
      // Fetch user's listings
      listings = await Listing.find({ userId: userId })
        .populate({
          path: 'userId',
          select: 'id name email preferredContact phone'
        })
        .sort({ createdAt: -1 })
        .lean();
    } else {
      // Fetch all listings
      listings = await Listing.find()
        .populate({
          path: 'userId',
          select: 'id name email preferredContact phone'
        })
        .sort({ createdAt: -1 })
        .lean();
    }

    // Format the listings to match the expected structure
    const formattedListings = listings.map((listing) => ({
      _id: listing._id.toString(),
      id: listing._id.toString(),
      images: listing.images || [],
      rent: listing.rent,
      accommodationType: listing.accommodationType,
      privateBathroom: listing.privateBathroom,
      distanceFromCampus: listing.distanceFromCampus,
      utilityIncluded: listing.utilityIncluded,
      amenities: listing.amenities || [],
      userId: listing.userId._id.toString(),
      user: {
        id: listing.userId._id.toString(),
        name: `${listing.userId.firstName} ${listing.userId.lastName}`,
        email: listing.userId.email,
        preferredContact: listing.userId.preferredContact,
        phone: listing.userId.phone
      }
    }));

    return NextResponse.json({ listings: formattedListings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
} 