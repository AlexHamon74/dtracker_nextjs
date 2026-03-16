"use client";
import MenuList from "../molecules/MenuList";
import Button from "../atoms/Button";

const Navbar = () => {
  const items = [
    { id: "1", name: "Mes dépenses" },
    { id: "2", name: "Créer une dépense" },
  ];
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100">
      <div className="text-2xl font-bold">DTracker</div>
      <MenuList children={items} onClick={() => {}} />
      <Button onClick={() => {}}>Se connecter</Button>
    </nav>
  );
};
export default Navbar;
