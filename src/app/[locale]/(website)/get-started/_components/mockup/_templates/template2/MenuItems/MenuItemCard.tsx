import { Card, CardContent } from '@/components/ui/card';
import { formatCurrencyFromCents } from '@/lib/formatter';

export function MenuItemCard({ index }: { index: number }) {
  return (
    <Card
      className={
        'flex py-2 px-2 flex-row border-0 border-b-2 border-text-mockup/10 shadow-none  rounded-none   max-w-full relative    overflow-hidden  text-text bg-transparent  '
      }
    >
      <CardContent className={'flex w-full justify-between py-1 px-0 h-full border-0 shadow-none'}>
        <div className="space-y-1 lg:space-y-1  w-[80%]">
          <h3 className={'text-base  capitalize'}>Product {index}</h3>
          <p className={'line-clamp-2 tracking-wide text-sm text-text-mockup/50  '}>
            description {index}
          </p>
        </div>
        <span className="text-base">{formatCurrencyFromCents(230, 'EUR')}</span>
      </CardContent>
    </Card>
  );
}

// export function ProductCardSkeleton({
//   direction = "vertical",
// }: {
//   direction?: "vertical" | "horizontal";
// }) {
//   return (
//     <Card className={directions[direction].card}>
//       <div
//         className={cn(
//           directions[direction].image,
//           "bg-primary/50 min-w-[140px] animate-pulse"
//         )}
//       ></div>
//       <CardContent className={cn(directions[direction].content, "w-full")}>
//         <div className="space-y-1 lg:space-y-1 w-full">
//           <div
//             className={cn(
//               directions[direction].name,
//               "w-1/2 h-4 rounded-full bg-primary/50 animate-pulse"
//             )}
//           ></div>
//           <div
//             className={cn(
//               directions[direction].description,
//               "w-2/3 h-3 rounded-full bg-primary/30 animate-pulse"
//             )}
//           ></div>
//         </div>
//         <span className="lg:text-lg w-1/3 h-3 rounded-full bg-primary/40 animate-pulse"></span>
//       </CardContent>
//     </Card>
//   );
// }
