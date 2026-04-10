import nodemailer from "nodemailer";

let transportInstance: nodemailer.Transporter | null = null;

const getTransport = () => {
  if (!transportInstance) {
    const token = process.env.MAILTRAP_TOKEN;
    const user = process.env.MAILTRAP_USER || "api"; // Default to 'api' for Mailtrap Email API
    const pass = process.env.MAILTRAP_PASS || token; // Use token if pass not specified (for Email API)
    const host = process.env.MAILTRAP_HOST || "send.smtp.mailtrap.io"; // Use 'send.smtp.mailtrap.io' for live API
    const port = parseInt(process.env.MAILTRAP_PORT || "587");

    if (!pass) {
      console.warn("[EMAIL] No Mailtrap password or token provided.");
    }

    console.log(
      `[EMAIL] Initializing transporter with host: ${host}, user: ${user}`,
    );

    transportInstance = nodemailer.createTransport({
      host,
      port,
      auth: {
        user,
        pass: pass || "",
      },
    });
  }
  return transportInstance;
};

// Email options interface
export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: string | Buffer;
    contentType?: string;
  }>;
}

interface MailOptions extends nodemailer.SendMailOptions {
  category?: string;
}

// Send email function
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const fromName = process.env.SMTP_FROM_NAME || "Dazzling Tours";
    const defaultFromEmail =
      process.env.MAILTRAP_FROM_EMAIL ||
      process.env.SMTP_USER ||
      "hello@demomailtrap.co";
    const fromEmail = options.from || defaultFromEmail;
    const formattedFrom = `${fromName} <${fromEmail}>`;

    console.log(`[EMAIL] Attempting to send email to: ${options.to}`);
    console.log(`[EMAIL] From: ${formattedFrom}`);

    const mailOptions: MailOptions = {
      from: formattedFrom,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ""),
      replyTo: options.replyTo,
      attachments: options.attachments,
    };

    // Mailtrap specific properties
    if (process.env.MAILTRAP_TOKEN) {
      mailOptions.category = options.subject.includes("Password")
        ? "Password Reset"
        : "Notification";
    }

    const transporter = getTransport();
    const info = await transporter.sendMail(mailOptions);

    console.log("[EMAIL] Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("[EMAIL] Fatal error sending email:", error);
    // Log more specific error info if available
    if (typeof error === "object" && error !== null && "response" in error) {
      console.error(
        "[EMAIL] Provider response:",
        (error as { response: string }).response,
      );
    }
    throw error;
  }
}

// Send bulk emails (with rate limiting)
export async function sendBulkEmails(
  recipients: string[],
  options: Omit<EmailOptions, "to">,
  batchSize: number = 10,
  delayMs: number = 1000,
): Promise<{
  success: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
}> {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as Array<{ email: string; error: string }>,
  };

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (email) => {
        try {
          await sendEmail({
            ...options,
            to: email,
          });
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push({
            email,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }),
    );

    if (i + batchSize < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    console.log("[EMAIL] Verifying email configuration...");
    const transporter = getTransport();
    await transporter.verify();
    console.log("[EMAIL] Configuration verified successfully.");
    return true;
  } catch (error) {
    console.error("[EMAIL] Config verification failed:", error);
    return false;
  }
}
