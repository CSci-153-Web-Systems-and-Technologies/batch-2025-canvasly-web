import PostEditor from "@/components/post-editor";
import React from "react";
import { redirect } from "next/navigation";
import { getPostByIdWithCLI_ID, getPostAuthorId } from "@/actions/post";
import { createClient } from "@/lib/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

/* -------------------------------------------------------------------------- */
/*                         FIXED generateMetadata()                           */
/* -------------------------------------------------------------------------- */
export const generateMetadata = async ({ params }: PageProps) => {
  const { id } = await params; // FIX: Next.js params is now a Promise

  const { data } = await getPostByIdWithCLI_ID(Number(id));

  const artworkName = data?.title || "Artwork";

  return {
    title: `${artworkName} - Edit`,
    description: `Edit page for ${artworkName}`,
  };
};

/* -------------------------------------------------------------------------- */
/*                                FIXED PAGE                                  */
/* -------------------------------------------------------------------------- */
const Page = async ({ params }: PageProps) => {
  const { id } = await params; // FIX: must await

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("NO USER USER.TS");
    return;
  }

  const { data: post, error: postError } = await getPostByIdWithCLI_ID(
    Number(id)
  );

  if (postError || !post) redirect("/not-found");

  const authorIdOfPost = await getPostAuthorId(post.id);

  if (authorIdOfPost !== user.id) redirect("/not-found");

  return (
    <div className="w-full flex items-center justify-center pt-16 md:pt-24">
      <PostEditor post={post} />
    </div>
  );
};

export default Page;
