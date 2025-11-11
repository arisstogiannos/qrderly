import MenuItem from '../MenuItem';
import Nav from '../Nav';

export default function Template1() {
  const categories = ['Category 1', 'Category 2', 'Category 3'];
  return (
    <div className="flex flex-col space-y-4 min-[380px]:w-xs w-[300px] overflow-hidden h-[400px] sm:h-[600px] rounded-t-3xl sm:rounded-b-3xl drop-shadow-xl text-xs px-4 bg-background-mockup mx-auto text-text-mockup">
      <Nav />

      <div className="  ">
        <div className=" flex items-center gap-2 scrollbar-hidden overflow-auto py-1 text-xs capitalize   text-text-mockup">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={
                'rounded-full px-5 py-2 text-nowrap  font-medium transition-colors  xl:hover:bg-primary-mockup first-of-type:bg-primary-mockup bg-primary-mockup/30'
              }
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {[1, 2, 3, 4, 5, 5].map((_, i) => (
          <MenuItem key={i} index={i + 1} />
        ))}
      </div>
    </div>
  );
}
