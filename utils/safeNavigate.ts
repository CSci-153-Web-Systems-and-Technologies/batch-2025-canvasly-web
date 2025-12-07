// utils/safeNavigate.ts
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";

export const useSafeNavigate = () => {
  const supabase = createClient();
  const router = useRouter();

  const safeNavigate = async (url: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/auth/login");
    } else {
      router.push(url);
    }
  };

  return { safeNavigate };
};
