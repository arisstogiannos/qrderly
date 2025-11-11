import './globals.css';

// export const dynamicParams = true; // or false, to 404 on unknown paths
// // export const revalidate = 60

export async function generateStaticParams() {
  return [
    {
      locale: 'en',
    },
    { locale: 'el' },
  ];
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
