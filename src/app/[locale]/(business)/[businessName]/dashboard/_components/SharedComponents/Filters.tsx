import Categories from '../Categories/Categories';
import LanguageSelect from './LanguageSelect';
import Search from './Search';

export default function Filters({ showCategories = true }: { showCategories?: boolean }) {
  return (
    <div className="md:flex lg:gap-6 grid grid-cols-2 grid-rows-2 gap-3">
      <div className="">
        <LanguageSelect />
      </div>
      <div className="col-span-full">
        <Search />
      </div>
      <div className="col-start-2 row-start-1">{showCategories && <Categories />}</div>
    </div>
  );
}
