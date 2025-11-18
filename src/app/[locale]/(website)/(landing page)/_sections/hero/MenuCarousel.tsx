import Image from 'next/image';

interface InfiniteCarouselProps {
  speed?: number;
  height?: number;
  width?: number;
}
const images = ['/menus/restaurant.png', '/menus/bar.png', '/menus/cafe.png'];
export default function InfiniteCarousel({
  speed = 20, // seconds to complete one cycle
  height = 320,
  width = 150,
}: InfiniteCarouselProps) {
  const duplicatedImages = [...images];
  return (
    <div
      className="relative w-screen xl:w-full xl:hidden  top-0 left-1/2 -translate-x-1/2  overflow-hidden mt-14"
      style={{ height }}
    >
      {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-full  bg-gradient-to-r from-background/5 via-transparent to-background/5 z-10" /> */}
      <div
        className="flex  gap-3 w-full items-center justify-center "
        // style={{
        //   animationDuration: `${speed}s`,
        //   animationTimingFunction: "linear",
        //   animationIterationCount: "infinite",
        //   width: `${duplicatedImages.length * width}px`,
        // }}
      >
        {duplicatedImages.map((image, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            className="flex-shrink-0 "
            style={{ width: `${width}px` }}
          >
            <Image
              priority
              src={image || '/placeholder.svg'}
              alt={`Carousel image ${index}`}
              width={width}
              height={height}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
