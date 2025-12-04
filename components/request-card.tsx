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

const RequestCard = () => {
  const supabase = createClient();
  const [sellerId, setSellerId] = useState<string | null>(null);

  // Fetch authenticated user ID
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) setSellerId(user.id);
    };
    checkUser();
  }, []);

  const take = 10;

  // Infinite Query for requests
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["requests", sellerId],
    enabled: !!sellerId,
    queryFn: async ({ pageParam = null }) => {
      const url = `/api/request?sellerId=${sellerId}&take=${take}${
        pageParam ? `&cursor=${pageParam}` : ""
      }`;

      const res = await fetch(url);

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData?.error || "Failed to fetch requests");
        throw new Error(errorData?.error || "Failed to fetch requests");
      }

      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const queryClient = useQueryClient();

  // Accept mutation
  const acceptMutation = useMutation({
    mutationFn: async (purchaseId: number) => {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseId,
          sellerId,
          action: "accept",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast.success("Request accepted");
      queryClient.invalidateQueries(["requests", sellerId]);
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async (purchaseId: number) => {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseId,
          sellerId,
          action: "reject",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast.success("Request rejected");
      queryClient.invalidateQueries(["requests", sellerId]);
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Skeleton loading UI (copied exactly from PurchaseCard)
  if (!sellerId || isLoading)
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

  const allRequests = data?.pages.flatMap((page: any) => page.requests) ?? [];

  // No requests UI
  if (allRequests.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-gray-600">
        <p className="text-lg font-medium">No purchase requests</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-1 w-full">
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.requests.map((request: any) => (
            <div
              key={request.id}
              className="flex flex-col gap-4 border rounded-md p-4 bg-white "
            >
              {/* Buyer Info */}
              <div className="flex items-center gap-3">
                <Link
                  passHref
                  href={`/users/${request.buyer.id}?person=${request.buyer.username}`}
                >
                  <Avatar>
                    <AvatarImage
                      className="h-9 w-9 rounded-full object-cover"
                      src={request.buyer.image_url}
                    />
                    <AvatarFallback>
                      <UserRound className="h-9 w-9 text-gray-600" />
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex flex-col text-sm w-full">
                  <div className="flex justify-between w-full">
                    <p className="font-semibold truncate">
                      {request.buyer.username}
                    </p>
                    <p className="text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p>Wants to purchase your post</p>
                </div>
              </div>

              {/* Post Display */}
              <div className="flex flex-row gap-4 items-center w-full">
                <Link href={`/posts/${request.post.id}`}>
                  <div className="relative min-w-16 min-h-16 w-16 h-16">
                    <Image
                      src={request.post.image_post_url}
                      alt={request.post.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </Link>

                <div className="flex justify-between items-end w-full gap-4">
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">
                      {request.post.title}
                    </h3>
                    <p className="text-sm">Price: ${request.post.price}</p>
                    <p className="text-sm">Type: {request.post.art_type}</p>
                  </div>

                  {/* Desktop buttons */}
                  <div className="hidden md:flex gap-2">
                    <Button
                      className="bg-green-600 text-white"
                      disabled={acceptMutation.isPending}
                      onClick={() => acceptMutation.mutate(request.id)}
                    >
                      Accept
                    </Button>

                    <Button
                      variant="destructive"
                      disabled={rejectMutation.isPending}
                      onClick={() => rejectMutation.mutate(request.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mobile buttons */}
              <div className="flex md:hidden flex-col gap-2 mt-4">
                <Button
                  className="bg-green-600 text-white"
                  disabled={acceptMutation.isPending}
                  onClick={() => acceptMutation.mutate(request.id)}
                >
                  Accept
                </Button>

                <Button
                  variant="destructive"
                  disabled={rejectMutation.isPending}
                  onClick={() => rejectMutation.mutate(request.id)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}

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

export default RequestCard;
