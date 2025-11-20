"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Search } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import Link from "next/link";
import { searchPosts } from "@/actions/post";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filter, setFilter] = useState("Artwork");

  const dropdownRef = useRef(null); // 👈 dropdown element reference

  // 🔍 Live search (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchPosts(query);
      setResults(res?.data || []);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // 👇 CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setQuery(""); // close dropdown
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative ml-3 sm:ml-2 md:ml-0 md:mr-2 lg:mr-0 w-full md:w-1/2"
      ref={dropdownRef}
    >
      <Search
        color="#7d7d7d"
        className="absolute ml-3 hidden sm:block top-1/2 -translate-y-1/2"
      />

      <Input
        placeholder="Search works"
        id="search"
        className="sm:pl-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {
        <div
          className={`p-2 absolute top-full left-0 w-full mt-2 bg-white border rounded-lg shadow-md max-h-72 overflow-y-auto z-[999] transition-opacity ${
            query
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* LOADING SKELETON */}
          {isSearching &&
            query &&
            Array(2)
              .fill(0)
              .map((_, i) => (
                <div className="flex flex-col w-full gap-3 mb-2" key={i}>
                  <div className="flex flex-row w-full gap-2">
                    <Skeleton className="w-12 h-12 shrink-0" />
                    <div className="flex flex-col justify-center gap-1.5 w-full truncate">
                      <Skeleton className="h-3 w-2/5" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}

          {/* NO RESULTS */}
          {!isSearching && query && results.length === 0 && (
            <div className="p-3 text-sm text-gray-400">No results found</div>
          )}

          {/* RESULTS */}
          {!isSearching && query && results.length > 0 && (
            <div className="flex flex-col w-full h-full gap-5">
              <ToggleGroup
                type="single"
                value={filter}
                onValueChange={(val) => val && setFilter(val)}
                className="flex flex-row w-full md:w-1/3 h-5 gap-2 mt-2.5"
              >
                <ToggleGroupItem value="Artwork">Artwork</ToggleGroupItem>
                <ToggleGroupItem value="Users">Users</ToggleGroupItem>
              </ToggleGroup>

              {results.map((post) => (
                <div className="w-full h-full flex flex-col" key={post?.id}>
                  <Link
                    href={`/posts/${post?.id}`}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 transition"
                    onClick={() => setQuery("")} // close when selecting item
                  >
                    <div className="relative w-14 h-14 shrink-0">
                      <Image
                        src={post?.image_post_url}
                        alt={post?.title || "Post Image"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {post?.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        by {post?.author.username}
                      </div>
                    </div>
                  </Link>

                  <Separator />
                </div>
              ))}
            </div>
          )}
        </div>
      }
    </div>
  );
};

export default SearchBar;

/*

"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import Link from "next/link";
import { searchPosts } from "@/actions/post";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filter, setFilter] = useState("Artwork");

  // 🔍 Live search (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchPosts(query);
      setResults(res?.data || []);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative ml-3 sm:ml-2 md:ml-0 md:mr-2 lg:mr-0 w-full md:w-1/2">
      <Search
        color="#7d7d7d"
        className="absolute ml-3 hidden sm:block top-1/2 -translate-y-1/2"
      />

      <Input
        placeholder="Search works"
        id="search"
        className="sm:pl-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

   
      <div
        className={`
          p-2 bg-white border shadow-md overflow-y-auto z-[999] transition-opacity
          ${
            query
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }

      
          hidden sm:block absolute top-full left-0 w-full mt-2 rounded-lg max-h-72 

       
          sm:hidden fixed inset-0 w-full h-screen rounded-none
        `}
      >
    
        <button
          onClick={() => setQuery("")}
          className="sm:hidden absolute top-4 right-4 bg-black/80 text-white px-3 py-1.5 rounded-md text-sm"
        >
          Close
        </button>

      
        <div className="sm:mt-0 mt-12">
 
          {isSearching &&
            query &&
            Array(2)
              .fill(0)
              .map((_, i) => (
                <div className="flex flex-col w-full gap-3 mb-2" key={i}>
                  <div className="flex flex-row w-full gap-2">
                    <Skeleton className="w-12 h-12 shrink-0" />
                    <div className="flex flex-col justify-center gap-1.5 w-full truncate">
                      <Skeleton className="h-3 w-2/5" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}

  
          {!isSearching && query && results.length === 0 && (
            <div className="p-3 text-sm text-gray-400">No results found</div>
          )}

          {!isSearching && query && results.length > 0 && (
            <div className="flex flex-col w-full h-full gap-5">
              <ToggleGroup
                type="single"
                value={filter}
                onValueChange={(val) => val && setFilter(val)}
                className="flex flex-row w-full md:w-1/3 h-5 gap-2 mt-2.5"
              >
                <ToggleGroupItem value="Artwork">Artwork</ToggleGroupItem>
                <ToggleGroupItem value="Users">Users</ToggleGroupItem>
              </ToggleGroup>

              {results.map((post) => (
                <div className="w-full h-full flex flex-col" key={post?.id}>
                  <Link
                    href={`/posts/${post?.id}`}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 transition"
                    onClick={() => setQuery("")}
                  >
                    <div className="relative w-14 h-14 shrink-0">
                      <Image
                        src={post?.image_post_url}
                        alt={post?.title || "Post Image"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {post?.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        by {post?.author.username}
                      </div>
                    </div>
                  </Link>
                  <Separator />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;


*/
