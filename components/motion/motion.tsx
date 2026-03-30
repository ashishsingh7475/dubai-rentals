"use client";

import { motion, type MotionProps } from "framer-motion";

export const MotionDiv = motion.div;
export const MotionMain = motion.main;

export const pageTransition: MotionProps = {
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: 10, filter: "blur(6px)" },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
};

export const fadeInUp: MotionProps = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

