import * as React from "react";

interface VerificationEmailProps {
  confirmLink: string;
}

export const VerificationEmail = ({ confirmLink }: VerificationEmailProps) => {
  return (
    <div style={container}>
      <h2 style={heading}>Verify your SecureGate account</h2>
      <p style={paragraph}>
        Thank you for registering. Please click the button below to verify your email address. This link will expire in 15 minutes.
      </p>
      <div style={buttonContainer}>
        <a href={confirmLink} style={button}>
          Verify Email Address
        </a>
      </div>
      <hr style={divider} />
      <p style={footer}>
        If you didn&apos;t create a SecureGate account, you can safely ignore this email.
      </p>
    </div>
  );
};

const container: React.CSSProperties = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  maxWidth: "580px",
  margin: "30px auto",
  padding: "32px",
  border: "1px solid #f1f5f9",
  borderRadius: "16px",
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
};

const heading: React.CSSProperties = {
  color: "#0f172a",
  fontSize: "24px",
  fontWeight: "700",
  lineHeight: "32px",
  margin: "0 0 16px",
};

const paragraph: React.CSSProperties = {
  color: "#334155",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const buttonContainer: React.CSSProperties = {
  margin: "24px 0",
};

const button: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#10b981",
  color: "#ffffff",
  textDecoration: "none",
  padding: "12px 24px",
  fontWeight: "600",
  borderRadius: "8px",
  fontSize: "15px",
  textAlign: "center",
};

const divider: React.CSSProperties = {
  border: "0",
  borderTop: "1px solid #f1f5f9",
  margin: "32px 0 24px",
};

const footer: React.CSSProperties = {
  color: "#64748b",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0",
};
