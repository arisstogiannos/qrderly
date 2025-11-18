'use client';

import type { Template } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import Template1 from './_templates/Template1';
import Template2 from './_templates/Template2';

export default function Mockup({ initialTemplate }: { initialTemplate: Template }) {
  const searchParams = useSearchParams();
  const template = searchParams.get('t') || initialTemplate;
  return template === 'T1' ? <Template1 /> : <Template2 />;
}
