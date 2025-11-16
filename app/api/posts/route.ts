import { NextResponse } from "next/server";
import { createPost } from "@/actions/post";

export async function POST(req: Request) {
  try {
    console.log("ROUTE.TS hi");
    const body = await req.json();
    console.log("📦ROUTE.TS Received body:", body);

    const result = await createPost(body);
    console.log("✅ROUTE.TS Post created:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ROUTE.TS API /api/posts error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create post" },
      { status: 500 }
    );
  }
}
