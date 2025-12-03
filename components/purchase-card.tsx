"use client";

import React, { useEffect, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "./ui/button";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/lib/client";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRound } from "lucide-react";
import Link from "next/link";

const PurchaseCard = () => {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch authenticated user ID
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }
    };
    checkUser();
  }, []);

  const take = 10;

  // Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["purchases", userId],
    enabled: !!userId,
    queryFn: async ({ pageParam = null }) => {
      const url = `/api/purchase?userId=${userId}&take=${take}${
        pageParam ? `&cursor=${pageParam}` : ""
      }`;

      const res = await fetch(url);

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData?.error || "Failed to fetch purchases");
        throw new Error(errorData?.error || "Failed to fetch purchases");
      }

      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: async ({ postId }: { postId: string }) => {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          buyerId: userId,
          action: "cancel",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel purchase");
      return data;
    },
    onSuccess: () => {
      toast.success("Purchase canceled");
      queryClient.invalidateQueries(["purchases", userId]); // 🔥 refresh list
    },
    onError: (err: any) => {
      toast.error(err.message || "Error canceling purchase");
    },
  });

  const handleCancel = (postId: string) => {
    if (cancelMutation.isPending) return;
    cancelMutation.mutate({ postId });
  };

  // Skeleton while loading
  if (!userId || isLoading)
    return (
      <div className="max-w-7xl mx-auto flex flex-col gap-1 w-full">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-md p-4 bg-white ">
            <div className="flex flex-row items-center gap-2 w-full">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex flex-col gap-2 max-w-44 w-full">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>

            {/* Image + text */}
            <div className="flex flex-row w-full gap-4">
              <Skeleton className="w-16 h-16 rounded-md" />
              <div className="flex flex-col gap-2 w-full max-w-sm">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );

  if (isError) return <div>Error: {(error as any).message}</div>;

  // No purchases message
  const allPurchases = data?.pages.flatMap((page: any) => page.purchases) ?? [];

  if (allPurchases.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-gray-600">
        <p className="text-lg font-medium">No pending purchases</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-1 w-full">
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.purchases.map((purchase: any) => (
            <div
              key={purchase.id}
              className="flex flex-col gap-4 border rounded-md p-4 bg-white "
            >
              {/* Seller info */}
              <div className="flex items-center gap-3">
                <Link
                  passHref
                  href={`/users/${purchase?.seller.id}?person=${purchase?.seller?.username}`}
                >
                  <Avatar>
                    <AvatarImage
                      className="h-9 w-9 rounded-full object-cover"
                      src={purchase.seller.image_url}
                      alt="@user"
                    />
                    <AvatarFallback>
                      <UserRound
                        color="#666666"
                        className="h-9 w-9 rounded-full"
                      />
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex flex-col text-sm w-full">
                  <div className="flex flex-row justify-between w-full min-w-0">
                    <Link
                      passHref
                      href={`/users/${purchase?.seller.id}?person=${purchase?.seller?.username}`}
                    >
                      {" "}
                      <p className="font-semibold truncate">
                        {purchase.seller.username}
                      </p>
                    </Link>
                    <p className="text-gray-500">
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p>You want to Purchase</p>
                </div>
              </div>

              {/* Post image + info */}
              <div className="flex flex-row gap-4 items-center w-full">
                <Link href={`/posts/${purchase.post.id}`}>
                  <div className="relative min-w-16 min-h-16 w-16 h-16">
                    <Image
                      src={purchase.post.image_post_url}
                      alt={purchase.post.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </Link>

                <div className="flex flex-row justify-between items-end w-full min-w-0">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-lg truncate">
                      {purchase.post.title}
                    </h3>
                    <p className="text-sm">Price: ${purchase.post.price}</p>
                    <p className="text-sm">Type: {purchase.post.art_type}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="hidden md:block"
                    disabled={cancelMutation.isPending}
                    onClick={() => handleCancel(purchase.post.id)}
                  >
                    {cancelMutation.isPending
                      ? "Canceling..."
                      : "Cancel Purchase"}
                  </Button>
                </div>
              </div>

              <Button
                variant="outline"
                className="md:hidden block w-full mt-6"
                disabled={cancelMutation.isPending}
                onClick={() => handleCancel(purchase.post.id)}
              >
                {cancelMutation.isPending ? "Canceling..." : "Cancel Purchase"}
              </Button>
            </div>
          ))}
        </React.Fragment>
      ))}

      {/* Load more button */}
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4"
          variant="outline"
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </Button>
      )}
    </div>
  );
};

export default PurchaseCard;
