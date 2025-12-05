// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getNotifications } from "@/actions/notifications";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const notifications = await getNotifications(userId);
    return NextResponse.json(notifications);
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
