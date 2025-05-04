import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/lib/models";
import { hash } from "bcryptjs";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    console.log("Received token:", token);

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Replace spaces with plus signs in the token
    const decodedToken = token.replace(/ /g, '+');
    console.log("Decoded token:", decodedToken);

    // Verify the JWT token
    const decoded = await verifyToken(decodedToken);
    console.log("Decoded payload:", decoded);
    if (!decoded || !decoded.userId || decoded.type !== 'password_reset') {
      return NextResponse.json(
        { message: "Invalid or expired token. Please request a new password reset link." },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return NextResponse.json(
        { message: "Token has expired. Please request a new password reset link." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    console.log("Database connected successfully");

    // Find user with the decoded token
    const user = await User.findOne({
      _id: decoded.userId,
      resetToken: decodedToken // Use decoded token for database comparison
    });

    if (!user) {
      console.log("User not found with token:", {
        userId: decoded.userId,
        token: decodedToken
      });
      return NextResponse.json(
        { message: "Invalid or expired token. Please request a new password reset link." },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hash(password, 12);
    console.log("Password hashed successfully");

    // Update user's password and clear reset token
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Failed to update user password");
    }

    console.log("User password updated successfully");

    return NextResponse.json(
      { message: "Password has been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Detailed reset password error:", error);
    return NextResponse.json(
      { 
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 