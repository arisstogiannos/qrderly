export default async function page({ searchParams }: { searchParams: Promise<{ msg: string }> }) {
  const msg = (await searchParams).msg ?? 'Not authorized to see this page';
  return (
    <div className="h-[60vh] w-full flex-center text-3xl font-medium">
      <p>{msg}</p>
    </div>
  );
}
