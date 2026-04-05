"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import AnimatedGlowingSearchBar from "@/components/ui/animated-glowing-search-bar";
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
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredLinks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return links;
    }

    return links.filter((item) => {
      const label = "labelHome" in item ? item.labelHome : item.label;
      return label.toLowerCase().includes(normalizedQuery);
    });
  }, [query]);

  const navContent = (
    <div className="flex h-full flex-col rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,246,250,0.08),rgba(249,246,250,0.03))] p-4 shadow-[0_28px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <div className="border-b border-white/10 px-2 pb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-[#ccb9df]">
          Workspace
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
          Synapse
        </p>
        <p className="mt-2 text-sm leading-6 text-[#d1c3e3]">
          Jump between study modes without hunting for the workspace section.
        </p>
      </div>

      <div className="mt-4 px-1">
        <AnimatedGlowingSearchBar
          value={query}
          onChange={setQuery}
          className="origin-top-left scale-[0.85]"
        />
      </div>

      <div className="mt-4 space-y-2">
        {filteredLinks.map((item) => {
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
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-[linear-gradient(135deg,#f9f6fa_0%,#dbc9f3_42%,#af98e4_100%)] text-[#1b1026] shadow-[0_16px_36px_rgba(70,50,201,0.24)]"
                  : "bg-[rgba(249,246,250,0.04)] text-[#e8ddf3] hover:bg-[rgba(249,246,250,0.1)] hover:text-white",
              )}
            >
              <span>{label}</span>
              <span
                className={cn("text-xs", active ? "text-[#513764]" : "text-[#c8b7da]")}
              >
                {"0" + (links.indexOf(item) + 1)}
              </span>
            </Link>
          );
        })}

        {filteredLinks.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[rgba(249,246,250,0.04)] px-4 py-4 text-sm leading-6 text-[#d1c3e3]">
            No study modes match that search yet.
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="fixed left-4 top-24 z-40 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(7,3,12,0.88)] px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-xl lg:hidden"
      >
        <span className="space-y-1">
          <span className="block h-0.5 w-4 rounded-full bg-white" />
          <span className="block h-0.5 w-4 rounded-full bg-white" />
          <span className="block h-0.5 w-4 rounded-full bg-white" />
        </span>
        Menu
      </button>

      <aside className="hidden w-72 shrink-0 lg:block">{navContent}</aside>

      {isOpen ? (
        <div className="fixed inset-0 z-30 bg-[rgba(4,2,7,0.68)] backdrop-blur-sm lg:hidden">
          <button
            type="button"
            aria-label="Close workspace menu"
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-4 top-24 bottom-4 z-10 w-[min(78vw,320px)]">
            {navContent}
          </div>
        </div>
      ) : null}
    </>
  );
}
