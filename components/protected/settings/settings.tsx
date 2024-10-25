import { FC } from "react";
import Link from "next/link";

interface LinkItem {
  href: string;
  label: string;
}

interface settingsProps {
  links: LinkItem[];
}

const Settings: FC<settingsProps> = ({ links }) => {
  return (
    <div className="py-4 px-mobileX">
      <h2 className="text-xl font-semibold text-textDark mb-5">
        Settings
      </h2>

      {/* Links */}
      <nav className="flex flex-col space-y-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-textGray hover:text-textGray/70"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Settings;
