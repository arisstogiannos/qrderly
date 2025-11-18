import { CheckCircle, Edit, MoreVertical, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { startTransition } from 'react';
import CloudImage from '@/components/CloudImage';
import DisplayPrice from '@/components/DisplayPrice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBusinessContext } from '@/context/BusinessProvider';
import { cn } from '@/lib/utils';
import type { CategoryWithItemCount, MenuItemWithCategory, Translation } from '@/types';
import { toggleActive } from '../../../_actions/menu-items';
import DeleteModal from '../SharedComponents/DeleteModal';
import { Modal } from '../SharedComponents/Modal';
import MenuItemForm from './MenuItemForm';
import TranslatedMenuItemForm from './TranslatedMenuItemForm';

export default function MenuCategorySection({
  items,
  category,
  language,
  languages,
  handleDelete,
  setOptimisticItem,
  categories,
}: {
  items: MenuItemWithCategory[];
  category: CategoryWithItemCount;
  language: string;
  languages: string;
  handleDelete: (item: MenuItemWithCategory) => void;
  setOptimisticItem: (action: {
    newItem: MenuItemWithCategory;
    type: 'delete' | 'add' | 'update';
  }) => void;
  categories: CategoryWithItemCount[];
}) {
  const t = useTranslations('admin.menu items');
  const { business } = useBusinessContext();

  const categoryTranslationsAsJson: Translation | null = category.translations
    ? JSON.parse(category.translations)
    : null;

  const translatedCategoryName = categoryTranslationsAsJson?.[language]?.name || category.name;

  async function handleTogglActive(item: MenuItemWithCategory) {
    startTransition(() => {
      setOptimisticItem({ newItem: { ...item, isAvailable: !item.isAvailable }, type: 'update' });
    });
    await toggleActive(item.id, !item.isAvailable, business.name);
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">{translatedCategoryName}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const translationsAsJson: Translation | null = item.translations
            ? JSON.parse(item.translations)
            : null;

          const existingTranslation = translationsAsJson?.[language];

          const translatedItem = {
            ...item,
            name:
              existingTranslation && existingTranslation.name
                ? existingTranslation.name
                : item.name,
            description: existingTranslation
              ? (existingTranslation.description ?? null)
              : (item.description ?? null),
          };

          return (
            <Card
              key={item.id}
              id={translatedItem.name}
              className={cn(
                'flex px-3 py-2 flex-row rounded-2xl shadow-lg border-primary/30 border-2  min-[390px]:min-w-[350px] max-w-full relative  min-h-[100px]  overflow-hidden  text-foreground bg-transparent  transition-all duration-300 lg:min-w-full lg:max-w-full',
                !item.isAvailable ? 'text-foreground/30 border-primary/10 ' : '',
              )}
            >
              <div className="absolute bottom-2 right-2 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full opacity-80"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                      <Modal
                        trigger={
                          <Button variant="ghost" className="w-full ">
                            <Edit className="mr-2 h-4 w-4" /> {t('edit')}
                          </Button>
                        }
                        title={
                          language === languages.split(',')[0]
                            ? 'Edit item'
                            : 'Edit item translations'
                        }
                        subtitle=""
                        classNames="pt-5"
                      >
                        {language === languages.split(',')[0] ? (
                          <MenuItemForm
                            categories={categories}
                            item={item}
                            setOptimisticItem={setOptimisticItem}
                          />
                        ) : (
                          <TranslatedMenuItemForm
                            item={translatedItem}
                            setOptimisticItem={setOptimisticItem}
                            language={language}
                          />
                        )}
                      </Modal>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant={!item.isAvailable ? 'default' : 'destructive'}
                      asChild
                    >
                      <Button
                        className="w-full cursor-pointer"
                        variant={'ghost'}
                        onClick={() => handleTogglActive(item)}
                      >
                        {item.isAvailable ? (
                          <>
                            <XCircle className="" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="text-foreground" />
                            Activate
                          </>
                        )}
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" asChild>
                      <DeleteModal item={item} action={() => handleDelete(item)} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {business.menu?.template === 'T1' ? (
                <div className="relative max-w-28 min-w-28 min-h-28 max-h-28 rounded-xl overflow-hidden">
                  {item.imagePath !== 'pending' ? (
                    <CloudImage
                      src={item.imagePath || ''}
                      fill
                      alt={item.name}
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full animate-pulse bg-foreground/40" />
                  )}
                </div>
              ) : null}
              <CardContent
                className={
                  'flex w-full justify-between gap-2 py-1 px-0 h-full border-0 shadow-none'
                }
              >
                <div className="space-y-1 lg:space-y-1  w-[80%]">
                  <h3 className={'text-base lg:text-lg capitalize line-clamp-2'}>
                    {translatedItem.name}
                  </h3>
                  <p className={'line-clamp-2 text-sm text-muted-foreground lg:text-sm '}>
                    {translatedItem.description}
                  </p>
                </div>
                <span className="lg:text-lg ">
                  <DisplayPrice price={item.priceInCents} />
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
