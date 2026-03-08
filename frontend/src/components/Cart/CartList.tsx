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
    return <div className="text-center py-10 text-gray-500 dark:text-gray-400">Your cart is empty</div>;
  }

  const isWishlisted = (variantId?: number) => {
    return wishlist.some((item) => item.variant?.id === variantId);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div 
          key={`${item.id}-${item.size?.id || 'no-size'}`} 
          className={`flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${item.checked ? 'border-primary' : 'border-transparent opacity-70'}`}
        >
          <input 
            type="checkbox" 
            className="w-5 h-5 border-gray-300 rounded cursor-pointer accent-primary"  
            checked={item.checked}
            onChange={(e) => onUpdateChecked?.(item, e.target.checked)}
          />

          {/* IMAGE DU PRODUIT */}
          <button
            onClick={() => onNavigate?.(item.variant?.product?.id, item.variant?.id)}
            className="flex-shrink-0"
          >
            <img
              src={imageUrl(item.variant?.images)}
              alt={item.variant?.product?.title || "product"}
              className="w-20 h-20 object-cover rounded shadow-inner"
            />
          </button>

          {/* INFOS PRODUIT */}
          <div className="flex-1 min-w-0">
            <div
              onClick={() => onNavigate?.(item.variant?.product?.id, item.variant?.id)}
              className="text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer hover:text-primary truncate"
            >
              {item.variant?.product?.title}
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-white font-bold">{item.variant?.price} $</span>
                {item.variant?.color && <span>• {item.variant.color}</span>}
              </div>
              
              <div className="flex items-center gap-3">
                {item.size?.size && (
                  <span>Size: <span className="text-primary font-medium">{item.size.size}</span></span>
                )}
                <span className="flex items-center gap-1 cursor-pointer">
                  | {isWishlisted(item.variant?.id) 
                    ? <BiSolidHeart className="text-primary text-sm" /> 
                    : <BiHeart className="text-primary text-sm" />
                  }
                </span>
              </div>
            </div>
          </div>

          {/* QUANTITÉ ET SUPPRESSION */}
          <div className="flex flex-col items-end gap-3">
            <input
              type="number"
              min={1}
              max={item.variant?.stock ?? 99}
              value={item.quantity}
              onChange={(e) => {
                const v = Math.max(1, Number(e.target.value));
                onUpdateQuantity(item, v, !!item.checked);
              }}
              className="w-14 text-center text-sm border border-gray-200 dark:border-gray-700 rounded-md py-1 bg-gray-50 dark:bg-gray-900 focus:ring-1 focus:ring-primary outline-none"
            />

            <button
              onClick={() => onRemove(item)}
              className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
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