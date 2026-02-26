"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps { content: string; children: React.ReactNode; side?: "top" | "bottom" | "left" | "right"; }

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  const [show, setShow] = useState(false);
  const posClass = { top: "bottom-full mb-2 left-1/2 -translate-x-1/2", bottom: "top-full mt-2 left-1/2 -translate-x-1/2", left: "right-full mr-2 top-1/2 -translate-y-1/2", right: "left-full ml-2 top-1/2 -translate-y-1/2" }[side];
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className={`absolute ${posClass} z-50 whitespace-nowrap px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 shadow-lg`}>
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
