"use server";
import connectToDatabase from "./db";
import { generateJWTToken } from "./auth";
import { User, Listing, Profile, Preferences, ContactInfo, VerificationToken } from "./models";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";
import { sendEmail } from "./email";

async function getSession() {
  return await getServerSession(authOptions);
}

const TOWSON_EMAIL_DOMAIN = "@students.towson.edu";

async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify?token=${token}`;
  
  await sendEmail({
    to: email,
    subject: "Verify your email - ShareIT",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - ShareIT</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
          .header {
            background-color: #FFD700;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 30px 20px;
            background-color: #ffffff;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FFD700;
            color: #333333;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ShareIT!</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Thank you for signing up! Please verify your email address to access all features of ShareIT.</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; font-size: 12px; color: #666666;">
              ${verificationUrl}
            </p>
            <p>This verification link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ShareIT. All rights reserved.</p>
            <p>This email was sent to you because you registered for a ShareIT account.</p>
          </div>
        </div>
      </body>
      </html>
    `
  });
}

export async function createAccount({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  try {
    const db = await connectToDatabase();

    // Validate email domain
    // if (!email.toLowerCase().endsWith(TOWSON_EMAIL_DOMAIN)) {
    //   throw new Error(`Only Towson University email addresses (${TOWSON_EMAIL_DOMAIN}) are allowed`);
    // }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      emailVerified: false,
    });

    // Generate verification token
    const payload = {
      userId: user._id.toString(),
      type: 'email_verification',
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours expiry
    };
    const token = await generateJWTToken(payload);
    await VerificationToken.create({
      userId: user._id,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, token);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // Delete the user since email verification failed
      await User.findByIdAndDelete(user._id);
      await VerificationToken.deleteOne({ userId: user._id });
      throw new Error("Failed to send verification email. Please try again.");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error creating account:", error);
    return { error: error.message };
  }
}

export async function login(credentials: { email: string; password: string }) {
  try {
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );
    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return { success: false, error: "Please verify your email first" };
    }

    // Return success - NextAuth will handle the session
    return { success: true };
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, error: "An error occurred during login" };
  }
}

export async function saveProfile(profileData: any) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    console.log({ session, userId: session.user?.id });

    await connectToDatabase();

    // Find or create profile
    let profile = await Profile.findOne({ userId: session.user?.id });

    if (!profile) {
      profile = new Profile({
        userId: session.user?.id,
        ...profileData,
      });
    } else {
      // Update existing profile
      Object.assign(profile, profileData);
    }

    await profile.save();

    return { success: true };
  } catch (error) {
    console.error("Error saving profile:", error);
    throw error;
  }
}

export async function saveListing(listingData: any) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    await connectToDatabase();

    // Find or create listing
    let listing = await Listing.findOne({ userId: session.user?.id });

    if (!listing) {
      listing = new Listing({
        userId: session.user?.id,
        ...listingData,
      });
    } else {
      // Update existing listing
      Object.assign(listing, listingData);
    }

    await listing.save();

    return { success: true };
  } catch (error) {
    console.error("Error saving listing:", error);
    throw error;
  }
}

export async function savePreferences(preferencesData: any) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    await connectToDatabase();

    // Find or create preferences
    let preferences = await Preferences.findOne({ userId: session.user?.id });

    if (!preferences) {
      preferences = new Preferences({
        userId: session.user?.id,
        ...preferencesData,
      });
    } else {
      // Update existing preferences
      Object.assign(preferences, preferencesData);
    }

    await preferences.save();

    return { success: true };
  } catch (error) {
    console.error("Error saving preferences:", error);
    throw error;
  }
}

export async function saveContactInfo(contactData: any) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    await connectToDatabase();

    // Find or create contact info
    let contactInfo = await ContactInfo.findOne({ userId: session.user?.id });

    if (!contactInfo) {
      contactInfo = new ContactInfo({
        userId: session.user?.id,
        ...contactData,
      });
    } else {
      // Update existing contact info
      Object.assign(contactInfo, contactData);
    }

    await contactInfo.save();

    return { success: true };
  } catch (error) {
    console.error("Error saving contact info:", error);
    throw error;
  }
}

export async function uploadImage(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    const blob = await put(`listings/${session.user?.id}/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    // Save image URL to listing
    await connectToDatabase();
    const listing = await Listing.findOne({ userId: session.user?.id });

    if (listing) {
      if (!listing.images) {
        listing.images = [];
      }

      listing.images.push(blob.url);
      await listing.save();
    }

    revalidatePath("/finalize");

    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function getUserData() {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    await connectToDatabase();

    // Get user data and convert to plain object
    const user = await User.findById(session.user?.id).lean().exec();
    if (!user) {
      throw new Error("User not found");
    }

    // Get profile data and convert to plain object
    const profile = await Profile.findOne({ userId: session.user?.id })
      .lean()
      .exec();

    // Get listing data and convert to plain object
    const listing = await Listing.findOne({ userId: session.user?.id })
      .lean()
      .exec();

    // Get preferences data and convert to plain object
    const preferences = await Preferences.findOne({
      userId: session.user?.id,
    })
      .lean()
      .exec();

    // Get contact info and convert to plain object
    const contactInfo = await ContactInfo.findOne({
      userId: session.user?.id,
    })
      .lean()
      .exec();

    // Convert Mongoose documents to plain objects
    const plainUser = JSON.parse(JSON.stringify(user));
    const plainProfile = profile ? JSON.parse(JSON.stringify(profile)) : null;
    const plainListing = listing ? JSON.parse(JSON.stringify(listing)) : null;
    const plainPreferences = preferences
      ? JSON.parse(JSON.stringify(preferences))
      : null;
    const plainContactInfo = contactInfo
      ? JSON.parse(JSON.stringify(contactInfo))
      : null;

    // Construct the final user data object
    const userData = {
      ...plainUser,
      ...plainProfile,
      listing: plainListing,
      preferences: plainPreferences?.preferences || [],
      guestPreference: plainPreferences?.guestPreference || null,
      additionalPreference: plainPreferences?.additionalPreference || null,
      contactInfo: plainContactInfo,
    };

    return userData;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
}

export async function finalizeListing() {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    await connectToDatabase();

    // Update listing status
    const listing = await Listing.findOne({ userId: session.user?.id });

    if (listing) {
      listing.status = "active";
      listing.publishedAt = new Date();
      await listing.save();
    }

    return { success: true };
  } catch (error) {
    console.error("Error finalizing listing:", error);
    throw error;
  }
}

export async function getAvailableListings() {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }
    await connectToDatabase();

    const listings = await Listing.find({ status: "active" }).lean();
    const populatedListings = await Promise.all(
      listings.map(async (listing) => {
        const user = await User.findById(listing.userId).lean();
        const profile = await Profile.findOne({
          userId: listing.userId,
        }).lean();
        const preferences = await Preferences.findOne({
          userId: listing.userId,
        }).lean();
        const contactInfo = await ContactInfo.findOne({
          userId: listing.userId,
        }).lean();

        // Serialize the data
        const serializedListing = {
          ...listing,
          _id: listing._id.toString(),
          userId: listing.userId.toString(),
          createdAt: listing.createdAt?.toISOString(),
          publishedAt: listing.publishedAt?.toISOString(),
          user: {
            ...user,
            _id: user?._id.toString(),
            ...profile,
            email: contactInfo?.email || user?.email,
            phone: contactInfo?.phone,
            preferredContact: contactInfo?.preferredContact,
          },
          preferences: preferences
            ? {
                ...preferences,
                _id: preferences._id.toString(),
                userId: preferences.userId.toString(),
              }
            : null,
        };

        delete serializedListing.__v;
        return serializedListing;
      })
    );

    return populatedListings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}

export async function getListing(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }
    await connectToDatabase();

    const listing = await Listing.findById(id).lean();
    if (!listing) {
      throw new Error("Listing not found");
    }

    const user = await User.findById(listing.userId).lean();
    const profile = await Profile.findOne({ userId: listing.userId }).lean();
    const preferences = await Preferences.findOne({
      userId: listing.userId,
    }).lean();
    const contactInfo = await ContactInfo.findOne({
      userId: listing.userId,
    }).lean();

    // Helper function to serialize MongoDB objects
    const serializeObject = (obj: any) => {
      if (!obj) return null;
      const serialized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value instanceof Object && "_id" in value) {
          serialized[key] = value._id.toString();
        } else if (value instanceof Date) {
          serialized[key] = value.toISOString();
        } else if (Array.isArray(value)) {
          serialized[key] = value.map((item) =>
            item instanceof Object && "_id" in item ? item._id.toString() : item
          );
        } else {
          serialized[key] = value;
        }
      }
      return serialized;
    };

    // Serialize the data
    const serializedListing = {
      ...serializeObject(listing),
      user: {
        ...serializeObject(user),
        ...serializeObject(profile),
        email: contactInfo?.email || user?.email,
        phone: contactInfo?.phone,
        preferredContact: contactInfo?.preferredContact,
      },
      preferences: preferences ? serializeObject(preferences) : null,
    };

    return serializedListing;
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error;
  }
}
