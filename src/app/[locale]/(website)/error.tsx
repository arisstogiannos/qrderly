"use client"; // Error boundaries must be Client Components

import { ErrorMessage } from "@/components/Messages";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="size-full flex flex-col items-center justify-center gap-4">
      <ErrorMessage msg={`Oops! Something went wrong...${error.message}`} />
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
