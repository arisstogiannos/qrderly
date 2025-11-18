'use client';

import { ErrorMessage } from '@/components/Messages';
import { Button } from '@/components/ui/button';

export default function error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="size-full flex flex-col items-center justify-center gap-4">
      <ErrorMessage msg={`Oops! Something went wrong...${error.message}`} />
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
