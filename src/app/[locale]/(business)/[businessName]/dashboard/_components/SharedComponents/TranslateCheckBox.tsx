import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function TranslateCheckBox({ name }: { name: string }) {
  const t = useTranslations('translateCheckBox');

  return (
    <div className="flex items-center  gap-5 border-b-2 border-background/10  ">
      <Label htmlFor={name} className="text-foreground  capitalize text-sm">
        {t('label')}
      </Label>
      <Switch id={name} name={name} />
    </div>
  );
}
