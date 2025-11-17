import UserProfile from "@/components/user-profile";
import { getUserById } from "@/actions/user"; // Your server action
import { createClient } from "@/lib/supabase/server"; // Use the SERVER client
import { redirect } from "next/navigation";

export const generateMetadata = async ({ params }) => {
  const { data } = await getUserById(params.id);
  const username = data?.username || "User";

  return {
    title: `${username} - Artworks and Profile`,
    description: `Profile page of user ${username}`,
  };
};

const ProfilePage = async ({ params }) => {
  const supabase = await createClient();

  const { data: profileUser, error: profileError } = await getUserById(
    params.id
  );

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (profileError || !profileUser) {
    redirect("/not-found");
  }

  return <UserProfile profileUser={profileUser} authUser={authUser} />;
};

export default ProfilePage;
