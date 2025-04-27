"use client";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { incrementMenuScans, deactivateMenu } from "../../_actions/menu";

export default function ScanTracker({ menuId,businessId,businessName }: { menuId: string ,businessId:string,businessName:string }) {
  const inrementScans = useMutation({
    mutationFn: () => incrementMenuScans(menuId,businessId),
    retry: 3, // Retry up to 3 times if it fails
  });
  const deactivateMenuMutation = useMutation({
    mutationFn: () => deactivateMenu(businessName),
    retry: 3, // Retry up to 3 times if it fails
  });

  useEffect(() => {
    const scanKey = `scanned-${menuId}`;
    
    // Check if scan was already recorded in this session
    if (!sessionStorage.getItem(scanKey)) {
      inrementScans.mutate(); // Increment scan count
      sessionStorage.setItem(scanKey, "true"); // Mark scan as recorded
    }

    console.log(inrementScans.data)

    if(inrementScans.data && inrementScans.data >=200){
      deactivateMenuMutation.mutate()
    }
  }, [menuId,inrementScans.data]); // Run once when the menuId changes

  return null;
}