import React from "react";
type Props = {
  children: React.ReactNode;
  onClick: () => void;
};
const Button = ({ children, onClick }: Props) => {
  return (
    <button
      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
