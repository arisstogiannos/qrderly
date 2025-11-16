'use client';

import { DownloadIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function PWAInstallPrompt() {
  const t = useTranslations('pwaInstallPrompt');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    }

    function handleAppInstalled() {
      setIsVisible(false);
      setDeferredPrompt(null);
    }

    const dismissedInStorage = localStorage.getItem('pwa-install-prompt-dismissed');

    if (dismissedInStorage) {
      setIsVisible(false);
      return;
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) {
      return;
    }

    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsVisible(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error showing install prompt:', error);
    } finally {
      setDeferredPrompt(null);
      setIsInstalling(false);
    }
  }

  function handleDismiss() {
    setIsDismissed(true);
    localStorage.setItem('pwa-install-prompt-dismissed', 'true');
    setTimeout(() => {
      setDeferredPrompt(null);
      setIsVisible(false);
    }, 600);
  }

  if (!isVisible || !deferredPrompt) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed top-4 left-1/2 z-50 -translate-x-1/2 transform transition-all duration-300 fill-mode-forwards ease-in-out',
        isDismissed
          ? 'fade-out-0 slide-out-to-top-25 animate-out'
          : 'fade-in-0 slide-in-from-top-25 animate-in',
      )}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3 rounded-lg border bg-background px-4 py-3 shadow-lg">
        <div className="flex flex-1 items-center gap-3">
          <DownloadIcon className="size-5 text-primary" />
          <div className="flex-1 pr-4">
            <p className="text-sm font-medium">{t('title')}</p>
            <p className="text-xs text-muted-foreground">{t('description')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleInstallClick} disabled={isInstalling} className="shrink-0">
            {isInstalling ? t('installing') : t('install')}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDismiss}
            className="size-8 shrink-0"
            aria-label={t('dismiss')}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
