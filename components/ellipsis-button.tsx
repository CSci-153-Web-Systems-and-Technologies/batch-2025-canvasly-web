"use client";

import React, { useEffect, useState, useRef, RefObject } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";
import { Ellipsis } from "lucide-react";
import { createClient } from "@/lib/client";

type Props = {
  dataAuthor: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const EllipsisButton = ({ dataAuthor, onEdit, onDelete }: Props) => {
  const supabase = createClient();
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [open, setOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  // Load current user once
  useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const uid = data?.session?.user?.id;
      if (uid) setCurrentUserId(uid);
    };
    loadUser();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  const isAuthor = currentUserId === dataAuthor;

  // Compute menu position
  const computePosition = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 8;
    const menuWidth = 220; // adjust as needed
    const left = rect.left + window.scrollX + rect.width - menuWidth;
    setMenuPos({ top, left: Math.max(8, left) });
  };

  const openMenu = () => {
    computePosition();
    setOpen(true);
  };

  // Reposition on scroll/resize
  useEffect(() => {
    if (!open) return;
    const onScroll = () => computePosition();
    const onResize = () => computePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;

    const handleDocClick = (e: MouseEvent) => {
      const menu = menuRef.current;
      const btn = buttonRef.current;
      const target = e.target as Node;
      if (menu && menu.contains(target)) return;
      if (btn && btn.contains(target)) return;
      setOpen(false);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // Mounted flag to avoid SSR issues
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!isAuthor) return <div className="w-10 sm:w-12 md:w-11 lg:w-10" />;

  // Menu component
  const menu = (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        top: menuPos.top,
        left: menuPos.left,
        zIndex: 999999,
        minWidth: 220,
      }}
      className="bg-white shadow-xl rounded-xl p-2 flex flex-col gap-1"
    >
      <Button
        variant="ghost"
        className="w-full justify-center text-center"
        onClick={() => {
          setOpen(false);
          onEdit?.();
        }}
      >
        Edit
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-center text-center text-red-600"
        onClick={() => {
          setOpen(false);
          onDelete?.();
        }}
      >
        Delete
      </Button>
    </div>
  );

  return (
    <>
      <Button
        ref={buttonRef as RefObject<HTMLButtonElement>}
        className="rounded-full w-9"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          if (open) setOpen(false);
          else openMenu();
        }}
      >
        <Ellipsis />
      </Button>

      {mounted && open && typeof document !== "undefined"
        ? createPortal(menu, document.body)
        : null}
    </>
  );
};

export default EllipsisButton;
