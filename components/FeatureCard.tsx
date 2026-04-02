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
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-lg md:min-h-[140px]"
    >
      <div className="relative flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-lg text-white shadow-md">
          {icon}
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-300">
            <span>{title}</span>
            {highlight && (
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium normal-case tracking-normal text-gray-100">
                {highlight}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-gray-400 md:text-base">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

