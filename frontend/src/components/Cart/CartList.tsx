import React from "react";
import { CartItem, VariantImage } from "../../types/Product";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface Props {
  items: CartItem[];
  onRemove: (item: CartItem) => void;
  onUpdateQuantity: (item: CartItem, qty: number, checked: boolean) => void;
  onUpdateChecked?: (item: CartItem, checked: boolean) => void;
  imageUrl: (images?: VariantImage[] | undefined) => string | undefined;
  onNavigate?: (productId: number, variantId?: number) => void;
}

const CartList: React.FC<Props> = ({ items, onRemove, onUpdateQuantity, imageUrl, onNavigate, onUpdateChecked }) => {
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-950/30 py-12 text-center text-gray-500 dark:text-gray-400">
        Your cart is empty
      </div>
    );
  }

  const isWishlisted = (variantId?: number) => {
    return wishlist.some((item) => item.variant?.id === variantId);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div 
          key={`${item.id}-${item.size?.id || 'no-size'}`} 
          className={`group flex items-center gap-4 rounded-2xl p-3 md:p-4 transition-all duration-300 border
            ${item.checked
              ? 'bg-white dark:bg-gray-800 border-primary/40 shadow-[0_14px_35px_-28px_rgba(0,0,0,0.45)]'
              : 'bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 opacity-85'
            }
            hover:shadow-[0_18px_40px_-30px_rgba(0,0,0,0.55)] hover:border-primary/30`}
        >
          <input 
            type="checkbox" 
            className="w-5 h-5 border-gray-300 rounded cursor-pointer accent-primary shrink-0"  
            checked={item.checked}
            onChange={(e) => onUpdateChecked?.(item, e.target.checked)}
          />

          {/* IMAGE DU PRODUIT */}
          <button
            onClick={() => onNavigate?.(item.variant?.product?.id, item.variant?.id)}
            className="flex-shrink-0 relative group/button"
          >
            <img
              src={imageUrl(item.variant?.images)}
              alt={item.variant?.product?.title || "product"}
              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-2xl shadow-inner ring-1 ring-black/5 dark:ring-white/10 group-hover/button:scale-[1.02] transition-transform duration-300"
            />
          </button>

          {/* INFOS PRODUIT */}
          <div className="flex-1 min-w-0">
            <div
              onClick={() => onNavigate?.(item.variant?.product?.id, item.variant?.id)}
              className="text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-primary truncate transition-colors duration-200"
            >
              {item.variant?.product?.title}
            </div>
            
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 text-primary font-bold px-2.5 py-1">
                  {item.variant?.price} $
                </span>
                {item.variant?.color && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-gray-600 dark:text-gray-300">
                    {item.variant.color}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                {item.size?.size && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-1">
                    Size:
                    <span className="text-primary font-semibold">{item.size.size}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-1 cursor-default">
                  {isWishlisted(item.variant?.id)
                    ? <BiSolidHeart className="text-primary text-sm" />
                    : <BiHeart className="text-primary text-sm" />
                  }
                </span>
              </div>
            </div>
          </div>

          {/* QUANTITÉ ET SUPPRESSION */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <input
              type="number"
              min={1}
              max={item.variant?.stock ?? 99}
              value={item.quantity}
              onChange={(e) => {
                const v = Math.max(1, Number(e.target.value));
                onUpdateQuantity(item, v, !!item.checked);
              }}
              className="w-16 md:w-18 text-center text-sm font-semibold border border-gray-200 dark:border-gray-700 rounded-xl py-2 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
            />

            <button
              onClick={() => onRemove(item)}
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors duration-200"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartList;