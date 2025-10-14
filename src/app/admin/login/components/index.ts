// Component Exports
export {
  // Icons
  LockIcon,
  CheckIcon,
  ErrorIcon,

  // Layout Components
  LoginCard,
  CardHeader,

  // Form Components
  FormGroup,
  FormLabel,
  FormControl,
  FormControlOTP,

  // Button Components
  Button,

  // Layout Components
  FormFooter,
  FormActions,

  // Utility Components
  Alert,
  LoadingSpinner,
} from "./LoginComponents";

// Form Components
export { LoginForm } from "./LoginForm";
export { OTPVerification } from "./OTPVerification";

// Configuration
export {
  themeConfig,
  componentSizes,
  validationRules,
  animations,
  accessibility,
} from "../config/theme";

// Types
export type {
  IconProps,
  LoginCardProps,
  CardHeaderProps,
  FormGroupProps,
  FormLabelProps,
  FormControlProps,
  FormControlOTPProps,
  ButtonProps,
  FormFooterProps,
  FormActionsProps,
  AlertProps,
  LoadingSpinnerProps,
} from "./LoginComponents";

export type { LoginFormProps } from "./LoginForm";

export type { OTPVerificationProps } from "./OTPVerification";
