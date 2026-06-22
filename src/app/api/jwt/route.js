import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const cookieName = process.env.JWT_COOKIE_NAME || "bd_token";

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Better Auth session missing.",
        },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image || "",
        role: session.user.role || "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    const cookieStore = await cookies();

    cookieStore.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      message: "JWT cookie created successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create JWT.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();

  cookieStore.set(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({
    success: true,
    message: "JWT cookie cleared successfully.",
  });
}