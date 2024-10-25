import { logout } from "@/actions/logout";

interface LogoutButtonItemProps {
  className: string;
  onClick: () => void;
  // handleLogout: () => void;
}

const LogoutButtonItem = ({
  className,
  onClick,
}: // handleLogout,
LogoutButtonItemProps) => {
  const logoutClick = async () => {
    await logout();
    onClick();
    // handleLogout();
  };

  return (
    <li className={className}>
      <button onClick={logoutClick}>Logout</button>
    </li>
  );
};

export default LogoutButtonItem;
