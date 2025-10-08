import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

const SearchBar = () => {
  return (
    <div className={cn("flex", "items-center", "gap-2", "relative", "w-1/3")}>
      <Search color="#7d7d7d" className="absolute ml-3 hidden sm:block" />
      <Input
        placeholder="Search works"
        id="search"
        className="sm:pl-10"
      ></Input>
    </div>
  );
};

export default SearchBar;
