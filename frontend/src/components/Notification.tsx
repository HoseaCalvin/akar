"use client";

import { Bell } from "lucide-react"

export default function Notification() {
    return(
        <div className="p-3 rounded-xl glass-effect">
            <Bell
                className="w-auto h-7"
            />
        </div>
    )
}