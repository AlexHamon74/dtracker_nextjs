import React from "react";

type Props = {
  variant: "error" | "success";
  children: React.ReactNode;
  className?: string;
};

const Alert = ({ variant, children, className = "" }: Props) => {
  const styles =
    variant === "error"
      ? "bg-red-50 border-red-200 text-red-700"
      : "bg-green-50 border-green-200 text-green-700";
  return (
    <div
      className={`p-4 border rounded-lg text-sm flex items-center gap-2 ${styles} ${className}`}
    >
      <span>{variant === "error" ? "⚠️" : "✅"}</span>
      {children}
    </div>
  );
};

export default Alert;
