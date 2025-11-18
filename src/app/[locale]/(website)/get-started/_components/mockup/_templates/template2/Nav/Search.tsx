import { SearchIcon } from 'lucide-react';

export function SearchBar({ businessName }: { businessName: string }) {
  return (
    <div className="bg-transparent outline-primary-mockup/60 text-foreground relative col-span-full mx-3 flex items-center gap-3 rounded-md px-4 py-2 outline-2 focus-within:outline-primary-mockup">
      <SearchIcon />
      <input
        type="text"
        placeholder="Search"
        className="bg-myWhite placeholder:text-myBlack w-full focus:outline-none"
      />
    </div>
  );
}
