"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "elevated" | "research";
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  hover = true,
  onClick,
}) => {
  // Carbon cards are flat: a border, no drop shadow, no rounding, no
  // lift-on-hover — just a border-color change.
  const baseClasses = `
    relative overflow-hidden
    transition-colors duration-300
    ${onClick ? "cursor-pointer" : ""}
  `;

  const variantClasses = {
    default: "bg-bg-card border border-border-color",
    bordered: "bg-bg-card border-2 border-border-color",
    elevated: "bg-bg-card border border-carbon-border-strong-01",
    research:
      "bg-bg-card border border-border-color border-l-4 border-l-primary-500 bg-gradient-to-r from-link-subtle via-bg-card to-bg-card",
  };

  const hoverClasses = hover ? "hover:border-primary-500" : "";

  const classes = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  // No entrance animation here on purpose — this renders once per card in
  // grids/lists across the site, each with its own viewport observer; that
  // was a real source of scroll jank on mobile. whileTap is the one bit of
  // motion worth keeping: it's interaction feedback, not decoration.
  return (
    <motion.div className={classes} onClick={onClick} whileTap={onClick ? { scale: 0.98 } : {}}>
      {children}
    </motion.div>
  );
};

export default Card;