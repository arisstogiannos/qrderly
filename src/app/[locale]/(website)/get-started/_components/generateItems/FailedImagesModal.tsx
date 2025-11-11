import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CloudImage from '@/components/CloudImage';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default function FailedImagesModal({ images }: { images: string[] }) {
  const t = useTranslations('uploadingForm');

  const product = useParams().product?.toString();
  return (
    <>
      <div className="w-full h-full flex flex-col lg:flex-row items-center gap-4 justify-center">
        {images.map((image, index) => (
          <CloudImage
            key={index}
            width={500}
            height={300}
            className="object-contain"
            alt="failed image to upload"
            src={image}
          />
        ))}
      </div>
      <div>
        <Button asChild className="w-full">
          <Link
            href={{
              pathname: '/get-started/[product]/customize-qr',
              params: { product: product ?? '' },
            }}
          >
            {t('failedImagesDialogBtn')}
          </Link>
        </Button>
      </div>
    </>
  );
}
