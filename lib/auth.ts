import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from 'crypto';

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please provide NEXTAUTH_SECRET environment variable");
}

const JWT_SECRET = process.env.NEXTAUTH_SECRET;



export function generateJWTToken(payload: any): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): any {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64');

    console.log("Expected signature:", expectedSignature);
    console.log("Signature:", signature);

    if (signature !== expectedSignature) {
      console.error('Token signature mismatch');
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString());
    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function getSession() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return null;
    }

    return {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      emailVerified: session.user.emailVerified,
    };
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}
