"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useSafeNavigate } from "@/utils/safeNavigate";

interface SafeLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export const SafeLink = ({ href, children, className }: SafeLinkProps) => {
  const { safeNavigate } = useSafeNavigate();

  return (
    <Link href={href}>
      <span
        className={className || "cursor-pointer"}
        onClick={async (e) => {
          e.preventDefault();
          await safeNavigate(href);
        }}
      >
        {children}
      </span>
    </Link>
  );
};
