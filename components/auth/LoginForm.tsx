"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/schemas";
import { CardWrapper } from "./FormWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "./FormError";
import { FormSuccess } from "./FormSuccess";
import { login } from "@/actions/login";
import { useSession } from "next-auth/react";

export const LoginForm = () => {
  const { update } = useSession();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>(
    ""
  );
  const [success, setSuccess] = useState<
    string | undefined
  >("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof LoginSchema>
  ) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then(async (data) => {
          if (data?.error) {
            form.reset();
            setError(data?.error);
          }

          if (data?.success) {
            form.reset();
            await update();
            setSuccess(data?.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-labelColor">
                      Two Factor Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123456"
                        className="text-textDark placeholder-placeholder"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-labelColor">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Email"
                          type="email"
                          className="text-textDark placeholder-placeholder"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-labelColor">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Password"
                          type="password"
                          disabled={isPending}
                          className="text-textDark placeholder-placeholder"
                        />
                      </FormControl>
                      <FormMessage />
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/auth/reset-password">
                          Forgot Password?
                        </Link>
                      </Button>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-primaryColor hover:bg-primaryColor/80"
          >
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
