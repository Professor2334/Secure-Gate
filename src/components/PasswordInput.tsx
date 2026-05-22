"use client";

import { useState, useEffect } from "react";
import { getPasswordStrength } from "@/utils/password-strength";
import type { PasswordStrength } from "@/utils/password-strength";
import InputError from "@/components/InputError";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showStrength?: boolean;
}

export default function PasswordInput({
  label = "Password",
  value,
  onChange,
  error,
  showStrength = true,
  id,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength>("none");

  // Determine a unique ID if one wasn't provided
  const inputId = id ?? "password-input";
  const errorId = `${inputId}-error`;
  const strengthId = `${inputId}-strength`;

  useEffect(() => {
    if (!showStrength) {
      setStrength("none");
      return;
    }
    setStrength(getPasswordStrength(value));
  }, [value, showStrength]);

  const strengthColorMap = {
    none: "bg-slate-800",
    weak: "bg-rose-500",
    fair: "bg-amber-500",
    strong: "bg-emerald-500",
  };

  const strengthTextMap = {
    none: "",
    weak: "Weak password",
    fair: "Fair password",
    strong: "Strong password",
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={
            [
              error ? errorId : null,
              showStrength && value ? strengthId : null
            ].filter(Boolean).join(" ") || undefined
          }
          className={`w-full px-4 py-2.5 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-[1.5px] transition duration-200 ${
            error
              ? "border-rose-500/50 focus:ring-rose-500/30 focus:border-rose-500/50"
              : "border-slate-800 focus:ring-emerald-500/30 focus:border-slate-700"
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-semibold select-none focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1.5 py-0.5"
        >
          {showPassword ? "HIDE" : "SHOW"}
        </button>
      </div>

      {/* Strength indicator */}
      {showStrength && value && (
        <div className="mt-1.5 flex flex-col gap-1" id={strengthId} aria-live="polite" role="status">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-0.5" aria-hidden="true">
            <div
              className={`h-full transition-all duration-300 ${
                strength === "weak" || strength === "fair" || strength === "strong"
                  ? strengthColorMap[strength]
                  : "bg-slate-800"
              }`}
              style={{ width: strength === "none" ? "0%" : strength === "weak" ? "33.3%" : strength === "fair" ? "66.6%" : "100%" }}
            />
          </div>
          <span
            className={`text-[11px] font-medium transition-colors duration-200 ${
              strength === "weak"
                ? "text-rose-400"
                : strength === "fair"
                ? "text-amber-400"
                : strength === "strong"
                ? "text-emerald-400"
                : "text-slate-500"
            }`}
          >
            {strengthTextMap[strength]}
          </span>
        </div>
      )}

      <InputError message={error} id={errorId} />
    </div>
  );
}
