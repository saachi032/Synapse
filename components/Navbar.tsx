"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChangeEvent } from "react";

type NavbarProps = {
  isUploading: boolean;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function Navbar({ isUploading, onUpload }: NavbarProps) {
  return (
    <motion.header
      className="w-full border-b border-white/10 bg-black/40 backdrop-blur-lg"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-[#a855f7] via-[#6366f1] to-[#22d3ee] shadow-[0_0_24px_rgba(129,140,248,0.9)]" />
          
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-white tracking-tight">
              Synapse
            </span>
            <span className="text-[11px] text-zinc-400">
              Your ambient study copilot
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <label className="relative inline-flex items-center">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={onUpload}
              disabled={isUploading}
            />

            <Button
              asChild
              className="cursor-pointer bg-gradient-to-r from-[#a855f7] via-[#6366f1] to-[#22d3ee] text-sm font-medium shadow-[0_0_32px_rgba(129,140,248,0.75)] transition-all duration-300 ease-out hover:brightness-110 hover:shadow-[0_0_42px_rgba(129,140,248,0.95)] hover:-translate-y-[1px]"
            >
              <span>
                {isUploading ? "Processing PDF..." : "Upload PDF"}
              </span>
            </Button>
          </label>
        </div>

      </div>
    </motion.header>
  );
}