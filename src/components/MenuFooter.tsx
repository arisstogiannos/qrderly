import Link from 'next/link';

export default function MenuFooter() {
  return (
    <footer className="mt-10 w-full flex-center mb-3">
      <Link href={'/'}>Powered by Scanby</Link>
    </footer>
  );
}
