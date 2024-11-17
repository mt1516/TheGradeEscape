'use client';

import { useEffect } from "react";
import Credit from "@/app/ui/credits/credit";
import Close from "@/app/ui/credits/button";
import { initializeStorage } from "@/app/game/storage";

export default function Page() {
    initializeStorage();
    useEffect(() => {
        setTimeout(function () {
            location.href = "/";
        }, 20 * 1000);
    })
    return (
        <div className="relative">
            <Close />
            <div className="flex justify-center items-center h-screen">
                <Credit />
            </div>
        </div>
    );
}