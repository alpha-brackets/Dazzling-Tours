// Theme Configuration - Using Global Theme Variables
export const themeConfig = {
  colors: {
    primary: {
      main: "var(--primary)",
      hover: "var(--primary-dark)",
      light: "var(--primary-light)",
      dark: "var(--primary-dark)",
    },
    secondary: {
      main: "var(--complementary)",
      light: "var(--neutral-light)",
      dark: "var(--neutral-dark)",
    },
    success: "#10b981",
    warning: "var(--accent)",
    error: "#ef4444",
    text: {
      primary: "var(--foreground)",
      secondary: "var(--neutral-dark)",
      muted: "#9ca3af",
    },
    border: {
      main: "#d1d5db",
      light: "#e5e7eb",
    },
    background: {
      light: "var(--neutral-light)",
      white: "var(--background)",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  transitions: {
    fast: "0.15s ease-in-out",
    normal: "0.2s ease-in-out",
    slow: "0.3s ease-in-out",
  },
  typography: {
    fontFamily: {
      sans: "system-ui, -apple-system, sans-serif",
      mono: "ui-monospace, SFMono-Regular, monospace",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

// Component Size Configurations
export const componentSizes = {
  icon: {
    sm: "16px",
    md: "24px",
    lg: "32px",
  },
  button: {
    sm: {
      padding: "0.5rem 0.75rem",
      fontSize: "0.875rem",
      minHeight: "36px",
    },
    md: {
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      minHeight: "44px",
    },
    lg: {
      padding: "1rem 1.5rem",
      fontSize: "1.125rem",
      minHeight: "52px",
    },
  },
  input: {
    sm: {
      padding: "0.5rem 0.75rem",
      fontSize: "0.875rem",
    },
    md: {
      padding: "0.75rem 1rem",
      fontSize: "1rem",
    },
    lg: {
      padding: "1rem 1.25rem",
      fontSize: "1.125rem",
    },
  },
};

// Validation Rules
export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  password: {
    required: true,
    minLength: 6,
    message: "Password must be at least 6 characters",
  },
  otp: {
    required: true,
    length: 6,
    pattern: /^\d{6}$/,
    message: "Please enter a valid 6-digit code",
  },
};

// Animation Configurations
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: "0.2s",
  },
  slideUp: {
    from: { transform: "translateY(10px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
    duration: "0.3s",
  },
  bounce: {
    keyframes: [
      { transform: "translateY(0)", offset: 0 },
      { transform: "translateY(-10px)", offset: 0.5 },
      { transform: "translateY(0)", offset: 1 },
    ],
    duration: "0.6s",
  },
};

// Accessibility Configuration
export const accessibility = {
  focusRing: {
    outline: "2px solid var(--primary-color)",
    outlineOffset: "2px",
  },
  reducedMotion: {
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
      transition: "none",
    },
  },
  highContrast: {
    "@media (prefers-contrast: high)": {
      borderWidth: "2px",
    },
  },
};
