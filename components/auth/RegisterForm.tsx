/* eslint-disable */

"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas";
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
import { register } from "@/actions/register";
import { DoctorSpecializationField } from "./DoctorSpecializationField";
import { UserRole } from "@prisma/client";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>(
    ""
  );
  const [success, setSuccess] = useState<
    string | undefined
  >("");
  const [isPending, startTransition] = useTransition();
  const [activeRole, setActiveRole] = useState<UserRole>(
    UserRole.PATIENT
  );

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      role: UserRole.PATIENT,
      specialization: "",
    },
  });

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    form.setValue("role", role);
  };

  const onSubmit = (
    values: z.infer<typeof RegisterSchema>
  ) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() =>
      register({ ...values, role: activeRole }).then(
        (data) => {
          setError(data.error);
          setSuccess(data.success);
        }
      )
    );
  };
  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={() => (
                <FormItem>
                  <FormLabel className="text-labelColor">
                    Role
                  </FormLabel>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      onClick={() =>
                        handleRoleChange(UserRole.PATIENT)
                      }
                      disabled={isPending}
                      className={`flex-1 ${
                        activeRole === UserRole.PATIENT
                          ? "bg-primaryColor text-white hover:bg-primaryColor/80"
                          : "bg-white text-textDark  hover:bg-primaryColor/15"
                      }`}
                    >
                      Patient
                    </Button>
                    <Button
                      type="button"
                      onClick={() =>
                        handleRoleChange(UserRole.DOCTOR)
                      }
                      disabled={isPending}
                      className={`flex-1 ${
                        activeRole === UserRole.DOCTOR
                          ? "bg-primaryColor text-white hover:bg-primaryColor/80 "
                          : "bg-white text-textDark  hover:bg-primaryColor/15"
                      }`}
                    >
                      Doctor
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DoctorSpecializationField  */}
            <DoctorSpecializationField
            // @ts-ignore
              form={form}
              activeRole={activeRole}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-labelColor">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Name"
                      type="text"
                      disabled={isPending}
                      className="text-textDark placeholder-placeholder"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      disabled={isPending}
                      className="text-textDark placeholder-placeholder"
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
                </FormItem>
              )}
            />

            {/* Password Confirm Field */}
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-labelColor">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Confirm Password"
                      type="password"
                      disabled={isPending}
                      className="text-textDark placeholder-placeholder"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-primaryColor hover:bg-primaryColor/80"
          >
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
