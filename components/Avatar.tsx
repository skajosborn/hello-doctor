import * as React from "react";
import Image from "next/image";
import { ExtendedUser } from "@/next-auth";

interface AvatarProps {
  user?:
    | ExtendedUser
    | {
        image?: string | null;
        name?: string;
      };
  width?: number;
  height?: number;
  className?: string;
  previewAvatar?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  previewAvatar,
  user,
  width = 55,
  height = 55,
  className = "",
}) => {
  return (
    <Image
      src={(previewAvatar || user?.image) ?? "/profile.jpg"}
      alt={
        user?.name
          ? `${user.name}'s picture`
          : "User Picture"
      }
      width={width}
      height={height}
      className={`rounded-[2px] ${className}`}
    />
  );
};

export default Avatar;
