"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Tooltip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode | string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className="relative inline-block font-semibold"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 z-50 mb-3 w-64 -translate-x-1/2 rounded-xl p-3 shadow-2xl text-left pointer-events-none font-normal block"
            style={{ 
              backgroundColor: 'var(--panel)', 
              border: '1px solid var(--line)', 
              color: 'var(--ink)', 
              fontSize: '0.8rem',
              lineHeight: '1.4'
            }}
          >
            {content}
            <span 
              className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 block"
              style={{ 
                backgroundColor: 'var(--panel)', 
                borderBottom: '1px solid var(--line)', 
                borderRight: '1px solid var(--line)' 
              }}
            />
          </motion.span>
        )}
      </AnimatePresence>
      <span 
        className="cursor-help transition-colors" 
        style={{ 
          textDecorationLine: 'underline', 
          textDecorationStyle: 'dashed', 
          textDecorationColor: 'var(--muted)', 
          textUnderlineOffset: '4px',
          color: isHovered ? 'var(--hot)' : 'inherit'
        }}
      >
        {children}
      </span>
    </span>
  );
};
