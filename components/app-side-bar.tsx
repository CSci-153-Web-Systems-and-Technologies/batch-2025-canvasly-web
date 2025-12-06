"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { navItems } from "@/lib/constants";
import { LogoutButton } from "./logout-button";
import Image from "next/image";

const AppSideBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <>
      {/* Hamburger button fixed at top-right */}
      <Button
        variant="ghost"
        className="md:hidden fixed top-4 right-4 z-[100] rounded-full p-2"
        onClick={toggleMenu}
      >
        <Menu color="#666666" />
      </Button>

      {/* Sidebar overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-[50] transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />

      {/* Sidebar panel sliding from the right */}
      <div
        className={`fixed top-0 right-0 h-screen w-52 bg-white border-l z-[60] transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <Link href={"/"}>
          <Image
            src="/CanvaslySideBarLogo.png"
            alt="logo"
            width={100}
            height={50}
            className="mt-5 ml-4"
          />
        </Link>
        <nav className="flex flex-col py-4 pr-4 pl-2 gap-1 mt-6">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                className="w-full text-left justify-start p-4"
                variant="link"
              >
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-10 justify-start py-4 pr-4 pl-2">
          <LogoutButton
            variant="link"
            compoenentClassName="w-full text-left justify-start p-4"
          />
        </div>
      </div>
    </>
  );
};

export default AppSideBar;
