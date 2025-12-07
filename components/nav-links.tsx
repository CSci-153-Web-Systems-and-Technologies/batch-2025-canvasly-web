"use client"; // This component will be client-only

import Link from "next/link";
import { Button } from "./ui/button";
import { navItems } from "@/lib/constants";
import { useSafeNavigate } from "@/utils/safeNavigate";

const NavLinks = () => {
  const { safeNavigate } = useSafeNavigate();

  return (
    <div className="w-full border-b-2 border-b-foreground/10 h-10 px-4 text-sm hidden md:block">
      <div className="flex items-center flex-row">
        {navItems.map((item) => (
          <Link href={item.href} key={item.name}>
            <span
              className="cursor-pointer"
              onClick={async (e) => {
                e.preventDefault();
                await safeNavigate(item.href);
              }}
            >
              <Button className="p-2" variant="link">
                {item.name}
              </Button>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavLinks;
