"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/actions/delete-account";

import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider,
} from "@/components/ui/toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from "@/actions/logout";

export default function DeleteAccountButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<
    string | null
  >(null);
  const [toastType, setToastType] = useState<
    "success" | "error" | null
  >(null);

  const router = useRouter();
  const user = useCurrentUser();

  const handleDelete = async () => {
    if (!user?.id) {
      setToastMessage("User ID is missing.");
      setToastType("error");
      return;
    }

    setIsLoading(true);
    const result = await deleteAccount(user?.id);
    setIsLoading(false);

    if (result.error) {
      setToastMessage(result.error);
      setToastType("error");
    } else if (result.success) {
      setToastMessage(result.success);
      setToastType("success");
      setIsOpen(false);

      await logout();

      router.push("/");
    }
  };

  return (
    <div className="pb-4 px-mobileX">
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will
              permanently delete your account and remove
              your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ShadCN Toast Notification */}
      <ToastProvider>
        {toastMessage && (
          <Toast variant={toastType}>
            <ToastTitle>
              {toastType === "error" ? "Error" : "Success"}
            </ToastTitle>
            <ToastDescription>
              {toastMessage}
            </ToastDescription>
          </Toast>
        )}
      </ToastProvider>
    </div>
  );
}
