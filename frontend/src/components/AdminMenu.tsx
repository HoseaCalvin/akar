"use client";

import { ChevronDown, CircleUser } from "lucide-react";

interface AdminMenuProps {
    username: string;
}

export default function AdminMenu() {
    return(
        <menu className="flex gap-x-3 p-3 rounded-xl glass-effect">
            <div className="flex items-center gap-x-2">
                <CircleUser
                    className="w-auto h-7"
                />
                <h1 className="font-semibold">Admin</h1>
            </div>
            <ChevronDown
                className="w-5 h-auto"
            />
        </menu>
    )
}