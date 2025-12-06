import { NextRequest, NextResponse } from "next/server";
import {
  createPurchaseRequest,
  cancelPurchaseRequest,
  getMyPurchases,
} from "@/actions/purchase";

// POST: create or cancel purchase (existing)
export async function POST(req: NextRequest) {
  try {
    const { postId, buyerId, action } = await req.json();

    if (!postId || !buyerId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (action === "buy") {
      const purchase = await createPurchaseRequest(postId, buyerId);
      return NextResponse.json({
        success: true,
        message: "Purchase request sent!",
        purchase,
      });
    }

    if (action === "cancel") {
      await cancelPurchaseRequest(postId, buyerId);
      return NextResponse.json({
        success: true,
        message: "Purchase request canceled.",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action." },
      { status: 400 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// GET: fetch purchases with cursor-based pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const cursorParam = searchParams.get("cursor");
    const takeParam = Number(searchParams.get("take") ?? 10);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }

    const cursor = cursorParam ? Number(cursorParam) : undefined;

    const { purchases, nextCursor } = await getMyPurchases(
      userId,
      takeParam,
      cursor
    );

    return NextResponse.json({ success: true, purchases, nextCursor });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
