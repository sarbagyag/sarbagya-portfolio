/** @type {import('tailwindcss').Config} */

// Wraps a CSS variable (stored as "R G B" channels in app/globals.css) so
// Tailwind can apply opacity modifiers to it, e.g. `bg-bg-dark/95`.
// See: https://tailwindcss.com/docs/customizing-colors#using-css-variables
const withOpacity = (cssVar) => `rgb(var(${cssVar}) / <alpha-value>)`;

module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // --- Carbon Design System color tokens ---
        // These reference CSS custom properties defined in app/globals.css:
        // `:root` holds the Carbon "White" (light) theme values, `.dark`
        // overrides them with Carbon "Gray 100" (dark) theme values. next-themes
        // toggles the `.dark` class on <html>, so every one of these tokens
        // (and the semantic bg-*/text-*/border-color/link* aliases below,
        // which reuse the same variables) is theme-aware for free — no
        // per-component `dark:` variants needed.
        carbon: {
          background: withOpacity("--cds-background"),
          "layer-01": withOpacity("--cds-layer-01"),
          "layer-02": withOpacity("--cds-layer-02"),
          "layer-03": withOpacity("--cds-layer-03"),
          "layer-hover-01": withOpacity("--cds-layer-hover-01"),
          "layer-hover-02": withOpacity("--cds-layer-hover-02"),
          "border-subtle-00": withOpacity("--cds-border-subtle-00"),
          "border-subtle-01": withOpacity("--cds-border-subtle-01"),
          "border-strong-01": withOpacity("--cds-border-strong-01"),
          "text-primary": withOpacity("--cds-text-primary"),
          "text-secondary": withOpacity("--cds-text-secondary"),
          "text-placeholder": withOpacity("--cds-text-placeholder"),
          "text-on-color": withOpacity("--cds-text-on-color"),
          "icon-primary": withOpacity("--cds-icon-primary"),
          "icon-secondary": withOpacity("--cds-icon-secondary"),
          "link-primary": withOpacity("--cds-link-primary"),
          "link-primary-hover": withOpacity("--cds-link-primary-hover"),
          focus: withOpacity("--cds-focus"),
          "support-error": withOpacity("--cds-support-error"),
          "support-success": withOpacity("--cds-support-success"),
          "support-warning": withOpacity("--cds-support-warning"),
          "support-info": withOpacity("--cds-support-info"),
        },
        // Carbon Blue scale (interactive/primary accent) — Carbon's numbered
        // color ramps are theme-invariant (same hex in both themes); only
        // which *token* points at which step of the ramp changes.
        primary: {
          50: "#edf5ff",
          100: "#d0e2ff",
          200: "#a6c8ff",
          300: "#78a9ff",
          400: "#4589ff",
          500: "#0f62fe",
          600: "#0043ce",
          700: "#002d9c",
          800: "#001d6c",
          900: "#001141",
        },
        // Carbon Teal scale (secondary accent, replaces old "academic green")
        accent: {
          50: "#d9fbfb",
          100: "#9ef0f0",
          200: "#3ddbd9",
          300: "#08bdba",
          400: "#009d9a",
          500: "#007d79",
          600: "#005d5d",
          700: "#004144",
          800: "#022b30",
          900: "#081a1c",
        },
        // Carbon Gray scale
        neutral: {
          50: "#f4f4f4",
          100: "#e0e0e0",
          200: "#c6c6c6",
          300: "#a8a8a8",
          400: "#8d8d8d",
          500: "#6f6f6f",
          600: "#525252",
          700: "#393939",
          800: "#262626",
          900: "#161616",
          950: "#0d0d0d",
        },
        // Semantic aliases used throughout existing components — theme-aware
        // via the same CSS variables as `carbon.*` above.
        "bg-primary": withOpacity("--cds-background"),
        "bg-secondary": withOpacity("--cds-layer-01"),
        "bg-dark": withOpacity("--cds-background"),
        "bg-card": withOpacity("--cds-layer-01"),
        "text-primary": withOpacity("--cds-text-primary"),
        "text-secondary": withOpacity("--cds-text-secondary"),
        "text-tertiary": withOpacity("--cds-text-placeholder"),
        "border-color": withOpacity("--cds-border-subtle-00"),
        // Accent/interactive text color (icons, inline links, active nav
        // state) — Blue 60 on light backgrounds, Blue 40 on dark, per
        // Carbon's own light-on-dark contrast guidance.
        link: withOpacity("--cds-link-primary"),
        "link-hover": withOpacity("--cds-link-primary-hover"),
        // Subtle tinted backgrounds for hover states behind link-colored text
        "link-subtle": withOpacity("--cds-link-subtle"),
        "link-subtle-hover": withOpacity("--cds-link-subtle-hover"),
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "IBM Plex Mono", "Menlo", "monospace"],
        // Logo-only exception — see app/layout.tsx.
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      // Carbon type scale (approximate rem sizes / line-heights / tracking)
      fontSize: {
        "carbon-caption-01": ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.32px" }],
        "carbon-label-01": ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.32px" }],
        "carbon-body-compact-01": ["0.875rem", { lineHeight: "1.125rem", letterSpacing: "0.16px" }],
        "carbon-body-01": ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.16px" }],
        "carbon-body-02": ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }],
        "carbon-heading-01": ["0.875rem", { lineHeight: "1.125rem", letterSpacing: "0.16px", fontWeight: "600" }],
        "carbon-heading-02": ["1rem", { lineHeight: "1.375rem", letterSpacing: "0", fontWeight: "600" }],
        "carbon-heading-03": ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "0", fontWeight: "400" }],
        "carbon-heading-04": ["1.75rem", { lineHeight: "2.25rem", letterSpacing: "0", fontWeight: "400" }],
        "carbon-heading-05": ["2rem", { lineHeight: "2.5rem", letterSpacing: "0", fontWeight: "400" }],
        "carbon-heading-06": ["2.625rem", { lineHeight: "3.125rem", letterSpacing: "0", fontWeight: "300" }],
        "carbon-heading-07": ["3.375rem", { lineHeight: "4rem", letterSpacing: "0", fontWeight: "300" }],
        "display-lg": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        display: ["3.75rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-sm": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      // Carbon 2x grid spacing scale ($spacing-01 .. $spacing-13), kept
      // alongside Tailwind's default scale rather than replacing it.
      spacing: {
        "carbon-01": "0.125rem", // 2px
        "carbon-02": "0.25rem", // 4px
        "carbon-03": "0.5rem", // 8px
        "carbon-04": "0.75rem", // 12px
        "carbon-05": "1rem", // 16px
        "carbon-06": "1.5rem", // 24px
        "carbon-07": "2rem", // 32px
        "carbon-08": "2.5rem", // 40px
        "carbon-09": "3rem", // 48px
        "carbon-10": "4rem", // 64px
        "carbon-11": "5rem", // 80px
        "carbon-12": "6rem", // 96px
        "carbon-13": "10rem", // 160px
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        "card-hover": "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
      },
      // Carbon motion tokens
      transitionTimingFunction: {
        "carbon-productive": "cubic-bezier(0.2, 0, 0.38, 0.9)",
        "carbon-expressive-entrance": "cubic-bezier(0, 0, 0.38, 0.9)",
        "carbon-expressive-exit": "cubic-bezier(0.4, 0.14, 1, 1)",
      },
      transitionDuration: {
        "carbon-fast-01": "70ms",
        "carbon-fast-02": "110ms",
        "carbon-moderate-01": "150ms",
        "carbon-moderate-02": "240ms",
        "carbon-slow-01": "400ms",
        "carbon-slow-02": "700ms",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
