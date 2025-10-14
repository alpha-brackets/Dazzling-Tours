"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useNotification } from "@/lib/hooks";
import { LoginForm } from "./components";
import { validationRules } from "./config/theme";

interface FormErrors {
  email?: string;
  password?: string;
  otp?: string;
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { login, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  const router = useRouter();

  // Run seeder on first mount to create admin if missing
  const hasSeededRef = useRef(false);
  useEffect(() => {
    if (hasSeededRef.current) return;
    hasSeededRef.current = true;

    // Fire-and-forget; seed endpoint is idempotent for existing admin
    fetch("/api/auth/seed", { method: "POST" }).catch(() => {
      // Silently ignore; seeding is best-effort
    });
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required";
    if (!validationRules.email.pattern.test(email)) {
      return validationRules.email.message;
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < validationRules.password.minLength) {
      return validationRules.password.message;
    }
    return undefined;
  };

  // OTP validation removed; login now returns token directly

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        showSuccess("Login successful!");
        router.push("/admin");
      } else {
        showError(result.message);
        setErrors({
          email: result.message.includes("email") ? result.message : undefined,
          password: result.message.includes("password")
            ? result.message
            : undefined,
        });
      }
    } catch {
      showError("Login failed. Please try again.");
      setErrors({
        email: "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // OTP flow removed; login now returns token directly

  return (
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      isLoading={isLoading}
      onSubmit={handleLogin}
      emailError={errors.email}
      passwordError={errors.password}
    />
  );
};

export default LoginPage;
