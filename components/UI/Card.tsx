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
  const baseClasses = `
    relative rounded-xl overflow-hidden
    transition-all duration-300
    ${onClick ? "cursor-pointer" : ""}
  `;

  const variantClasses = {
    default: "bg-bg-card border border-border-color shadow-card",
    bordered: "bg-bg-card border-2 border-border-color",
    elevated: "bg-bg-card border border-border-color shadow-lg",
    research:
      "bg-bg-card border border-border-color shadow-card border-l-4 border-l-primary-500 bg-gradient-to-r from-link-subtle via-bg-card to-bg-card",
  };

  const hoverClasses = hover
    ? "hover:-translate-y-1 hover:shadow-card-hover hover:border-primary-400"
    : "";

  const classes = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  return (
    <motion.div
      className={classes}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.div>
  );
};

export default Card;