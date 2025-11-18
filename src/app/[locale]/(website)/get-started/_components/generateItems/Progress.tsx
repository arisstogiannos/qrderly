'use client';

import { CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import { cn } from '@/lib/utils';

export default function ProgressSteps({
  taskIsRunning,
  time,
}: {
  taskIsRunning: boolean;
  time?: number;
}) {
  const t = useTranslations('progress');
  const [isRunning, setIsRunning] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 1, title: t('extractingItems') },
    { id: 2, title: t('translatingLanguages') },
    { id: 3, title: t('creatingMenu') },
  ];

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    if (isRunning && currentStep < 4) {
      if (currentStep === 0) {
        setCurrentStep(1);
      }

      if (currentStep < 3) {
        const timeout = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, time ?? 8000);
        timeouts.push(timeout);
      } else if (currentStep === 3) {
        const resetTimeout = setTimeout(() => {
          setIsRunning(false);
        }, time ?? 6000);
        timeouts.push(resetTimeout);
      }
    }

    return () => {
      timeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, [isRunning, currentStep]);

  useEffect(() => {
    if (!taskIsRunning) {
      setCurrentStep(4);
    }
  }, [taskIsRunning]);

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              'flex items-center p-4 border rounded-lg transition-all duration-200',
              currentStep === step.id ? 'border-primary' : 'border-border',
              currentStep < step.id ? 'opacity-50' : 'opacity-100',
            )}
          >
            <div className="mr-4 w-6 h-6 flex items-center justify-center">
              {currentStep > step.id || !taskIsRunning ? (
                <CheckCircle className="text-green-500 w-6 h-6" />
              ) : currentStep === step.id ? (
                <Loader className="h-8 text-[12px] mx-auto" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium">{step.title}</p>
              <p className="text-sm text-muted-foreground">
                {currentStep > step.id
                  ? t('completed')
                  : currentStep === step.id
                    ? t('inProgress')
                    : t('waiting')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {currentStep > 0 && (
        <div className="w-full bg-muted rounded-full h-2.5 mt-4">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
