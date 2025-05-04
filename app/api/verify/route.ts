import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/lib/models";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/login?error=Invalid verification link", request.url)
      );
    }

    // Replace spaces with plus signs in the token
    token = token.replace(/ /g, '+');

    // Verify the token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.redirect(
        new URL(
          "/login?error=Invalid or expired verification link",
          request.url
        )
      );
    }

    await connectToDatabase();

    // Update user's email verification status
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.redirect(
        new URL("/login?error=User not found", request.url)
      );
    }

    if (user.emailVerified) {
      return NextResponse.redirect(
        new URL("/login?message=Email already verified", request.url)
      );
    }

    user.emailVerified = true;
    await user.save();

    return NextResponse.redirect(
      new URL("/login?message=Email verified successfully", request.url)
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.redirect(
      new URL("/login?error=Verification failed", request.url)
    );
  }
}
