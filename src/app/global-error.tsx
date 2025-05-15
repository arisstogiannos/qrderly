"use client";
import { ErrorMessage } from "@/components/Messages";
import { Button } from "@/components/ui/button";

// Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html lang="en">
      <body>
        <div className="w-screen h-screen flex flex-col items-center justify-center gap-4">
          <ErrorMessage msg={"Oops! Something went wrong..."} />
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
