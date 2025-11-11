'use client';

import type { Settings } from '@prisma/client';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { deleteAccount } from '../../(business)/[businessName]/dashboard/_actions/deleteAccount';
import { updateSettings } from './actions';

export default function UserSettings({ settings, userId }: { settings: Settings; userId: string }) {
  const t = useTranslations('userSettings');
  const [notifications, setNotifications] = useState({
    receiveMenuNotifications: settings.receiveMenuNotifications,
    receiveOrderNotifications: settings.receiveOrderNotifications,
    receivePromotionNotifications: settings.receivePromotionNotifications,
    receiveNewsletterNotifications: settings.receiveNewsletterNotifications,
    receiveSurveyNotifications: settings.receiveSurveyNotifications,
    receiveFeedbackNotifications: settings.receiveFeedbackNotifications,
  });
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (setting: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  useEffect(() => {
    setSettingsChanged(
      settings.receiveMenuNotifications !== notifications.receiveMenuNotifications ||
        settings.receiveOrderNotifications !== notifications.receiveOrderNotifications ||
        settings.receivePromotionNotifications !== notifications.receivePromotionNotifications ||
        settings.receiveNewsletterNotifications !== notifications.receiveNewsletterNotifications ||
        settings.receiveSurveyNotifications !== notifications.receiveSurveyNotifications ||
        settings.receiveFeedbackNotifications !== notifications.receiveFeedbackNotifications,
    );
  }, [notifications, settings]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateSettings({
      ...notifications,
      userId,
      updatedAt: new Date(),
      id: settings.id,
    });
    setIsSaving(false);
  };

  return (
    <div className="container max-w-4xl py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">{t('title')}</h1>

      <section className="mb-10 flex flex-col">
        <div className="mb-4 flex md:items-center flex-col md:flex-row justify-between">
          <h2 className="text-xl font-semibold">{t('emailNotifications.title')}</h2>
          <p className="text-sm text-muted-foreground">{t('emailNotifications.description')}</p>
        </div>
        <Separator className="mb-6" />

        <div className="space-y-4">
          <NotificationCard
            title={t('emailNotifications.menuUpdates.title')}
            description={t('emailNotifications.menuUpdates.description')}
            checked={notifications.receiveMenuNotifications}
            onToggle={() => handleToggle('receiveMenuNotifications')}
          />

          <NotificationCard
            title={t('emailNotifications.orderStatus.title')}
            description={t('emailNotifications.orderStatus.description')}
            checked={notifications.receiveOrderNotifications}
            onToggle={() => handleToggle('receiveOrderNotifications')}
          />

          <NotificationCard
            title={t('emailNotifications.promotions.title')}
            description={t('emailNotifications.promotions.description')}
            checked={notifications.receivePromotionNotifications}
            onToggle={() => handleToggle('receivePromotionNotifications')}
          />

          <NotificationCard
            title={t('emailNotifications.newsletter.title')}
            description={t('emailNotifications.newsletter.description')}
            checked={notifications.receiveNewsletterNotifications}
            onToggle={() => handleToggle('receiveNewsletterNotifications')}
          />

          <NotificationCard
            title={t('emailNotifications.surveys.title')}
            description={t('emailNotifications.surveys.description')}
            checked={notifications.receiveSurveyNotifications}
            onToggle={() => handleToggle('receiveSurveyNotifications')}
          />

          <NotificationCard
            title={t('emailNotifications.feedback.title')}
            description={t('emailNotifications.feedback.description')}
            checked={notifications.receiveFeedbackNotifications}
            onToggle={() => handleToggle('receiveFeedbackNotifications')}
          />
        </div>
        <Button
          className="w-full md:w-fit ml-auto mt-6"
          onClick={() => handleSave()}
          disabled={isSaving || !settingsChanged}
        >
          {isSaving ? t('saving') : t('saveChanges')}
        </Button>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-red-600">{t('dangerZone.title')}</h2>
        </div>
        <Separator className="mb-6" />

        <Card className="border-red-200 bg-red-50 p-6">
          <div className="flex items-start justify-between flex-col md:flex-row gap-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-red-800">{t('dangerZone.deleteAccount.title')}</h3>
              <p className="text-sm text-red-700">{t('dangerZone.deleteAccount.description')}</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2 w-full md:w-fit">
                  <Trash2 className="h-4 w-4" />
                  {t('dangerZone.deleteAccount.title')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('dangerZone.deleteAccount.confirmTitle')}</DialogTitle>
                  <DialogDescription>
                    {t('dangerZone.deleteAccount.confirmDescription')}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">{t('dangerZone.deleteAccount.cancel')}</Button>
                  <Button variant="destructive" onClick={deleteAccount}>
                    {t('dangerZone.deleteAccount.confirm')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </section>
    </div>
  );
}

function NotificationCard({
  title,
  description,
  checked,
  onToggle,
}: {
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Card className="flex-row items-center justify-between p-4 w-full">
      <div className="space-y-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </Card>
  );
}
