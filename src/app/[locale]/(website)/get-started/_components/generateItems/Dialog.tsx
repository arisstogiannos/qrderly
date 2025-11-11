'use client';

import { DialogTitle } from '@radix-ui/react-dialog';
import { useTranslations } from 'next-intl';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  Dialog as DialogShadcn,
} from '@/components/ui/dialog';

import FailedImagesModal from './FailedImagesModal';
import ProgressSteps from './Progress';

export default function Dialog({
  jobId,
  failedImages,
  isProcessing,
  runningTime,
}: {
  jobId: string | null;
  failedImages?: string[];
  isProcessing: boolean;
  runningTime: number;
}) {
  const t = useTranslations('uploadingForm');

  return (
    <DialogShadcn open={!!jobId}>
      <DialogContent closeable={false}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-left">
            {failedImages && failedImages.length > 0
              ? t('failedImagesDialogTitle')
              : t('dialogTitle')}
          </DialogTitle>
          {failedImages && failedImages.length > 0 ? (
            <DialogDescription>{t('failedImagesDialogDesc')}</DialogDescription>
          ) : null}
        </DialogHeader>
        {failedImages && failedImages.length > 0 ? (
          <FailedImagesModal images={failedImages} />
        ) : (
          <ProgressSteps taskIsRunning={isProcessing} time={runningTime} />
        )}
      </DialogContent>
    </DialogShadcn>
  );
}
