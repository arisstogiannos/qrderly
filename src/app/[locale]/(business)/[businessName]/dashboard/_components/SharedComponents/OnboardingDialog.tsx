'use client';

import { ChevronRight, Lightbulb, MessageSquare } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { sendFeedbackEmailAdmin } from '@/email/mail';
import updateSearchParams from '@/lib/updateSearchParams';
import { Modal } from './Modal';

type OnboardingStep = {
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

const feedbackFormSchema = z.object({
  rating: z.string().min(1, { message: 'validation.rating' }),
  feedbackType: z.string().optional(),
  comment: z.string().max(500, { message: 'validation.comment-max' }).optional().or(z.literal('')),
  email: z.string().email({ message: 'validation.email' }).optional().or(z.literal('')),
});

export default function OnboardingDialog() {
  const [currentStep, setCurrentStep] = useState(0);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const isOnboarding = useSearchParams().get('onboarding') === 'true';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();
  const t = useTranslations('onboardingDialog');
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = () => {
    try {
      feedbackFormSchema.parse({
        rating: rating?.toString(),
        comment: feedback,
        email: session.data?.user.email ?? '',
      });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        for (const error of err.errors) {
          const field = error.path[0];
          if (typeof field === 'string') {
            fieldErrors[field] = t(error.message);
          }
        }
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    updateSearchParams('onboarding', 'false');

    try {
      const feedbackData = {
        rating: rating?.toString() ?? '5',
        feedback: 'onboarding',
        message: feedback,
        email: session.data?.user.email ?? '',
      };

      await sendFeedbackEmailAdmin(null, feedbackData);

      toast.success(t('success.title'), {
        description: t('success.description'),
      });
    } catch (error) {
      toast.error(t('error.title'), {
        description: t('error.description'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps: OnboardingStep[] = [
    {
      title: t('steps.0.title'),
      description: t('steps.0.description'),
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
      content: (
        <div className="space-y-4">
          <ul className="space-y-2">
            {[0, 1, 2].map((index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="bg-accent text-background size-9 lg:size-10 rounded-full p-1 min-w-9 lg:min-w-10 flex-center">
                  <span className="bg-primary text-background size-6 lg:size-7 rounded-full p-1 min-w-6 lg:min-w-7 flex-center">
                    {index + 1}
                  </span>
                </span>
                <span>{t(`steps.0.items.${index}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      title: t('steps.1.title'),
      description: t('steps.1.description'),
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>{t('steps.1.prompt')}</p>
          <RadioGroup
            value={rating?.toString()}
            onValueChange={(value) => setRating(Number.parseInt(value))}
          >
            <div className="flex justify-between px-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex flex-col items-center gap-1.5">
                  <RadioGroupItem
                    value={value.toString()}
                    id={`rating-${value}`}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`rating-${value}`}
                    className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 ${
                      rating === value
                        ? 'border-primary bg-primary/10'
                        : 'border-muted hover:border-muted-foreground/50'
                    }`}
                  >
                    {value}
                  </Label>
                  {/* <span className="text-xs text-muted-foreground">
                    {value === 1
                      ? t("steps.1.ratingLabels.1")
                      : value === 5
                      ? t("steps.1.ratingLabels.5")
                      : ""}
                  </span> */}
                </div>
              ))}
            </div>
          </RadioGroup>
          {errors.rating && <p className="text-sm text-destructive">{errors.rating}</p>}
          <div className="space-y-2">
            <Label htmlFor="feedback">{t('steps.1.textareaLabel')}</Label>
            <Textarea
              id="feedback"
              placeholder={t('steps.1.textareaPlaceholder')}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          {errors.comment && <p className="text-sm text-destructive">{errors.comment}</p>}
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];

  return (
    <Modal
      title={currentStepData.title}
      showDesc
      firstOpen={isOnboarding}
      initialOpen={isOnboarding ? undefined : false}
      subtitle={currentStepData.description}
      trigger={null}
      classNames="pt-5"
    >
      <div className="sm:max-w-[500px] flex flex-col">
        <div className="flex items-center justify-center gap-1 py-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-12 rounded-full ${
                index === currentStep ? 'bg-primary' : 'bg-accent'
              }`}
            />
          ))}
        </div>

        <div className="py-4">{currentStepData.content}</div>

        <div className="flex sm:justify-between mt-2 ml-auto">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                {t('buttons.back')}
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>
                {t('buttons.next')} <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader /> : t('buttons.submit')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
