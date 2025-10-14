import React from "react";
import "../../styles/admin-theme.css";

// Icon Components
export interface IconProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export const LockIcon: React.FC<IconProps> = ({
  size = "md",
  color = "var(--primary-color)",
  className = "",
}) => {
  const sizeMap = {
    sm: "16px",
    md: "24px",
    lg: "32px",
  };

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      style={{ width: sizeMap[size], height: sizeMap[size], color }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
};

export const CheckIcon: React.FC<IconProps> = ({
  size = "md",
  color = "var(--success-color)",
  className = "",
}) => {
  const sizeMap = {
    sm: "16px",
    md: "24px",
    lg: "32px",
  };

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      style={{ width: sizeMap[size], height: sizeMap[size], color }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
};

export const ErrorIcon: React.FC<IconProps> = ({
  size = "md",
  color = "var(--error-color)",
  className = "",
}) => {
  const sizeMap = {
    sm: "16px",
    md: "24px",
    lg: "32px",
  };

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      style={{ width: sizeMap[size], height: sizeMap[size], color }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

// Layout Components
export interface LoginCardProps {
  children: React.ReactNode;
  className?: string;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`admin-container ${className}`}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--admin-spacing-md)",
        background:
          "linear-gradient(135deg, var(--admin-primary-light) 0%, var(--admin-background) 50%, var(--admin-background-light) 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          minWidth: "300px",
          maxWidth: "400px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div className="admin-card">{children}</div>
      </div>
    </div>
  );
};

export interface CardHeaderProps {
  title: string;
  subtitle: string | React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  className = "",
}) => {
  return (
    <div className={`admin-header ${className}`}>
      {icon && (
        <div
          style={{
            margin: "0 auto var(--admin-spacing-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "var(--admin-radius-full)",
            width: "64px",
            height: "64px",
            backgroundColor: "var(--admin-primary-light)",
          }}
        >
          {icon}
        </div>
      )}
      <h1 className="admin-title">{title}</h1>
      <div className="admin-subtitle">{subtitle}</div>
    </div>
  );
};

// Form Components
export interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  className = "",
}) => {
  return <div className={`admin-form-group ${className}`}>{children}</div>;
};

export interface FormLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  children,
  required = false,
  className = "",
}) => {
  return (
    <label htmlFor={htmlFor} className={`admin-form-label ${className}`}>
      {children}
      {required && <span className="text-danger ms-1">*</span>}
    </label>
  );
};

export interface FormControlProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: boolean;
  errorMessage?: string;
  success?: boolean;
  successMessage?: string;
  size?: "sm" | "md" | "lg";
}

export const FormControl: React.FC<FormControlProps> = ({
  error = false,
  errorMessage,
  success = false,
  successMessage,
  size = "md",
  className = "",
  ...props
}) => {
  const sizeClass = size === "lg" ? "form-control-lg" : "";
  const errorClass = error ? "error" : "";
  const successClass = success ? "success" : "";

  return (
    <div>
      <input
        className={`admin-form-control ${sizeClass} ${errorClass} ${successClass} ${className}`}
        {...props}
      />
      {error && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
      {success && successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

export interface FormControlOTPProps
  extends Omit<FormControlProps, "size" | "onChange"> {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

export const FormControlOTP: React.FC<FormControlOTPProps> = ({
  length = 6,
  value,
  onChange,
  className = "",
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, "").slice(0, length);
    onChange(inputValue);
  };

  return (
    <input
      type="text"
      maxLength={length}
      value={value}
      onChange={handleChange}
      className={`form-control form-control-lg form-control-otp ${className}`}
      placeholder={"0".repeat(length)}
      {...props}
    />
  );
};

// Button Components
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "link" | "link-muted";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  fullWidth = false,
  className = "",
  children,
  ...props
}) => {
  const sizeClass = size === "lg" ? "btn-lg" : size === "sm" ? "btn-sm" : "";
  const widthClass = fullWidth ? "w-100" : "";
  const loadingClass = isLoading ? "btn-loading" : "";

  return (
    <button
      className={`admin-btn admin-btn-${variant} ${sizeClass} ${widthClass} ${loadingClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
};

// Layout Components
export interface FormFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const FormFooter: React.FC<FormFooterProps> = ({
  children,
  className = "",
}) => {
  return <div className={`form-footer ${className}`}>{children}</div>;
};

export interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  className = "",
}) => {
  return <div className={`form-actions ${className}`}>{children}</div>;
};

// Utility Components
export interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  message,
  className = "",
}) => {
  const typeClass = `alert-${type}`;

  return (
    <div className={`alert ${typeClass} ${className}`} role="alert">
      {message}
    </div>
  );
};

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeMap = {
    sm: "16px",
    md: "24px",
    lg: "32px",
  };

  return (
    <div
      className={`loading-spinner ${className}`}
      style={{ width: sizeMap[size], height: sizeMap[size] }}
    />
  );
};
