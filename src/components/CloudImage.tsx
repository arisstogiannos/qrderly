'use client';
import React from 'react';
import { CldImage, CldImageProps } from 'next-cloudinary';
import Image from 'next/image';


function CloudImage(props: CldImageProps) {
  if(props.src ==="") return <Image src={"/image-placeholder.png"} quality={100} fill alt="placeholder" className={ props.className} /> 
  return <CldImage {...props}  />;
}

export default CloudImage;
