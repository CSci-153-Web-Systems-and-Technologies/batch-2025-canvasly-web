import UserProfile from "@/components/user-profile";
import { getUserById } from "@/actions/user";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: PageProps) => {
  const { id } = await params; // MUST await

  const { data } = await getUserById(id);
  const username = data?.username || "User";

  return {
    title: `${username} - Artworks and Profile`,
    description: `Profile page of user ${username}`,
  };
};

const ProfilePage = async ({ params }: PageProps) => {
  const { id } = await params; // MUST await

  const supabase = await createClient();

  const { data: profileUser, error: profileError } = await getUserById(id);

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (profileError || !profileUser) {
    redirect("/not-found");
  }

  return <UserProfile profileUser={profileUser} authUser={authUser} />;
};

export default ProfilePage;
