"use client";

import { toggleTwoFactorAuth } from "@/actions/account-security/two-factor";
import { Switch } from "@/components/ui/switch";
import { ExtendedUser } from "@/next-auth";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

export const TwoFactorAuth = ({
  user,
}: {
  user: ExtendedUser;
}) => {
  const { update } = useSession();

  const [isToggling, setIsToggling] = useState(false);
  const [isEnabled, setIsEnabled] = useState(
    user?.isTwoFactorEnabled
  );

  const onToggle = async () => {
    try {
      setIsToggling(true);
      setIsEnabled(!isEnabled);

      const result = await toggleTwoFactorAuth();
      if (result.success) {
        await update({
          user: {
            ...user,
            isTwoFactorEnabled: !isEnabled,
          },
        });
      } else {
        throw new Error("Failed to toggle 2FA");
      }
    } catch (error) {
      console.error("Failed to toggle 2FA:", error);
      setIsEnabled(user?.isTwoFactorEnabled);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <section className="space-y-4 pb-8 border-b border-inputBorder">
      <h2 className="text-2xl font-semibold">
        Two-Factor Authentication
      </h2>
      <p className="text-textGray">
        Add an extra layer of security to your account
      </p>
      <div className="flex items-center space-x-2">
        <Switch
          checked={isEnabled}
          onCheckedChange={onToggle}
          disabled={isToggling}
          className={`${
            isEnabled
              ? "data-[state=checked]:bg-primaryColor"
              : "data-[state=unchecked]:bg-inputBg"
          }`}
        />
        <span>{isEnabled ? "Enabled" : "Disabled"}</span>
      </div>
    </section>
  );
};