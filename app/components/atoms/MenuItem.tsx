type Props = {
  children: React.ReactNode;
  onClick: () => void;
};
const MenuItem = ({ children, onClick }: Props) => {
  return (
    <li className="cursor-pointer hover:text-blue-500" onClick={onClick}>
      {children}
    </li>
  );
};

export default MenuItem;
