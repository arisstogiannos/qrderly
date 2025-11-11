'use client';

import { Suspense } from 'react';
import FeedbackForm from './FeedbackForm';

export default function page() {
  return (
    <Suspense>
      <FeedbackForm />
    </Suspense>
  );
}
