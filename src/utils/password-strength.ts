export type PasswordStrength = "none" | "weak" | "fair" | "strong";

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return "none";

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const conditionsCount = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  if (password.length < 8) return "weak";
  if (conditionsCount >= 4) return "strong";
  if (conditionsCount >= 3) return "fair";
  return "weak";
}
