import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/lib/models";
import { generateJWTToken } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    console.log("Received email:", email);

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    console.log("Database connected successfully");

    const user = await User.findOne({ email });
    console.log("User found:", user ? {
      email: user.email,
      id: user._id
    } : "No user found");

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email" },
        { status: 404 }
      );
    }

    // Generate a new JWT token with user ID and expiry
    const payload = {
      userId: user._id.toString(),
      type: 'password_reset',
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiry
    };
    const resetToken = await generateJWTToken(payload);
    
    console.log("Generated token:", resetToken);
    console.log("Token length:", resetToken.length);

    // Update user with reset token and expiry
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Failed to update user with reset token");
    }

    // Verify the token was stored correctly
    console.log("Token storage verification:", {
      email: updatedUser.email,
      storedToken: updatedUser.resetToken,
      tokenLength: updatedUser.resetToken?.length,
      expiry: updatedUser.resetTokenExpiry
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    console.log("Reset URL:", resetUrl);

    // Send email
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset for your account.</p>
        <p>Click this link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return NextResponse.json(
      { message: "Password reset email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Detailed forgot password error:", error);
    return NextResponse.json(
      { 
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 