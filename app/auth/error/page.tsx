"use client";

import { CardWrapper } from "@/components/auth/FormWrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";

const AuthErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "Oops! Something went wrong!";

  if (error === "EmailExists") {
    errorMessage = "Email already in use";
  }

  return (
    <CardWrapper
      headerLabel={
        errorMessage || "Oops! Something went wrong!"
      }
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};

export default AuthErrorPage;
