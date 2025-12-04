import { NextRequest, NextResponse } from "next/server";
import {
  acceptPurchase,
  rejectPurchase,
  getMyRequests,
} from "@/actions/purchase";

// POST: Accept or Reject a request
export async function POST(req: NextRequest) {
  try {
    const { purchaseId, sellerId, action } = await req.json();

    if (!purchaseId || !sellerId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    let result;

    if (action === "accept") {
      result = await acceptPurchase(Number(purchaseId), sellerId);
    } else if (action === "reject") {
      result = await rejectPurchase(Number(purchaseId), sellerId);
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        action === "accept"
          ? "Purchase request accepted."
          : "Purchase request rejected.",
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// GET: Fetch seller's pending requests with cursor pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");
    const cursorParam = searchParams.get("cursor");
    const takeParam = Number(searchParams.get("take") ?? 10);

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: "Missing sellerId" },
        { status: 400 }
      );
    }

    const cursor = cursorParam ? Number(cursorParam) : undefined;

    const { requests, nextCursor } = await getMyRequests(
      sellerId,
      takeParam,
      cursor
    );

    return NextResponse.json({
      success: true,
      requests,
      nextCursor,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
