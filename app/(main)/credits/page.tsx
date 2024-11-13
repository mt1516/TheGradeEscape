'use client';

import { useEffect } from "react";
import Credit from "@/app/ui/credits/credit";
import Close from "@/app/ui/credits/button";

export default function Page() {
    useEffect(() => {
        setTimeout(function () {
            location.href = "/";
        }, 20 * 1000);
    })
    return (
        <>
            <Close />
            <Credit/>
        </>
    );
}