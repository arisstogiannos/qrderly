'use client';
import { ErrorMessage } from '@/components/Messages';

function AuthErrorPage() {
  return (
    <div className="flex w-full h-[50vh] items-center justify-center bg-background rounded-3xl p-6">
      <ErrorMessage msg={'Oops! Something went wrong...'} />
    </div>
  );
}

export default AuthErrorPage;
