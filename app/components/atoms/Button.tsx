import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button = ({ children, className = "", ...props }: Props) => {
  return (
    <button
      type="button"
      className={`bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
