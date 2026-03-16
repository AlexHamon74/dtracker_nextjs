import React from "react";
import MenuItem from "../atoms/MenuItem";

type Props = {
  children: { id: string; name: string }[];
  onClick: () => void;
};
const MenuList = ({ children, onClick }: Props) => {
  return (
    <ul className="flex items-center gap-2">
      {children.map((child) => (
        <MenuItem key={child.id} onClick={onClick}>
          {child.name}
        </MenuItem>
      ))}
    </ul>
  );
};

export default MenuList;
