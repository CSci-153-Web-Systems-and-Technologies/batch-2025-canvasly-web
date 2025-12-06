import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteNotification } from "@/actions/notifications"; // <-- import helper

interface Params {
  params: { id: string };
}

export async function DELETE(req: Request, { params }: Params) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);

  await deleteNotification(id);

  return NextResponse.json({ success: true });
}
