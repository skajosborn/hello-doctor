"use client";

import * as z from "zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { passwordChangeSchema } from "@/schemas";
import { useSession } from "next-auth/react";
import { passwordChange } from "@/actions/account-security/password-change";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";

export const PasswordChangeForm = () => {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<
    string | undefined
  >();

  const passwordForm = useForm({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (
    value: z.infer<typeof passwordChangeSchema>
  ) => {
    startTransition(() => {
      passwordChange(value)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          } else if (data?.success) {
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">
        Change Password
      </h2>
      <p className="text-textGray">
        Update your account password
      </p>
      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={passwordForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-labelColor">
                  Current Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    {...field}
                    className="bg-inputBg border-inputBorder placeholder-placeholder"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={passwordForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-labelColor">
                  New Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    {...field}
                    className="bg-inputBg border-inputBorder placeholder-placeholder"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={passwordForm.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-labelColor">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    {...field}
                    className="bg-inputBg border-inputBorder placeholder-placeholder"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type="submit"
            disabled={isPending}
            className="bg-primaryColor hover:bg-primaryColor/80 text-babyPowder"
          >
            Change Password
          </Button>
        </form>
      </Form>
    </section>
  );
};
