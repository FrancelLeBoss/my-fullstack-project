import { Link } from "react-router-dom";
import type { Product, ProductVariant, VariantImage, VariantWithImages } from "../../types/Product";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const newPrice = (price: number, discount: number): string => {
  if (!price || !discount) return "0";
  return (price - (price * discount) / 100).toFixed(2);
};

interface Props {
  products: Product[];
  showFilters: boolean;
  productHovered: number;
  setProductHovered: (value: number) => void;
  photoHovered: { img: string; index: number } | null;
  setPhotoHovered: (value: { img: string; index: number } | null) => void;
  apiBaseUrl: string;
  thereIsDiscount: (product: Product) => [number, number];
  indexOfMainImageOfvariant: (variant: VariantWithImages) => number;
  loading?: boolean;
}

const BoutiqueProductsGrid = ({
  products,
  showFilters,
  productHovered,
  setProductHovered,
  photoHovered,
  setPhotoHovered,
  apiBaseUrl,
  thereIsDiscount,
  indexOfMainImageOfvariant,
  loading,
}: Props) => {
  const skeletonCards = Array.from({ length: 6 }, (_, index) => index);

  return (
    <>
      {loading && (
        <div className={`grid gap-5 flex-1 ${showFilters ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}>
          {skeletonCards.map((index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 animate-pulse">
                <div className="w-full xl:h-[360px] lg:h-[300px] md:h-[260px] h-[220px] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700" />
              </div>

              <div className="p-4 flex flex-col gap-3">
                <div className="h-4 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-3 w-5/6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-4 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && products.length === 0 && (
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-500 dark:text-gray-400">No products found.</p>
        </div>
      )}
      {!loading && products.length > 0 && (
        <div className={`grid gap-5 flex-1 ${showFilters ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}>
          {products.map((item) => {
            const [discountVal, discountIdx] = thereIsDiscount(item);
            const hasDiscount = discountVal > 0;

            return (
              <div
                key={item.id}
                className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 border border-gray-100 dark:border-gray-800 transition-all duration-300"
              >
                <div
                  className="relative overflow-hidden bg-gray-50 dark:bg-gray-800"
                  onMouseEnter={() => {
                    setProductHovered(item.id);
                    setPhotoHovered(null);
                  }}
                  onMouseLeave={() => setProductHovered(-1)}
                >
                  <Link
                    to={`/product/${item.id}/${
                      productHovered === item.id && photoHovered?.index !== undefined ? photoHovered.index : item.variants[0].id
                    }`}
                  >
                    <img
                      src={
                        productHovered === item.id && photoHovered?.index !== undefined
                          ? photoHovered.img
                          : resolveMediaUrl(item?.variants[0]?.images[indexOfMainImageOfvariant(item?.variants[0])]?.image, apiBaseUrl)
                      }
                      alt={item.title}
                      className="w-full xl:h-[360px] lg:h-[300px] md:h-[260px] h-[220px] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {hasDiscount && (
                    <span className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                      -{item.variants[discountIdx]?.discount}%
                    </span>
                  )}

                  {productHovered === item.id && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 px-3">
                      {item?.variants.map((variant: ProductVariant) => (
                        <Link to={`/product/${item.id}/${variant?.id}`} key={variant.id}>
                          <img
                            src={resolveMediaUrl(variant?.images[indexOfMainImageOfvariant(variant)]?.image, apiBaseUrl)}
                            className="w-9 h-9 rounded-lg object-cover border-2 border-white hover:border-primary transition-all duration-200 shadow-md"
                            onMouseEnter={() =>
                              setPhotoHovered({
                                img: resolveMediaUrl(variant?.images[indexOfMainImageOfvariant(variant)]?.image, apiBaseUrl),
                                index: variant.id,
                              })
                            }
                            onClick={() => (window.location.href = `/product/${item.id}/${variant?.id}`)}
                            alt=""
                          />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col gap-1.5">
                  <h3 className="font-semibold text-sm dark:text-white truncate">{item.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{item.short_desc}</p>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-secondary dark:text-primary text-base">
                      ${hasDiscount ? newPrice(item?.variants[discountIdx]?.price, item.variants[discountIdx]?.discount) : item?.variants[0]?.price}
                    </span>
                    {hasDiscount && (
                      <>
                        <s className="text-xs text-gray-400">${item?.variants[discountIdx]?.price}</s>
                        <span className="text-xs font-semibold text-green-500 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-full">
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
      )}
    </>
  );
};

export default BoutiqueProductsGrid;
