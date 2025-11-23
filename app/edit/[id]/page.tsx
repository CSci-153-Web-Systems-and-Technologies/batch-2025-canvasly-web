import PostEditor from "@/components/post-editor";
import React from "react";
import { redirect } from "next/navigation";
import { getPostByIdWithCLI_ID } from "@/actions/post";

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
  const { data: post, error: postError } = await getPostByIdWithCLI_ID(
    Number(params.id)
  );

  if (postError || !post) redirect("/not-found");

  return (
    <div className="w-full flex items-center justify-center pt-24">
      {/* pass the post to PostEditor */}
      <PostEditor post={post} />
    </div>
  );
};

export default Page;
