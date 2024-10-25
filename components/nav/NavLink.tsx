import Link from "next/link";

function NavLink({
  link,
  label,
  className,
  onClick,
}: {
  link: string;
  label: string;
  className: string;
  onClick: () => void;
}) {
  return (
    <li className={className}>
      <Link href={link} onClick={onClick}>
        {label}
      </Link>
    </li>
  );
}

export default NavLink;
