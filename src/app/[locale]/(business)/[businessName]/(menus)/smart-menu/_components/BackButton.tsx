"use client";
import { Button } from "@/components/ui/button";
import React from "react";

export default function BackButton() {
  return (
    <Button onClick={() => history.back()} className="mt-5 w-full rounded-2xl py-6 text-lg">
      Back to menu
    </Button>
  );
}
