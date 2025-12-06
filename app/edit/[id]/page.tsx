import PostEditor from "@/components/post-editor";
import React from "react";
import { redirect } from "next/navigation";
import { getPostByIdWithCLI_ID } from "@/actions/post";
import { createClient } from "@/lib/server";
import { getPostAuthorId } from "@/actions/post";

interface PageProps {
  params: { id: string };
}

export const generateMetadata = async ({ params }: PageProps) => {
  const { data } = await getPostByIdWithCLI_ID(Number(params.id));
  const artworkName = data?.title || "Artwork";

  return {
    title: `${artworkName} - Edit`,
    description: `Edit page for ${artworkName}`,
  };
};

const Page = async ({ params }: PageProps) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("NO USER USER.TS ");
    return;
  }

  const { data: post, error: postError } = await getPostByIdWithCLI_ID(
    Number(params.id)
  );

  if (postError || !post) redirect("/not-found");

  const authorIdOfPost = await getPostAuthorId(post?.id);

  if (authorIdOfPost !== user?.id) redirect("/not-found");

  return (
    <div className="w-full flex items-center justify-center pt-16 md:pt-24">
      <PostEditor post={post} />
    </div>
  );
};

export default Page;
