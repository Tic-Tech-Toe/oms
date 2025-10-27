"use client";

import { useEffect, useRef, useState } from "react";

export default function CollapsibleWrapper({ open, children }: { open: boolean; children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [maxH, setMaxH] = useState<string>("0px");

    useEffect(() => {
        if (!ref.current) return;
        if (open) {
            const h = ref.current.scrollHeight;
            setMaxH(`${h}px`);
            const t = setTimeout(() => setMaxH("none"), 350);
            return () => clearTimeout(t);
        } else {
            const h = ref.current.scrollHeight;
            setMaxH(`${h}px`);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setMaxH("0px"));
            });
        }
    }, [open]);

    return (
        <div
            ref={ref}
            style={{
                maxHeight: maxH,
                overflow: "hidden",
                transition: "max-height 280ms ease-in-out",
            }}
            aria-hidden={!open}
        >
            {children}
        </div>
    );
}