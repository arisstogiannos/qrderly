'use client';
import Image from 'next/image';
import { CldImage, type CldImageProps } from 'next-cloudinary';

function CloudImage(props: CldImageProps) {
  if (props.src === '' || props.src === 'pending')
    return (
      <Image
        src={'/image-placeholder.png'}
        quality={100}
        fill
        alt="placeholder"
        className={props.className}
      />
    );

  return <CldImage {...props} />;
}

export default CloudImage;
