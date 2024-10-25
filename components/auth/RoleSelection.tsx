"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { CardWrapper } from "@/components/auth/FormWrapper";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";

import {
  DOCTOR_LOGIN_REDIRECT,
  PATIENT_LOGIN_REDIRECT,
} from "@/routes";
import { setUserRole } from "@/actions/setUserRole";
import { DoctorSpecializationField } from "@/components/auth/DoctorSpecializationField";
import { UserRole } from "@prisma/client";
import { RoleSelectionSchema } from "@/schemas";

const RoleSelection = () => {
  const router = useRouter();
  const { update, data: session } = useSession();
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

  useEffect(() => {
    if (session?.user?.role) {
      const redirectTo =
        session.user.role === UserRole.DOCTOR
          ? DOCTOR_LOGIN_REDIRECT
          : PATIENT_LOGIN_REDIRECT;
      router.replace(redirectTo);
    }
  }, [session, router]);

  const form = useForm<z.infer<typeof RoleSelectionSchema>>(
    {
      resolver: zodResolver(RoleSelectionSchema),
      defaultValues: {
        role: UserRole.PATIENT,
        specialization: "",
      },
    }
  );

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    form.setValue("role", role);
  };

  const onSubmit = async (
    values: z.infer<typeof RoleSelectionSchema>
  ) => {
    setError("");
    setSuccess("");

    // Use startTransition to make this async process non-blocking
    startTransition(async () => {
      const redirectTo =
        values.role === UserRole.DOCTOR
          ? DOCTOR_LOGIN_REDIRECT
          : PATIENT_LOGIN_REDIRECT;

      try {
        // If the role is PATIENT, set specialization to null
        const specialization =
          values.role === UserRole.DOCTOR
            ? values.specialization
            : null;

        const result = await setUserRole(
          values.role,
          specialization ?? ""
        );

        if (result.success) {
          setSuccess(result.success);

          await update();

          // Force a hard navigation
          window.location.href = redirectTo;
        } else {
          setError(result.error);
        }
      } catch {
        setError("Something went wrong.");
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Select Your Role"
      backButtonLabel="Go Back"
      backButtonHref="/auth/register"
      showSocial={false}
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
                          : "bg-white text-textDark hover:bg-primaryColor/15"
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
                          ? "bg-primaryColor text-white hover:bg-primaryColor/80"
                          : "bg-white text-textDark hover:bg-primaryColor/15"
                      }`}
                    >
                      Doctor
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DoctorSpecializationField
              form={form}
              activeRole={activeRole}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-primaryColor hover:bg-primaryColor/80"
          >
            Continue
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RoleSelection;
