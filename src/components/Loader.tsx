import { cn } from '@/lib/utils';

export default function Loader({ className }: React.ComponentProps<'span'>) {
  return (
    <div className={cn('h-[95%] w-auto aspect-square place-content-center ', className)}>
      {/* <LucideLoader size={"40px"} className="animate-spin place-self-center" /> */}
      <span className="loader " />
    </div>
  );
}
