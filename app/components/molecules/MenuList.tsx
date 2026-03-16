"use client";

import React from "react";
import MenuItem from "../atoms/MenuItem";

export type MenuItemConfig = {
  id: string;
  name: string;
  href?: string;
};

type Props = {
  items: MenuItemConfig[];
  onItemClick?: (id: string) => void;
};

const MenuList = ({ items, onItemClick }: Props) => {
  return (
    <ul className="flex items-center gap-6">
      {items.map((item) => (
        <MenuItem
          key={item.id}
          href={item.href}
          onClick={onItemClick ? () => onItemClick(item.id) : undefined}
        >
          {item.name}
        </MenuItem>
      ))}
    </ul>
  );
};

export default MenuList;
