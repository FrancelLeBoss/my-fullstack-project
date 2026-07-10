import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import useProduct from "../../hooks/useProduct";
import { useCategories } from "../../hooks/useCategories";
import type { RootState } from "../../redux/store";
import type { CategoryDetails, Product, ProductVariant, VariantImage, VariantWithImages } from "../../types/Product";
import type { User } from "../../types/User";

export const ITEMS_PER_PAGE = 6;

export const newPrice = (price: number, discount: number): string => {
  if (!price || !discount) return "0";
  return (price - (price * discount) / 100).toFixed(2);
};

type FilterState = { type: string; value: number } | null;

type HoverPhoto = { img: string; index: number } | null;

export function useBoutiquePage() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { data, isLoading, error } = useCategories();
  const categories: CategoryDetails[] = Array.isArray(data) ? data : [];
  const { topRatedProducts } = useProduct();
  const categoryDetails = categories.find((cat) => cat.slug === slug);
  const user: User | null = useSelector((state: RootState) => state.user.user);

  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [genderClicked, setGenderClicked] = useState(false);
  const [priceClicked, setPriceClicked] = useState(false);
  const [productHovered, setProductHovered] = useState(-1);
  const [photoHovered, setPhotoHovered] = useState<HoverPhoto>(null);
  const [filtered, setFiltered] = useState<FilterState>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [genderFilter, setGenderFilter] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<number[]>([]);
  const [sortingCriteria, setSortingCriteria] = useState("");
  const [displaySorting, setDisplaySorting] = useState(false);
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [subCategoryList, setSubCategoryList] = useState<CategoryDetails[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setProductsLoading(true);

    if (slug === "top-rated") {
      if (isMounted) {
        setProductsData((topRatedProducts as Product[]) || []);
        setSubCategoryList([]);
        setProductsLoading(false);
      }
      return () => {
        isMounted = false;
      };
    }

    if (!categoryDetails?.id) {
      if (isMounted) setProductsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    Promise.all([
      axiosInstance.get<Product[]>(`api/products/category/${categoryDetails.id}/`),
      axiosInstance.get<CategoryDetails[]>(`api/categories/${categoryDetails.id}/subcategories`),
    ])
      .then(([productsResponse, subCategoriesResponse]) => {
        if (!isMounted) return;
        setProductsData(productsResponse.data);
        setSubCategoryList(subCategoriesResponse.data);
      })
      .catch((fetchError) => console.error("Error fetching products:", fetchError))
      .finally(() => {
        if (isMounted) setProductsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [categoryDetails, slug, topRatedProducts]);

  useEffect(() => {
    if (!user?.id) return;

    axiosInstance
      .get(`api/cart/${user.id}/`)
      .then(async (response) => {
        const items = await Promise.all(
          (response.data as Array<{ id: number; variant: number; size: number | null; quantity: number }>).map(async (item) => {
            const variantResponse = await axiosInstance.get(`api/products/variant/${item.variant}/`);
            const sizeResponse = item.size ? await axiosInstance.get(`api/products/size/${item.size}/`) : { data: null };
            return {
              id: item.id,
              variant: variantResponse.data,
              size: sizeResponse.data,
              quantity: item.quantity,
            };
          })
        );
        dispatch({ type: "cart/updateCart", payload: items });
      })
      .catch(console.error);

    axiosInstance
      .get(`api/wishlist/`)
      .then(async (response) => {
        const items = await Promise.all(
          (response.data as Array<{ id: number; variant: number; size: number | null }>).map(async (item) => {
            const variantResponse = await axiosInstance.get(`api/products/variant/${item.variant}/`);
            const sizeResponse = item.size ? await axiosInstance.get(`api/products/size/${item.size}/`) : { data: null };
            return {
              id: item.id,
              variant: variantResponse.data,
              size: sizeResponse.data,
            };
          })
        );
        dispatch({ type: "wishlist/updateWishlist", payload: items });
      })
      .catch(console.error);
  }, [user, apiBaseUrl, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filtered, genderFilter, priceFilter]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const productsBySubCategory = (subCat: number): Product[] =>
    productsData.filter((product) => product.subCategory === subCat);

  const activeProducts = useMemo(() => {
    let filteredProducts = productsData;

    if (filtered?.value) filteredProducts = filteredProducts.filter((product) => product.subCategory === filtered.value);
    if (genderFilter.length > 0) filteredProducts = filteredProducts.filter((product) => genderFilter.includes(product.gender));
    if (priceFilter.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product?.variants[0]?.price <= Math.max(...priceFilter.map((value) => value || 0))
      );
    }

    return filteredProducts;
  }, [productsData, filtered, genderFilter, priceFilter]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(activeProducts.length / ITEMS_PER_PAGE)), [activeProducts]);

  const visibleProducts = useMemo(() => {
    const slice = activeProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (sortingCriteria === "by name") {
      return [...slice].sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortingCriteria === "by price") {
      return [...slice].sort((a, b) => (a?.variants[0]?.price || 0) - (b?.variants[0]?.price || 0));
    }

    return slice;
  }, [activeProducts, startIndex, sortingCriteria]);

  const handleFilterChange = (value: string | string[]) => setGenderFilter(Array.isArray(value) ? value : [value]);
  const handleFilterPriceChange = (value: string | string[]) => setPriceFilter((Array.isArray(value) ? value : [value]).map(Number));
  const handleSorting = (value: string | string[]) => setSortingCriteria(Array.isArray(value) ? value[0] || "" : value);

  const getHighestPrice = (products: Product[]) => Math.max(...products.map((product) => product?.variants[0]?.price || 0));
  const getLowestPrice = (products: Product[]) => Math.min(...products.map((product) => product?.variants[0]?.price || 0));
  const getMedianPrice = (products: Product[]) => {
    const prices = products
      .map((product) => parseFloat(String(product?.variants[0]?.price)) || 0)
      .filter((price) => !Number.isNaN(price))
      .sort((a, b) => a - b);

    if (!prices.length) return 0;
    const middle = Math.floor(prices.length / 2);
    return prices.length % 2 !== 0 ? prices[middle] : (prices[middle - 1] + prices[middle]) / 2;
  };

  const thereIsDiscount = (product: Product): [number, number] => {
    if (!product?.variants?.length) return [0, -1];

    return product.variants.reduce<[number, number]>((max, variant, index) => {
      return variant.discount > max[0] ? [variant.discount, index] : max;
    }, [0, -1]);
  };

  const indexOfMainImageOfvariant = (variant: VariantWithImages): number => {
    const index = variant.images.findIndex((image: VariantImage) => image.mainImage === true);
    return index !== -1 ? index : 0;
  };

  const pageTitle = slug === "top-rated" ? "Top Rated Products" : categoryDetails?.title ?? "Loading...";
  const pageDesc =
    slug === "top-rated"
      ? `Discover our best products (${productsData.length})`
      : `${categoryDetails?.short_desc ?? "Loading..."} (${productsData.length})`;

  return {
    apiBaseUrl,
    isLoading,
    error,
    productsLoading,
    pageTitle,
    pageDesc,
    categories,
    categoryDetails,
    productsData,
    subCategoryList,
    showFilters,
    setShowFilters,
    currentPage,
    setCurrentPage,
    genderClicked,
    setGenderClicked,
    priceClicked,
    setPriceClicked,
    productHovered,
    setProductHovered,
    photoHovered,
    setPhotoHovered,
    filtered,
    setFiltered,
    selected,
    setSelected,
    genderFilter,
    priceFilter,
    displaySorting,
    setDisplaySorting,
    handleFilterChange,
    handleFilterPriceChange,
    handleSorting,
    getHighestPrice,
    getLowestPrice,
    getMedianPrice,
    thereIsDiscount,
    indexOfMainImageOfvariant,
    visibleProducts,
    productsBySubCategory,
    totalPages,
    startIndex,
    isInitialLoading: isLoading || productsLoading,
  };
}
