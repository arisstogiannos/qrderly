import { ScrollButton } from '@/components/ScrollButton';

const testimonials = [
  {
    name: 'Emily R.',
    comment:
      'Setting up my QR menu was incredibly easy! I had everything ready in minutes without needing any technical help.',
    date: 'March 5, 2024',
  },
  {
    name: 'James T.',
    comment:
      'The ability to customize my menu and update prices instantly has been a game-changer for my café.',
    date: 'February 27, 2024',
  },
  {
    name: 'Sophia L.',
    comment:
      'No more printed menus! My customers love the convenience of scanning a QR code to order.',
    date: 'April 2, 2024',
  },
  {
    name: 'David P.',
    comment:
      'This is the only app that let me create my own menu without needing to contact support. Super intuitive!',
    date: 'March 15, 2024',
  },
  {
    name: 'Laura G.',
    comment:
      'Being able to translate my menu into multiple languages has really helped my international customers.',
    date: 'April 8, 2024',
  },
  {
    name: 'Michael K.',
    comment: 'I love the real-time order notifications! No more confusion in the kitchen.',
    date: 'March 22, 2024',
  },
  {
    name: 'Jessica M.',
    comment: 'Unlimited scans and full customization for my branding? This app is a no-brainer!',
    date: 'April 10, 2024',
  },
  {
    name: 'Oliver W.',
    comment: 'The admin dashboard makes it so easy to track orders and update my menu on the fly.',
    date: 'March 30, 2024',
  },
  {
    name: 'Emma S.',
    comment: 'It’s so simple to use that I had my entire menu set up in under 10 minutes. Love it!',
    date: 'April 5, 2024',
  },
  {
    name: 'Daniel B.',
    comment:
      'Customers can scan, browse, and order without any hassle. My team and I are really happy with this app.',
    date: 'March 12, 2024',
  },
  {
    name: 'Sarah N.',
    comment:
      'The best part? No hidden fees! I got started for free, and the premium features are worth it.',
    date: 'April 1, 2024',
  },
  {
    name: 'Liam C.',
    comment:
      'I was skeptical at first, but this app has completely transformed how we handle orders. Highly recommended!',
    date: 'March 18, 2024',
  },
  {
    name: 'Hannah J.',
    comment: 'Customers love how easy it is to scan and order. Sales have actually increased!',
    date: 'April 6, 2024',
  },
  {
    name: 'Ethan D.',
    comment:
      'A must-have for any restaurant. The design is sleek, and the backend is super powerful.',
    date: 'March 25, 2024',
  },
  {
    name: 'Natalie P.',
    comment:
      'No more ugly PDFs! The interactive menu looks amazing, and my customers appreciate it.',
    date: 'April 9, 2024',
  },
];

export default function Testimonials() {
  return (
    <section className="space-y-6 xl:space-y-10 min-h-[400px] ">
      <div className="flex items-start justify-between md:gap-60">
        <h3 className="font-semibold text-3xl md:text-5xl lg:text-6xl capitalize">
          Don't take our word for it
        </h3>
        <div className="flex-center gap-3">
          <ScrollButton direction="left" />
          <ScrollButton direction="right" />
        </div>
      </div>
      <div className="relative">
        <div
          id="testimonials-container"
          className="scrollbar-hidden flex gap-5 overflow-x-auto absolute top-0 left-1/2 -translate-x-1/2 xl:pr-40 xl:left-0 xl:-translate-x-0 w-screen h-auto px-4 xl:px-0"
        >
          {testimonials.map((t, i) => (
            <Testimonial key={i} index={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonial({
  name,
  comment,
  date,
  index,
}: {
  name: string;
  comment: string;
  date: string;
  index: number;
}) {
  const shades = ['#2077C2', '#399FF5', '#4AA8F7', '#5AB1FA', '#6ABAFF', '#155E95'];
  return (
    <div
      //  style={{backgroundColor:shades[index % shades.length]}}
      className="testimonial bg-foreground text-background rounded-3xl p-3 xl:p-5 flex flex-col gap-3 min-w-[260px] max-w-[260px] sm:min-w-[300px] sm:max-w-[300px]"
    >
      <div className="flex gap-2 items-center">
        <span className="size-7 bg-background rounded-full" />
        <p className="opacity-80 md:text-xl">{name}</p>
      </div>
      <p className="text-lg md:text-2xl ">{comment}</p>
      <p className="opacity-60 ml-auto mt-auto  pt-4">{date}</p>
    </div>
  );
}
