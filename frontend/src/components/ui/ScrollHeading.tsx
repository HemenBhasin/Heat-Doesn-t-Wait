"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollHeadingProps {
  children: React.ReactNode;
  accentEffect?: "underlineDraw" | "glowHalo" | "none";
  accentColor?: string;
  textAlign?: React.CSSProperties["textAlign"];
}

export function ScrollHeading({ 
  children, 
  accentEffect = "underlineDraw",
  accentColor = "var(--hot)",
  textAlign = "left"
}: ScrollHeadingProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "center center"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.1, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const accentProgress = useTransform(scrollYProgress, [0.4, 1], [0, 1]);

  return (
    <motion.div ref={ref} style={{ position: "relative", opacity, scale, width: "100%" }}>
      {accentEffect === "glowHalo" && (
        <motion.div style={{
          position: "absolute",
          top: "50%", 
          left: textAlign === "center" ? "50%" : "20%",
          x: "-50%",
          y: "-50%",
          width: "clamp(150px, 50%, 400px)",
          height: "clamp(50px, 80%, 140px)",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${accentColor}, transparent 70%)`,
          opacity: useTransform(accentProgress, [0, 1], [0, 0.22]),
          filter: useTransform(accentProgress, v => `blur(${30 + v * 15}px)`),
          pointerEvents: "none",
          zIndex: 0
        }} />
      )}
      
      <div style={{ position: "relative", zIndex: 1, textAlign }}>
        {children}
      </div>

      {accentEffect === "underlineDraw" && (
        <motion.div style={{
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
          width: useTransform(accentProgress, [0, 1], ["0%", textAlign === "center" ? "40%" : "30%"]),
          marginTop: 12,
          marginLeft: textAlign === "center" ? "auto" : 0,
          marginRight: textAlign === "center" ? "auto" : undefined,
        }} />
      )}
    </motion.div>
  );
}
