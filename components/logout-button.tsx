"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ButtonVariant } from "@/types";

export function LogoutButton({
  variant,
  compoenentClassName,
}: {
  variant: string;
  compoenentClassName: string;
}) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button
      variant={variant as ButtonVariant}
      onClick={logout}
      className={compoenentClassName}
    >
      Logout
    </Button>
  );
}
