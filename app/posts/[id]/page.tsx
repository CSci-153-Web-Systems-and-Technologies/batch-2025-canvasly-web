export const dynamic = "force-dynamic";
export const dynamicParams = true;

import PostClientWrapper from "@/components/post-client-wrapper";
import { createClient } from "@/lib/server";
import { getPostById } from "@/actions/post";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

/* ---------------------------  FIXED generateMetadata  --------------------------- */
export const generateMetadata = async ({ params }: PageProps) => {
  const { id } = await params; // MUST await

  const postId = Number(id);
  if (isNaN(postId)) redirect("/not-found");

  const { data } = await getPostById(postId);

  const artworkName = data?.title || "Artwork";

  return {
    title: `${artworkName} - Artwork`,
    description: `Artwork page for ${artworkName}`,
  };
};

/* ------------------------------  FIXED PAGE  ------------------------------ */
const PostPage = async ({ params }: PageProps) => {
  const { id } = await params; // MUST await

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post, error: postError } = await getPostById(Number(id));

  if (postError || !post) redirect("/not-found");

  return (
    <div className="w-full p-10 flex flex-col items-center justify-center pt-24 md:pt-36">
      <PostClientWrapper
        post={post}
        authUser={user}
        queryId={`post-${post.id}`}
      />
    </div>
  );
};

export default PostPage;
