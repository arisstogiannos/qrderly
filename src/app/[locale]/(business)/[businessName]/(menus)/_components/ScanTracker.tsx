"use client";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { incrementMenuScans } from "../../_actions/menu";

export default function ScanTracker({ menuId,businessId }: { menuId: string ,businessId:string}) {
  const mutation = useMutation({
    mutationFn: () => incrementMenuScans(menuId,businessId),
    retry: 3, // Retry up to 3 times if it fails
  });

  useEffect(() => {
    const scanKey = `scanned-${menuId}`;
    
    // Check if scan was already recorded in this session
    if (!sessionStorage.getItem(scanKey)) {
      mutation.mutate(); // Increment scan count
      sessionStorage.setItem(scanKey, "true"); // Mark scan as recorded
    }
  }, [menuId]); // Run once when the menuId changes

  return null;
}