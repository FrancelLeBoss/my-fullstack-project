import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import CheckboxFilter from "../../components/general/CheckBox";
import type { CategoryDetails, Product } from "../../types/Product";

interface Props {
  showFilters: boolean;
  genderClicked: boolean;
  setGenderClicked: (value: boolean) => void;
  priceClicked: boolean;
  setPriceClicked: (value: boolean) => void;
  subCategoryList: CategoryDetails[];
  productsData: Product[];
  filtered: { type: string; value: number } | null;
  setFiltered: (value: { type: string; value: number } | null) => void;
  selected: number | null;
  setSelected: (value: number | null) => void;
  productsBySubCategory: (subCat: number) => Product[];
  handleFilterChange: (value: string | string[]) => void;
  handleFilterPriceChange: (value: string | string[]) => void;
  getLowestPrice: (products: Product[]) => number;
  getMedianPrice: (products: Product[]) => number;
  getHighestPrice: (products: Product[]) => number;
}

const BoutiqueFiltersPanel = ({
  showFilters,
  genderClicked,
  setGenderClicked,
  priceClicked,
  setPriceClicked,
  subCategoryList,
  productsData,
  filtered,
  setFiltered,
  selected,
  setSelected,
  productsBySubCategory,
  handleFilterChange,
  handleFilterPriceChange,
  getLowestPrice,
  getMedianPrice,
  getHighestPrice,
}: Props) => {
  return (
    <aside className={`transition-all duration-500 overflow-hidden shrink-0 ${showFilters ? "w-60 opacity-100" : "w-0 opacity-0"}`}>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-5">
          <h2 className="font-bold text-sm uppercase tracking-widest text-gray-400 dark:text-gray-500">Filters</h2>

          {subCategoryList.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</p>
              {subCategoryList.map((category) => {
                const count = productsBySubCategory(category?.id).length;
                if (!count) return null;

                return (
                  <button
                    key={category?.id}
                    onClick={() => {
                      if (filtered?.value !== category?.id) {
                        setFiltered({ type: "sub_categorie", value: category?.id });
                        setSelected(category?.id);
                      } else {
                        setFiltered(null);
                        setSelected(null);
                      }
                    }}
                    className={`flex items-center justify-between text-sm px-3 py-2 rounded-xl transition-all duration-200 capitalize text-left ${
                      selected === category?.id
                        ? "bg-primary text-white font-semibold"
                        : "text-gray-600 dark:text-gray-400 hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <span>{category?.title}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        selected === category?.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          <div className="flex flex-col gap-2">
            <button
              className="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200"
              onClick={() => setGenderClicked(!genderClicked)}
            >
              <span>Gender</span>
              {genderClicked ? <FiChevronUp className="text-primary" /> : <FiChevronDown />}
            </button>
            {genderClicked && (
              <div className="pt-1">
                <CheckboxFilter onFilterChange={handleFilterChange} />
              </div>
            )}
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          <div className="flex flex-col gap-2">
            <button
              className="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200"
              onClick={() => setPriceClicked(!priceClicked)}
            >
              <span>Price range</span>
              {priceClicked ? <FiChevronUp className="text-primary" /> : <FiChevronDown />}
            </button>
            {priceClicked && (
              <div className="pt-1">
                <CheckboxFilter
                  options={[
                    getLowestPrice(productsData).toString(),
                    getMedianPrice(productsData).toString(),
                    getHighestPrice(productsData).toString(),
                  ]}
                  labels={[
                    `$${getLowestPrice(productsData).toFixed(2)}`,
                    `$${getMedianPrice(productsData).toFixed(2)}`,
                    `$${getHighestPrice(productsData).toFixed(2)}`,
                  ]}
                  onFilterChange={handleFilterPriceChange}
                  uniqueSelection={true}
                />
              </div>
            )}
          </div>
        </div>
      </aside>
  );
};

export default BoutiqueFiltersPanel;
