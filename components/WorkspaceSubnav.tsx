"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/workspace", labelHome: "Hub", exact: true },
  { href: "/workspace/summary", label: "Summary" },
  { href: "/workspace/flashcards", label: "Flashcards" },
  { href: "/workspace/quiz", label: "Quiz" },
  { href: "/workspace/ask", label: "Talk to AI" },
  { href: "/workspace/topics", label: "Topics" },
  { href: "/workspace/explain", label: "Explain" },
  { href: "/workspace/resources", label: "Resources" },
] as const;

export function WorkspaceSubnav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-white/10 bg-[#06060c]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6 py-3">
        {links.map((item) => {
          const isHub = "exact" in item && item.exact;
          const active = isHub
            ? pathname === "/workspace"
            : pathname === item.href;
          const label =
            "labelHome" in item ? item.labelHome : item.label;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                active
                  ? "bg-purple-500 text-white shadow-md shadow-purple-500/25"
                  : "bg-white/10 text-gray-200 hover:bg-white/15 hover:text-white",
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
