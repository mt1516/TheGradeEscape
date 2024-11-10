'use client';

import { useEffect } from "react";
import Credit from "@/app/ui/credits/credit";
import Close from "@/app/ui/credits/button";

export default function Page() {
    let timeoutValue: number = 20;
    useEffect(() => {
        setTimeout(function () {
            location.href = "/";
        }, timeoutValue * 1000);
    })
    return (
        <>
            <Close />
            <Credit creditTimeout={timeoutValue} />
        </>
    );
}