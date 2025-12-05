import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { markAllRead } from "@/actions/notifications"; // <-- import helper

export async function PATCH() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await markAllRead(user.id);

  return NextResponse.json({ success: true });
}
