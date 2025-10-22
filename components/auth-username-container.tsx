import React from "react";
import { createClient } from "@/lib/supabase/server";

export async function AuthUser({
  classNameString,
}: {
  classNameString: string;
}) {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <p className={classNameString}>{user.email}</p>
  ) : (
    <p>not logged in</p>
  );
}
