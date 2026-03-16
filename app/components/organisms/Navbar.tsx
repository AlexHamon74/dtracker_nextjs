"use client";

import Link from "next/link";
import MenuList, { MenuItemConfig } from "../molecules/MenuList";

const navItems: MenuItemConfig[] = [
  { id: "expenses", name: "Mes dépenses", href: "/expenses" },
  { id: "categories", name: "Catégories", href: "/categories" },
  { id: "analytics", name: "Analytics", href: "/analytics" },
];

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100">
      <Link href="/" className="text-2xl font-bold hover:text-blue-600 transition-colors">
        DTracker
      </Link>
      <MenuList items={navItems} />
    </nav>
  );
};

export default Navbar;
