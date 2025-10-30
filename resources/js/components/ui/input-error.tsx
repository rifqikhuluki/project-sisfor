
import React from "react";
import { cn } from "@/lib/utils"; // opsional, kalau kamu pakai helper cn()

interface InputErrorProps {
  message?: string;
  className?: string;
}

export default function InputError({ message, className }: InputErrorProps) {
  if (!message) return null;

  return (
    <p className={cn("text-sm text-red-500 mt-1", className)}>
      {message}
    </p>
  );
}
