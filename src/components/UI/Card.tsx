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
    default: "bg-white border border-border-color shadow-card",
    bordered: "bg-white border-2 border-neutral-200",
    elevated: "bg-white border border-border-color shadow-lg",
    research:
      "bg-white border border-border-color shadow-card border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-50/30 via-white to-white",
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