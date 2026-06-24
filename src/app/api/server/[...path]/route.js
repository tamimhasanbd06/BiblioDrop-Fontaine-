// বাংলা মন্তব্য: Next.js proxy route protected backend API call-এ JWT cookie forward করে।
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const backendURL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const cookieName = process.env.JWT_COOKIE_NAME || "bd_token";

async function handler(request, context) {
  try {
    if (!backendURL) {
      return NextResponse.json(
        { success: false, message: "Missing backend URL in .env.local" },
        { status: 500 }
      );
    }

    const params = await context.params;
    const path = params.path?.join("/") || "";

    const incomingURL = new URL(request.url);
    const targetURL = `${backendURL}/${path}${incomingURL.search}`;

    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName)?.value;

    const headers = new Headers();

    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers.set("content-type", contentType);
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    let body;

    if (request.method !== "GET" && request.method !== "HEAD") {
      body = await request.text();
    }

    const response = await fetch(targetURL, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Backend proxy failed.",
      },
      { status: 500 }
    );
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};