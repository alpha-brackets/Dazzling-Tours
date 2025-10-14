import React from "react";
import {
  LoginCard,
  CardHeader,
  Button,
  LockIcon,
  FormGroup,
  FormLabel,
  FormControlOTP,
  FormActions,
} from "./LoginComponents";

export interface OTPVerificationProps {
  otp: string;
  setOtp: (otp: string) => void;
  otpEmail: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onResendOTP: () => void;
  onBackToLogin: () => void;
  otpError?: string;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  otp,
  setOtp,
  otpEmail,
  isLoading,
  onSubmit,
  onResendOTP,
  onBackToLogin,
  otpError,
}) => {
  return (
    <LoginCard>
      <CardHeader
        title="Verify OTP"
        subtitle={
          <>
            Enter the 6-digit code sent to{" "}
            <span className="fw-medium text-dark">{otpEmail}</span>
          </>
        }
        icon={<LockIcon size="md" />}
      />

      <form onSubmit={onSubmit} className="login-form">
        <FormGroup>
          <FormLabel htmlFor="otp" required>
            OTP Code
          </FormLabel>
          <FormControlOTP
            id="otp"
            name="otp"
            required
            length={6}
            value={otp}
            onChange={setOtp}
            placeholder="000000"
            error={!!otpError}
            errorMessage={otpError}
          />
        </FormGroup>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={otp.length !== 6}
          isLoading={isLoading}
          loadingText="Verifying..."
        >
          Verify OTP
        </Button>

        <FormActions>
          <Button
            type="button"
            variant="link"
            onClick={onResendOTP}
            disabled={isLoading}
          >
            Resend OTP
          </Button>
          <Button type="button" variant="link-muted" onClick={onBackToLogin}>
            ← Back to Login
          </Button>
        </FormActions>
      </form>
    </LoginCard>
  );
};
