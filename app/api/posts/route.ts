import { NextRequest, NextResponse } from "next/server";
import { createPost, updatePost, deletePostById } from "@/actions/post";

export async function POST(req: Request) {
  try {
    console.log("ROUTE.TS hi");
    const body = await req.json();
    console.log("ROUTE.TS Received body:", body);

    const result = await createPost(body);
    console.log("ROUTE.TS Post created:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("ROUTE.TS API /api/posts error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, prevImageId, ...data } = body;

    if (!id) throw new Error("Post ID is required");

    const updatedPost = await updatePost({
      id,
      ...data,
      prevImageId,
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const idParam = req.nextUrl.searchParams.get("id");
    if (!idParam) throw new Error("Post ID is required for deletion");

    const id = Number(idParam);
    const result = await deletePostById(id);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/posts error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete post" },
      { status: 500 }
    );
  }
}
