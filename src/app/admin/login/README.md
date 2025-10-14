# Login System - Dazzling Tours Admin Portal

A comprehensive, themeable login system built with React, TypeScript, and CSS custom properties for the Dazzling Tours admin portal.

## 🚀 Features

- **Modern Design**: Clean, professional UI with gradient backgrounds and smooth animations
- **Responsive Layout**: Works perfectly on all device sizes (300px - 400px card width)
- **Form Validation**: Client-side validation with error handling and user feedback
- **OTP Verification**: Two-factor authentication with email OTP
- **Theme System**: Customizable CSS variables for easy theming
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Type Safety**: Full TypeScript support with comprehensive interfaces
- **Reusable Components**: Modular component architecture for easy maintenance

## 📁 Project Structure

```
src/app/admin/login/
├── components/
│   ├── LoginComponents.tsx    # Core reusable components
│   ├── LoginForm.tsx         # Main login form component
│   ├── OTPVerification.tsx   # OTP verification component
│   └── index.ts              # Component exports
├── config/
│   └── theme.ts              # Theme configuration and validation rules
├── styles/
│   └── login-theme.css       # CSS theme with custom properties
└── page.tsx                  # Main login page with state management
```

## 🎨 Theme System

### CSS Custom Properties

The theme system uses CSS custom properties for easy customization:

```css
:root {
  /* Colors */
  --primary-color: #4f46e5;
  --primary-hover: #4338ca;
  --primary-light: #e0e7ff;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --transition-fast: 0.15s ease-in-out;
  --transition-normal: 0.2s ease-in-out;
  --transition-slow: 0.3s ease-in-out;
}
```

### Theme Configuration

```typescript
export const themeConfig = {
  colors: {
    primary: {
      main: "#4f46e5",
      hover: "#4338ca",
      light: "#e0e7ff",
      dark: "#3730a3",
    },
    // ... more colors
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    // ... more spacing
  },
  // ... more configuration
};
```

## 🧩 Components

### Core Components

#### `LoginCard`

Main container component with gradient background and centered card layout.

```tsx
<LoginCard>{/* Your content */}</LoginCard>
```

#### `CardHeader`

Header component with icon, title, and subtitle.

```tsx
<CardHeader
  title="Admin Login"
  subtitle="Sign in to your admin account"
  icon={<LockIcon size="md" />}
/>
```

#### `FormControl`

Enhanced input component with validation states.

```tsx
<FormControl
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={!!emailError}
  errorMessage={emailError}
  size="lg"
/>
```

#### `FormControlOTP`

Specialized OTP input with automatic formatting.

```tsx
<FormControlOTP
  length={6}
  value={otp}
  onChange={setOtp}
  placeholder="000000"
  error={!!otpError}
  errorMessage={otpError}
/>
```

#### `Button`

Flexible button component with multiple variants.

```tsx
<Button
  variant="primary"
  size="lg"
  fullWidth
  isLoading={isLoading}
  loadingText="Signing in..."
>
  Sign in
</Button>
```

### Icon Components

#### `LockIcon`

```tsx
<LockIcon size="md" color="var(--primary-color)" />
```

#### `CheckIcon`

```tsx
<CheckIcon size="sm" color="var(--success-color)" />
```

#### `ErrorIcon`

```tsx
<ErrorIcon size="lg" color="var(--error-color)" />
```

## 🔧 Usage

### Basic Login Form

```tsx
import { LoginForm } from "./components";

const MyLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic
  };

  return (
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      emailError={errors.email}
      passwordError={errors.password}
    />
  );
};
```

### OTP Verification

```tsx
import { OTPVerification } from "./components";

const MyOTPPage = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <OTPVerification
      otp={otp}
      setOtp={setOtp}
      otpEmail="user@example.com"
      isLoading={isLoading}
      onSubmit={handleOTPSubmit}
      onResendOTP={handleResendOTP}
      onBackToLogin={handleBackToLogin}
      otpError={errors.otp}
    />
  );
};
```

## ✅ Validation

### Built-in Validation Rules

```typescript
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
```

### Custom Validation

```typescript
const validateEmail = (email: string): string | undefined => {
  if (!email) return "Email is required";
  if (!validationRules.email.pattern.test(email)) {
    return validationRules.email.message;
  }
  return undefined;
};
```

## 🎯 Accessibility

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators and logical tab order
- **Color Contrast**: WCAG AA compliant color combinations
- **Reduced Motion**: Respects user's motion preferences

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Flexible Layout**: Adapts to different screen sizes
- **Touch-Friendly**: Appropriate touch targets (44px minimum)
- **Card Width**: 300px minimum, 400px maximum for optimal readability

## 🔄 State Management

The login system uses React hooks for state management:

```typescript
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [otp, setOtp] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [step, setStep] = useState<"login" | "otp">("login");
const [errors, setErrors] = useState<FormErrors>({});
```

## 🎨 Customization

### Changing Colors

Update CSS custom properties:

```css
:root {
  --primary-color: #your-color;
  --primary-hover: #your-hover-color;
  --primary-light: #your-light-color;
}
```

### Modifying Spacing

```css
:root {
  --spacing-md: 1.25rem; /* Increase default spacing */
  --spacing-lg: 2rem; /* Increase large spacing */
}
```

### Custom Animations

```css
.login-card {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

## 🚀 Performance

- **CSS Custom Properties**: Efficient theming without JavaScript
- **Component Optimization**: Memoized components where appropriate
- **Lazy Loading**: Components loaded only when needed
- **Minimal Bundle**: Tree-shakeable component exports

## 🧪 Testing

The components are designed to be easily testable:

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginForm } from "./components";

test("renders login form", () => {
  render(<LoginForm {...props} />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
```

## 📝 License

This login system is part of the Dazzling Tours project and follows the same licensing terms.

## 🤝 Contributing

When contributing to the login system:

1. Follow the existing component patterns
2. Update TypeScript interfaces for new props
3. Add proper error handling and validation
4. Ensure accessibility compliance
5. Test on multiple devices and browsers
6. Update documentation for new features

---

**Built with ❤️ for Dazzling Tours Admin Portal**
