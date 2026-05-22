import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }),
  email: z
    .string()
    .min(1, { message: "Email cannot be empty" })
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: "Invalid email address",
    }),
  password: z
    .string()
    .min(1, { message: "Password cannot be empty" })
    .refine((val) => val === "" || val.length >= 8, {
      message: "Password must be at least 8 characters long",
    })
    .refine((val) => val === "" || /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => val === "" || /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => val === "" || /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => val === "" || /[^A-Za-z0-9]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
