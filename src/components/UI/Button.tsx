import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  external?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  icon,
  external = false,
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold tracking-wide
    border-2 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${disabled || loading ? "pointer-events-none" : ""}
  `;

  const variantClasses = {
    primary:
      "bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700 hover:-translate-y-0.5 hover:shadow-lg",
    secondary:
      "bg-white text-primary-600 border-primary-600 hover:bg-primary-50 hover:border-primary-700 hover:-translate-y-0.5",
    ghost:
      "bg-transparent text-text-primary border-transparent hover:bg-neutral-100 hover:text-primary-600",
    outline:
      "bg-transparent text-text-primary border-neutral-300 hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-md",
    md: "px-6 py-3 text-base rounded-lg",
    lg: "px-8 py-4 text-lg rounded-lg",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const buttonContent = (
    <>
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {icon && !loading && icon}
      <span>{children}</span>
    </>
  );

  const motionProps = {
    whileTap: disabled || loading ? {} : { scale: 0.98 },
    transition: { duration: 0.1 },
  };

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...motionProps}
      >
        {buttonContent}
        {external && (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...motionProps}
    >
      {buttonContent}
    </motion.button>
  );
};

export default Button;