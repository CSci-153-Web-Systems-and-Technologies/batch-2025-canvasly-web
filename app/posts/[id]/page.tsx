import PostClientWrapper from "@/components/post-client-wrapper";
import { createClient } from "@/lib/server";
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

const PostPage = async ({ params }: PageProps) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post, error: postError } = await getPostById(Number(params.id));

  if (postError || !post) redirect("/not-found");

  return (
    <div className="w-full p-10 flex flex-col items-center justify-center pt-24 md:pt-36">
      <PostClientWrapper
        post={post} // <--- changed from postId to post
        authUser={user}
        queryId={`post-${post.id}`}
      />
    </div>
  );
};

export default PostPage;
