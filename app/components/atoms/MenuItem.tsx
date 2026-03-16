"use client";

import React from "react";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

const MenuItem = ({ children, href, onClick }: Props) => {
  const className =
    "cursor-pointer hover:text-blue-500 transition-colors";
  if (href) {
    return (
      <li>
        <Link href={href} className={className}>
          {children}
        </Link>
      </li>
    );
  }
  return (
    <li className={className} onClick={onClick}>
      {children}
    </li>
  );
};

export default MenuItem;
