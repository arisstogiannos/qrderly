'use client';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useRef } from 'react';

export function ScrollButton({ direction }: { direction: 'left' | 'right' }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scroll = useCallback(() => {
    if (!containerRef.current) {
      containerRef.current = document.getElementById('testimonials-container') as HTMLDivElement;
    }

    const testimonial = document.getElementsByClassName('testimonial')[0];
    if (testimonial && containerRef.current) {
      const { width } = testimonial.getBoundingClientRect();
      containerRef.current.scrollBy({
        left: direction === 'left' ? -width - 20 : width + 20,
        behavior: 'smooth',
      });
    }
  }, [direction]);

  return (
    <button
      onClick={scroll}
      className="bg-foreground text-background p-1 size-12 md:size-14 min-w-12 md:min-w-14 rounded-full flex-center cursor-pointer lg:hover:bg-primary transition-colors duration-200"
    >
      {direction === 'left' ? <ArrowLeft /> : <ArrowRight />}
    </button>
  );
}
