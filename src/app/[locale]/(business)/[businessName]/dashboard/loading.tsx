import Loader from '@/components/Loader';

export default function loading() {
  return (
    <div className="h-[600px] flex-center min-w-full">
      <Loader className="h-16" />
    </div>
  );
}
