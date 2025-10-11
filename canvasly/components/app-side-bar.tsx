"use client";

import React from "react";
import { navItems } from "@/lib/constants";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoutButton } from "./logout-button";

const AppSideBar = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className=" ">
      {menuOpen ? (
        <Button
          variant="ghost"
          className="md:hidden bg-color-background rounded-3xl p-2 hover:bg-[#ededed]"
          onClick={toggleMenu}
        >
          <Menu color="#666666" />
        </Button>
      ) : (
        <div className="flex flex-col border-r md:hidden w-52 relative bg-white border">
          <Button
            variant="ghost"
            className="md:hidden bg-color-background rounded-3xl p-2 hover:bg-[#ededed] flex absolute right-0"
            onClick={toggleMenu}
          >
            <X color="#666666" />
          </Button>
          {navItems.map((item) => (
            <Link href={item.href} key={item.name}>
              <Button className="p-2" variant="link">
                {item.name}
              </Button>
            </Link>
          ))}
          <div className="mt-5">
            <LogoutButton variant="link" compoenentClassName="p-2" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppSideBar;
