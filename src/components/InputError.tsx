"use client";

import React from "react";

interface InputErrorProps {
  message?: string;
  id?: string;
}

export default function InputError({ message, id }: InputErrorProps) {
  if (!message) return null;

  return (
    <div
      id={id}
      role="alert"
      className="flex items-center gap-1.5 mt-1.5 text-rose-400 select-none animate-slide-down"
    >
      <svg
        className="h-3.5 w-3.5 shrink-0 text-rose-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
      </svg>
      <span className="text-xs font-medium tracking-wide leading-none">{message}</span>
    </div>
  );
}
