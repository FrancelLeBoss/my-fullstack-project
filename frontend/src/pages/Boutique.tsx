import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiFilter, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BsArrowDownUp } from "react-icons/bs";
import CheckboxFilter from "../components/general/CheckBox";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { User } from "../types/User";
import useProduct from "../hooks/useProduct";
import {
  CategoryDetails, Product, ProductVariant,
  VariantImage, VariantWithImages,
} from "../types/Product";
import { useCategories } from "../hooks/useCategories";
import { resolveMediaUrl } from "../utils/mediaUrl";

const ITEMS_PER_PAGE = 6;

export const new_price = (price: number, discount: number): string => {
  if (!price || !discount) return "0";
  return (price - (price * discount) / 100).toFixed(2);
};

export const Boutique = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [showFilters, setShowFilters] = useState(true);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { slug } = useParams();
  const { data, isLoading, error } = useCategories();
  const categories: CategoryDetails[] = Array.isArray(data) ? data : [];
  const { topRatedProducts } = useProduct();
  const categoryDetails = categories.find((cat) => cat.slug === slug);
  const user: User | null = useSelector((state: RootState) => state.user.user);

  const [genderClicked, setGenderClicked] = useState(false);
  const [priceClicked, setPriceClicked] = useState(false);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const [productHovered, setProductHovered] = useState(-1);
  const [photoHovered, setPhotoHovered] = useState<{ img: string; index: number } | null>(null);
  const [filtered, setFiltered] = useState<{ type: string; value: number } | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [genderFilter, setGenderFilter] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<number[]>([]);
  const [sortingCriteria, setSortingCriteria] = useState("");
  const [displaySorting, setDisplaySorting] = useState(false);
  const [ProductsData, setProductsData] = useState<any[]>([]);
  const [subCategoryList, setSubCategoryList] = useState<any[]>([]);

  // ── Tous les useEffect identiques à l'original ──
  useEffect(() => {
    if (slug === "top-rated") {
      if (topRatedProducts) { setProductsData(topRatedProducts); setSubCategoryList([]); }
      return;
    }
    if (!categoryDetails?.id) return;
    axiosInstance.get<any[]>(`api/products/category/${categoryDetails.id}/`)
      .then((r) => setProductsData(r.data))
      .catch((e) => console.error("Error fetching products:", e));
    axiosInstance.get<any[]>(`api/categories/${categoryDetails.id}/subcategories`)
      .then((r) => setSubCategoryList(r.data))
      .catch((e) => console.error("Error fetching subcategories:", e));
  }, [categoryDetails, slug, topRatedProducts]);

  useEffect(() => {
    if (user?.id) {
      axiosInstance.get(`api/cart/${user.id}/`).then(async (r) => {
        const items = await Promise.all((r.data as any[]).map(async (item) => {
          const vr = await axiosInstance.get(`api/products/variant/${item.variant}/`);
          const sr = await axiosInstance.get(`api/products/size/${item.size}/`);
          return { id: item.id, variant: vr.data, size: sr.data, quantity: item.quantity };
        }));
        dispatch({ type: "cart/updateCart", payload: items });
      }).catch(console.error);
      axiosInstance.get(`api/wishlist/`).then(async (r) => {
        const items = await Promise.all((r.data as any[]).map(async (item) => {
          const vr = await axiosInstance.get(`api/products/variant/${item.variant}/`);
          const sr = await axiosInstance.get(`api/products/size/${item.size}/`);
          return { id: item.id, variant: vr.data, size: sr.data };
        }));
        dispatch({ type: "wishlist/updateWishlist", payload: items });
      }).catch(console.error);
    }
  }, [user, apiBaseUrl, dispatch]);

  useEffect(() => { setCurrentPage(1); }, [filtered, genderFilter, priceFilter]);

  // ── Toutes les fonctions identiques à l'original ──
  const productsBySubCategory = (subCat: number): Product[] =>
    ProductsData.filter((p: Product) => p.subCategory === subCat);

  const totalPages = () => {
    let f = ProductsData;
    if (filtered?.value) f = f.filter((p) => p.subCategory === filtered.value);
    if (genderFilter.length > 0) f = f.filter((p) => genderFilter.includes(p.gender));
    if (priceFilter.length > 0) f = f.filter((p) => p?.variants[0]?.price <= Math.max(...priceFilter.map((v) => v || 0)));
    return Math.ceil(f.length / ITEMS_PER_PAGE);
  };

  const getHighestPrice = (p: Product[]) => Math.max(...p.map((x: Product) => x?.variants[0]?.price || 0));
  const getLowestPrice = (p: Product[]) => Math.min(...p.map((x: Product) => x?.variants[0]?.price || 0));
  const getMedianPrice = (products: any[]) => {
    const prices = products.map((p) => parseFloat(p?.variants[0]?.price) || 0).filter((p) => !isNaN(p)).sort((a, b) => a - b);
    if (!prices.length) return 0;
    const mid = Math.floor(prices.length / 2);
    return prices.length % 2 !== 0 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2;
  };

  const thereIsDiscount = (product: Product): [number, number] => {
    if (!product?.variants?.length) {
      return [0, -1];
    }

    return product.variants.reduce<[number, number]>(
      (max, v: ProductVariant, i: number) => {
        return v.discount > max[0] ? [v.discount, i] : max;
      },
      [0, -1]
    );
  };

  const indexOfMainImageOfvariant = (variant: VariantWithImages): number => {
    const i = variant.images.findIndex((img: VariantImage) => img.mainImage === true);
    return i !== -1 ? i : 0;
  };

  const displayedProducts = () => {
    let f = ProductsData;
    if (filtered) f = f.filter((p) => p.subCategory === filtered.value);
    if (genderFilter.length > 0) f = f.filter((p) => genderFilter.includes(p.gender));
    if (priceFilter.length > 0) f = f.filter((p) => p?.variants[0]?.price <= Math.max(...priceFilter.map((v) => v || 0)));
    return f.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const sortedProducts = () => {
    const base = displayedProducts();
    if (sortingCriteria === "by name") return [...base].sort((a, b) => a.title.localeCompare(b.title));
    if (sortingCriteria === "by price") return [...base].sort((a, b) => a?.variants[0]?.price - b?.variants[0]?.price);
    return base;
  };

  const handleFilterChange = (s: string | string[]) => setGenderFilter(Array.isArray(s) ? s : [s]);
  const handleFilterPriceChange = (s: string | string[]) => setPriceFilter((Array.isArray(s) ? s : [s]).map(Number));
  const handleSorting = (s: string | string[]) => setSortingCriteria(Array.isArray(s) ? s[0] || "" : s);

  const pageTitle = slug === "top-rated" ? "Top Rated Products" : categoryDetails?.title ?? "Loading...";
  const pageDesc = slug === "top-rated"
    ? `Discover our best products (${ProductsData?.length})`
    : `${categoryDetails?.short_desc ?? "Loading..."} (${ProductsData?.length})`;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">

      {/* ── Hero banner catégorie ── */}
      <div className="bg-gradient-to-r from-primary to-secondary py-8">
        <div className="container">
          {/* Breadcrumb */}
          <div className="text-sm text-white/70 mb-2 flex items-center gap-1.5">
            <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
            <span>/</span>
            <span className="text-white font-medium capitalize">{pageTitle}</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">{pageTitle}</h1>
          <p className="text-white/70 text-sm mt-1">{pageDesc}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">

        {/* ── Barre filtres / tri ── */}
        <div className="flex items-center justify-between mb-6
        bg-white dark:bg-gray-900 rounded-2xl px-5 py-3
        shadow-sm border border-gray-100 dark:border-gray-800">

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl
            transition-all duration-200
            ${showFilters
              ? "bg-primary text-white shadow-md shadow-primary/30"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <FiFilter />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Sort by */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDisplaySorting((value) => !value)}
              className="flex items-center gap-2 text-sm font-semibold
              px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800
              text-gray-600 dark:text-gray-300
              hover:bg-primary/10 hover:text-primary
              transition-all duration-200"
              aria-haspopup="menu"
              aria-expanded={displaySorting}
            >
              <BsArrowDownUp className="text-xs" />
              Sort By
              <FiChevronDown className={`transition-transform duration-200 ${displaySorting ? "rotate-180" : ""}`} />
            </button>

            {displaySorting && (
              <div className="absolute right-0 top-full mt-1 w-44 z-50
              bg-white dark:bg-gray-800 rounded-xl shadow-xl shadow-black/10
              border border-gray-100 dark:border-gray-700 p-2 max-h-72 overflow-y-auto">
                <CheckboxFilter
                  options={["by name", "by price"]}
                  labels={["By name", "By price"]}
                  uniqueSelection={true}
                  onFilterChange={handleSorting}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Layout sidebar + grille ── */}
        <div className="flex gap-6">

          {/* Sidebar filtres */}
          <aside className={`transition-all duration-500 overflow-hidden shrink-0
            ${showFilters ? "w-60 opacity-100" : "w-0 opacity-0"}`}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5
            shadow-sm border border-gray-100 dark:border-gray-800
            flex flex-col gap-5">

              <h2 className="font-bold text-sm uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Filters
              </h2>

              {/* Sous-catégories */}
              {subCategoryList.length > 0 && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Category
                  </p>
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
                            setFiltered(null); setSelected(null);
                          }
                        }}
                        className={`flex items-center justify-between text-sm px-3 py-2 rounded-xl
                        transition-all duration-200 capitalize text-left
                        ${selected === category?.id
                          ? "bg-primary text-white font-semibold"
                          : "text-gray-600 dark:text-gray-400 hover:bg-primary/10 hover:text-primary"
                        }`}
                      >
                        <span>{category?.title}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full
                        ${selected === category?.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="h-px bg-gray-100 dark:bg-gray-800" />

              {/* Gender */}
              <div className="flex flex-col gap-2">
                <button
                  className="flex items-center justify-between text-sm font-semibold
                  text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200"
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

              {/* Price */}
              <div className="flex flex-col gap-2">
                <button
                  className="flex items-center justify-between text-sm font-semibold
                  text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200"
                  onClick={() => setPriceClicked(!priceClicked)}
                >
                  <span>Price range</span>
                  {priceClicked ? <FiChevronUp className="text-primary" /> : <FiChevronDown />}
                </button>
                {priceClicked && (
                  <div className="pt-1">
                    <CheckboxFilter
                      options={[
                        getLowestPrice(ProductsData).toString(),
                        getMedianPrice(ProductsData).toString(),
                        getHighestPrice(ProductsData).toString(),
                      ]}
                      labels={[
                        `$${getLowestPrice(ProductsData).toFixed(2)}`,
                        `$${getMedianPrice(ProductsData).toFixed(2)}`,
                        `$${getHighestPrice(ProductsData).toFixed(2)}`,
                      ]}
                      onFilterChange={handleFilterPriceChange}
                      uniqueSelection={true}
                    />
                  </div>
                )}
              </div>

            </div>
          </aside>

          {/* ── Grille produits ── */}
          <div className={`grid gap-5 flex-1
          ${showFilters
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          }`}>
            {sortedProducts()?.map((item) => {
              const [discountVal, discountIdx] = thereIsDiscount(item);
              const hasDiscount = discountVal > 0;

              return (
                <div
                  key={item.id}
                  className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden
                  shadow-sm hover:shadow-xl hover:shadow-primary/10
                  border border-gray-100 dark:border-gray-800
                  transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-800"
                    onMouseEnter={() => { setProductHovered(item.id); setPhotoHovered(null); }}
                    onMouseLeave={() => setProductHovered(-1)}
                  >
                    <Link to={`/product/${item.id}/${
                      productHovered === item.id && photoHovered?.index !== undefined
                        ? photoHovered.index : item.variants[0].id
                    }`}>
                      <img
                        src={productHovered === item.id && photoHovered?.index !== undefined
                          ? photoHovered.img
                          : resolveMediaUrl(
                              item?.variants[0]?.images[indexOfMainImageOfvariant(item?.variants[0])]?.image,
                              apiBaseUrl
                            )
                        }
                        alt={item.title}
                        className="w-full xl:h-[360px] lg:h-[300px] md:h-[260px] h-[220px]
                        object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Badge discount */}
                    {hasDiscount && (
                      <span className="absolute top-3 left-3 bg-secondary text-white
                      text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                        -{item.variants[discountIdx]?.discount}%
                      </span>
                    )}

                    {/* Variants au hover */}
                    {productHovered === item.id && (
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 px-3">
                        {item?.variants.map((element: ProductVariant) => (
                          <Link to={`/product/${item.id}/${element?.id}`} key={element.id}>
                            <img
                              src={resolveMediaUrl(
                                element?.images[indexOfMainImageOfvariant(element)]?.image,
                                apiBaseUrl
                              )}
                              className="w-9 h-9 rounded-lg object-cover border-2 border-white
                              hover:border-primary transition-all duration-200 shadow-md"
                              onMouseEnter={() => setPhotoHovered({
                                img: resolveMediaUrl(element?.images[indexOfMainImageOfvariant(element)]?.image, apiBaseUrl),
                                index: element.id,
                              })}
                              onClick={() => window.location.href = `/product/${item.id}/${element?.id}`}
                            />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Infos produit */}
                  <div className="p-4 flex flex-col gap-1.5">
                    <h3 className="font-semibold text-sm dark:text-white truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {item.short_desc}
                    </p>

                    {/* Prix */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-secondary dark:text-primary text-base">
                        ${hasDiscount
                          ? new_price(item?.variants[discountIdx]?.price, item.variants[discountIdx]?.discount)
                          : item?.variants[0]?.price
                        }
                      </span>
                      {hasDiscount && (
                        <>
                          <s className="text-xs text-gray-400">
                            ${item?.variants[discountIdx]?.price}
                          </s>
                          <span className="text-xs font-semibold text-green-500 bg-green-50
                          dark:bg-green-900/20 px-1.5 py-0.5 rounded-full">
                            -{item.variants[discountIdx]?.discount}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Pagination ── */}
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-semibold rounded-xl
            bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
            text-gray-600 dark:text-gray-300
            hover:border-primary hover:text-primary
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200"
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages() }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200
              ${currentPage === page
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/30"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary hover:text-primary"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages()))}
            disabled={currentPage === totalPages()}
            className="px-4 py-2 text-sm font-semibold rounded-xl
            bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
            text-gray-600 dark:text-gray-300
            hover:border-primary hover:text-primary
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200"
          >
            Next →
          </button>
        </div>

      </div>
    </div>
  );
};

export default Boutique;