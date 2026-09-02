"use client";

import { ChevronDown, CircleUser } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function AdminMenu() {
  const { data: session } = authClient.useSession();
  const username = session?.user?.name ?? "Admin";

  return (
    <menu className="flex gap-x-3 p-3 rounded-xl glass-effect">
      <div className="flex items-center gap-x-2">
        <CircleUser className="w-auto h-7" />
        <h1 className="font-semibold">{username}</h1>
      </div>
      <ChevronDown className="w-5 h-auto" />
    </menu>
  );
}
