"use client";

import AdminMenu from "@/components/AdminMenu";
import Notification from "@/components/Notification";

export default function TopBar() {
    return(
        <section className="absolute top-4 right-4 flex justify-between items-center gap-x-2.5">
            <Notification/>
            <AdminMenu/>
        </section>
    )
}