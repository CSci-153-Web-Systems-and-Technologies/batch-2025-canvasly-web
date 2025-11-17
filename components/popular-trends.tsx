import { getPopularTrebds } from "@/actions/post";
import { QueryClient } from "@tanstack/react-query";
import { console } from "inspector";
import { Hash } from "lucide-react";
import React from "react";

const PopularTrends = async () => {
  const queryClient = new QueryClient();
  try {
    const { data } = await queryClient.fetchQuery({
      queryKey: ["trends"],
      queryFn: getPopularTrebds,
      staleTime: 1000 * 60 * 60 * 24,
    });

    return (
      <div className="p-4 relative w-full h-full rounded-lg bg-white flex flex-col gap-7">
        <div className="flex flex-col gap-2 w-full h-full">
          <h1 className="text-2xl"># Trending</h1>
        </div>

        <div className="flex flex-col gap-4">
          {data.map((trend, i) => (
            <div className="flex flex-row gap-2 items-center" key={i}>
              <div className="flex flex-col">
                <span className="font-semibold ">{`#${trend.name}`}</span>

                <span className="font-semibold text-sm text-[#666666]">
                  {trend?._count?.name}{" "}
                  {trend?._count?.name > 1 ? "posts" : "post"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (e) {
    console.log(e);

    return <div>Error Unable to fetch popular trends {`(error)`}</div>;
  }
};

export default PopularTrends;
