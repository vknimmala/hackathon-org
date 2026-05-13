"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export function FadeIn(props: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView={{ opacity: 1, y: 0 }}
      {...props}
    />
  );
}
