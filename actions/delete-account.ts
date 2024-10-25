export const deleteAccount = async (
  userId: string | undefined
) => {
  try {
    const response = await fetch("/api/delete-account", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: result.success };
    } else {
      return {
        error: result.error || "Failed to delete account",
      };
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    return { error: "Failed to delete account" };
  }
};
