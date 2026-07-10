import { Link } from "react-router-dom";
import { BsArrowDownUp } from "react-icons/bs";
import { FiFilter, FiChevronDown } from "react-icons/fi";
import BoutiqueFiltersPanel from "./Boutique/BoutiqueFiltersPanel";
import BoutiqueProductsGrid from "./Boutique/BoutiqueProductsGrid";
import CheckboxFilter from "../components/general/CheckBox";
import { useBoutiquePage } from "./Boutique/useBoutiquePage";

export { new_price } from "../utils/price";

const Boutique = () => {
  const boutique = useBoutiquePage();

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="bg-gradient-to-r from-primary to-secondary py-8">
        <div className="container">
          <div className="text-sm text-white/70 mb-2 flex items-center gap-1.5">
            <Link to="/" className="hover:text-white transition-colors duration-200">
              Home
            </Link>
            <span>/</span>
            <span className="text-white font-medium capitalize">{boutique.pageTitle}</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">{boutique.pageTitle}</h1>
          <p className="text-white/70 text-sm mt-1">{boutique.pageDesc}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 bg-white dark:bg-gray-900 rounded-2xl px-5 py-3 shadow-sm border border-gray-100 dark:border-gray-800">
          <button
            onClick={() => boutique.setShowFilters((value) => !value)}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
              boutique.showFilters
                ? "bg-primary text-white shadow-md shadow-primary/30"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <FiFilter />
            {boutique.showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => boutique.setDisplaySorting((value) => !value)}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all duration-200"
              aria-haspopup="menu"
              aria-expanded={boutique.displaySorting}
            >
              <BsArrowDownUp className="text-xs" />
              Sort By
              <FiChevronDown className={`transition-transform duration-200 ${boutique.displaySorting ? "rotate-180" : ""}`} />
            </button>

            {boutique.displaySorting && (
              <div className="absolute right-0 top-full mt-1 w-44 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl shadow-black/10 border border-gray-100 dark:border-gray-700 p-2 max-h-72 overflow-y-auto">
                <CheckboxFilter
                  options={["by name", "by price"]}
                  labels={["By name", "By price"]}
                  uniqueSelection={true}
                  onFilterChange={boutique.handleSorting}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          <BoutiqueFiltersPanel
            showFilters={boutique.showFilters}
            genderClicked={boutique.genderClicked}
            setGenderClicked={boutique.setGenderClicked}
            priceClicked={boutique.priceClicked}
            setPriceClicked={boutique.setPriceClicked}
            subCategoryList={boutique.subCategoryList}
            productsData={boutique.productsData}
            filtered={boutique.filtered}
            setFiltered={boutique.setFiltered}
            selected={boutique.selected}
            setSelected={boutique.setSelected}
            productsBySubCategory={boutique.productsBySubCategory}
            handleFilterChange={boutique.handleFilterChange}
            handleFilterPriceChange={boutique.handleFilterPriceChange}
            getLowestPrice={boutique.getLowestPrice}
            getMedianPrice={boutique.getMedianPrice}
            getHighestPrice={boutique.getHighestPrice}
          />

          <BoutiqueProductsGrid
            products={boutique.visibleProducts}
            showFilters={boutique.showFilters}
            productHovered={boutique.productHovered}
            setProductHovered={boutique.setProductHovered}
            photoHovered={boutique.photoHovered}
            setPhotoHovered={boutique.setPhotoHovered}
            apiBaseUrl={boutique.apiBaseUrl}
            thereIsDiscount={boutique.thereIsDiscount}
            indexOfMainImageOfvariant={boutique.indexOfMainImageOfvariant}
            loading={boutique.isInitialLoading}
          />
        </div>

        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => boutique.setCurrentPage((value) => Math.max(value - 1, 1))}
            disabled={boutique.currentPage === 1}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            ← Prev
          </button>

          {Array.from({ length: boutique.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => boutique.setCurrentPage(page)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200 ${
                boutique.currentPage === page
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/30"
                  : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary hover:text-primary"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => boutique.setCurrentPage((value) => Math.min(value + 1, boutique.totalPages))}
            disabled={boutique.currentPage === boutique.totalPages}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Boutique;
