import { Suspense } from 'react';
import { ErrorMessage } from '@/components/Messages';
import { verifyResetToken } from '@/lib/tokens';
import { NewPasswordForm } from '../_components/NewPasswordForm';
import ResetForm from '../_components/ResetForm';

async function ResetPage({ searchParams }: { searchParams: Promise<{ token: string }> }) {
  const token = (await searchParams).token;

  if (!token) {
    return (
      <Suspense>
        <ResetForm />
      </Suspense>
    );
  } else {
    const result = await verifyResetToken(token);

    if (!result.success) {
      return <ErrorMessage msg="An error ocuured. Try again!" />;
    }

    return (
      <Suspense>
        <NewPasswordForm token={result.token} />
      </Suspense>
    );
  }
}

export default ResetPage;
