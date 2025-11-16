import SinglePostContainer from "@/components/single-post-container";
import { getPostById } from "@/actions/post";
import { redirect } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export const generateMetadata = async ({ params }: PageProps) => {
  const { data } = await getPostById(Number(params.id));
  const artworkName = data?.title || "Artwork";

  return {
    title: `${artworkName} - Artwork`,
    description: `Artwork page for ${artworkName}`,
  };
};

const ProfilePage = async ({ params }: PageProps) => {
  const { data: post, error: postError } = await getPostById(Number(params.id));

  if (postError || !post) redirect("/not-found");

  return (
    <div className="w-full p-10 flex flex-col items-center justify-center">
      <SinglePostContainer data={post} />
    </div>
  );
};

export default ProfilePage;
