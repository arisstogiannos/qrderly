import type { Menu, Template } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ErrorMessage } from '@/components/Messages';
import { themes } from '@/data';
import CustomThemeMaker from './CustomThemeMaker';

export default function ThemeSettings({
  menu,
  template,
  errors,
}: {
  menu?: Menu;
  template: Template;
  errors: string[] | undefined;
}) {
  const t = useTranslations('menu settings');
  const [selectedTheme, setSelectedTheme] = useState<string>(menu?.theme ?? themes[template][0]);

  function handleThemeChange(theme: string) {
    const themeColors = theme.split(',');
    const variables = ['background', 'secondary', 'primary', 'text'];

    const root = document.querySelector(':root') as HTMLElement;
    themeColors.forEach((c, i) => {
      const variable = `--${variables[i]}-mockup`;
      if (root) {
        root.style.setProperty(variable, c);
      }
    });
    setSelectedTheme(theme);
  }

  useEffect(() => {
    handleThemeChange(menu?.theme ?? themes[template][0]);
  }, [template]);

  return (
    <div className="grid gap-3 ">
      <div>
        <p>{t('Theme')}</p>
        {/* <p className="text-sm sm:text-base text-muted-foreground">
        Change the appearance of your menu by selecting between light, dark
        and custom themes for a more personalized look
        </p> */}
        <p className="text-sm sm:text-base text-muted-foreground">Default</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {themes[template].map((theme) => {
          const colors = theme.split(',', 3);
          return (
            <label key={theme} className="cursor-pointer">
              <input
                type="radio"
                name="theme"
                value={theme}
                checked={selectedTheme === theme}
                className="hidden peer"
                onChange={() => handleThemeChange(theme)}
              />
              <div className="sm:size-24 size-20 overflow-hidden rounded-3xl grid grid-cols-3 border-4 transition-all peer-checked:border-black border-transparent">
                {colors.map((color) => (
                  <div key={color} style={{ backgroundColor: color }} />
                ))}
              </div>
            </label>
          );
        })}
      </div>
      <CustomThemeMaker defaultColors={selectedTheme.split(',')} />
      {errors?.map((er) => {
        return <ErrorMessage key={er} classNames="text-sm bg-transparent p-0 " msg={er} />;
      })}
    </div>
  );
}
