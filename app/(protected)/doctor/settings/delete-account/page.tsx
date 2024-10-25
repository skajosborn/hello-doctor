"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const DeleteAccount: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        // TODO: Implement API call to delete the account
        console.log("Deleting account...");
        // Redirect to home page or login page after successful deletion
        // window.location.href = "/";
      } catch (error) {
        console.error("Error deleting account:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-6 px-mobileX py-mobileY">
      <h1 className="text-2xl font-semibold text-textDark">Delete Account</h1>
      <p className="text-textGray">Warning: This action is irreversible. All your data will be permanently deleted.</p>
      <Button 
        onClick={handleDeleteAccount}
        disabled={isDeleting}
        className="bg-red-600 text-white hover:bg-red-700"
      >
        {isDeleting ? "Deleting..." : "Delete Account"}
      </Button>
    </div>
  );
};

export default DeleteAccount;