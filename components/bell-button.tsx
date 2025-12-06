"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import NotificationsDropdown from "./notifications-dropdown"; // <-- import your dropdown

interface Props {
  userId: string;
}

export default function BellButton({ userId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative rounded-full">
      <Button variant="ghost" onClick={() => setOpen(!open)}>
        <Bell color="#628b35" />
      </Button>

      {open && <NotificationsDropdown userId={userId} />}
    </div>
  );
}
