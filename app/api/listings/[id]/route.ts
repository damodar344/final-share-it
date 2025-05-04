import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Listing, User, Profile, Preferences } from "@/lib/models";
import { getSession } from "@/lib/auth";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface ListingDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  images: string[];
  accommodationType: string;
  privateBathroom: string;
  rent: string;
  utilityIncluded: boolean;
  amenities: string[];
  distanceFromCampus: string;
  publishedAt?: Date;
}

interface ProfileDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  gender: string;
  academicLevel: string;
  studySchedule: string;
  socializingPreference: string;
  tidiness: number;
  drinkingPreference: string;
  smokingPreference: string;
  hobbies: string[];
}

interface PreferencesDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  preferences: string[];
  guestPreference: number;
  additionalPreference: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // Get listing with user data
    const listing = await Listing.findById(params.id)
      .populate({
        path: "userId",
        model: User,
        select: "firstName lastName",
      })
      .lean();

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    const listingDoc = listing as unknown as ListingDocument & {
      userId: { _id: Types.ObjectId; firstName: string; lastName: string };
    };

    // Get profile data
    const profile = await Profile.findOne({ userId: listingDoc.userId._id }).lean() as unknown as ProfileDocument;

    // Get preferences data
    const preferences = await Preferences.findOne({ userId: listingDoc.userId._id }).lean() as unknown as PreferencesDocument;

    // Format the response
    const formattedListing = {
      id: listingDoc._id.toString(),
      images: listingDoc.images || [],
      accommodationType: listingDoc.accommodationType,
      privateBathroom: listingDoc.privateBathroom,
      rent: listingDoc.rent,
      utilityIncluded: listingDoc.utilityIncluded,
      amenities: listingDoc.amenities || [],
      distanceFromCampus: listingDoc.distanceFromCampus,
      user: {
        firstName: listingDoc.userId.firstName,
        lastName: listingDoc.userId.lastName,
        gender: profile?.gender,
        academicLevel: profile?.academicLevel,
        studySchedule: profile?.studySchedule,
        socializingPreference: profile?.socializingPreference,
        tidiness: profile?.tidiness,
        drinkingPreference: profile?.drinkingPreference,
        smokingPreference: profile?.smokingPreference,
        hobbies: profile?.hobbies || [],
      },
      preferences: {
        roommate: preferences?.preferences || [],
        guestPreference: preferences?.guestPreference,
        additionalPreference: preferences?.additionalPreference,
      },
      publishedAt: listingDoc.publishedAt,
    };

    return NextResponse.json({ listing: formattedListing });
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const listing = await Listing.findById(params.id);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Check if the user is the owner of the listing
    if (listing.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own listings' },
        { status: 403 }
      );
    }

    await Listing.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
} 