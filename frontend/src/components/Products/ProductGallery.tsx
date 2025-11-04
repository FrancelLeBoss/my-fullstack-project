import React from "react";
import type { ProductVariantImage } from "../../types/Product";

interface Props {
  images: ProductVariantImage[];
  selected: string | null;
  onSelect: (img: string) => void;
  apiBaseUrl: string;
}

const ProductGallery: React.FC<Props> = ({ images, selected, onSelect, apiBaseUrl }) => {
  if (!images?.length) return null;
  return (
    <div className="flex gap-3">
      <div className="flex flex-col gap-2">
        {images.map((img) => (
          <button key={img.id} onMouseEnter={() => onSelect(img.image)} className="w-16 h-16">
            <img src={apiBaseUrl + img.image} className="object-cover w-full h-full rounded" alt="" />
          </button>
        ))}
      </div>
      <div className="flex-1">
        <img src={apiBaseUrl + (selected || images[0].image)} className="w-full rounded" alt="" />
      </div>
    </div>
  );
};

export default ProductGallery;