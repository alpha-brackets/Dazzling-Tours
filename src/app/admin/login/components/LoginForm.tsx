import React from "react";
import Link from "next/link";
import {
  LoginCard,
  CardHeader,
  Button,
  LockIcon,
  FormGroup,
  FormLabel,
  FormControl,
} from "./LoginComponents";

export interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  emailError?: string;
  passwordError?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  onSubmit,
  emailError,
  passwordError,
}) => {
  return (
    <LoginCard>
      <CardHeader
        title="Admin Login"
        subtitle="Sign in to your admin account"
        icon={<LockIcon size="md" />}
      />

      <form onSubmit={onSubmit} className="login-form">
        <FormGroup>
          <FormLabel htmlFor="email" required>
            Email Address
          </FormLabel>
          <FormControl
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            size="md"
            error={!!emailError}
            errorMessage={emailError}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="password" required>
            Password
          </FormLabel>
          <FormControl
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            size="md"
            error={!!passwordError}
            errorMessage={passwordError}
          />
        </FormGroup>

        <div className="text-right mb-4">
          <Link
            href="/admin/forgot-password"
            className="btn-link small fw-medium"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isLoading}
          loadingText="Signing in..."
        >
          Sign in
        </Button>
      </form>
    </LoginCard>
  );
};
