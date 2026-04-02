"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  highlight?: string;
};

export function FeatureCard({
  title,
  description,
  icon,
  highlight,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,246,250,0.1),rgba(249,246,250,0.04))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl md:min-h-[170px]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(175,152,228,0.18),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#41234e,#4632c9)] text-lg text-white shadow-[0_14px_28px_rgba(70,50,201,0.35)]">
          {icon}
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#e9def4]">
            <span>{title}</span>
            {highlight && (
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium normal-case tracking-normal text-white">
                {highlight}
              </span>
            )}
          </div>
          <p className="text-sm leading-7 text-[#d0c2e2] md:text-base">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
