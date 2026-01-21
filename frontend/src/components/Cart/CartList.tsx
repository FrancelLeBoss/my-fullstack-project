import React, { useEffect, useState, useMemo } from "react";
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
  if (!items || items.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Your cart is empty</div>;
  }

  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const [selectedIds, setSelectedIds] = useState(items.map(item => item.id));

  const toggleItem = (id: number) => {
    setSelectedIds(prev => 
        prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
};

// Calcul du total dynamique (utilisant useMemo pour la performance)
const totalPrice = useMemo(() => {
    return items
        .filter(item => selectedIds.includes(item.id))
        .reduce((acc, item) => acc + (Number(item.variant?.price) * item.quantity), 0);
}, [items, selectedIds]);

  const isWishlisted = (variantId?: number) => {
    return wishlist.some((item) => item.variant?.id === variantId);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md hover:bg-primary/40 duration-200">
          <input type="checkbox" className="w-4 h-4 border-none border-gray-300 rounded"  
          checked={item?.checked}
          onChange={() => {
          onUpdateChecked?.(item, !item.checked);
          // Utilisez la virgule ici pour l'objet 'item' ou ses propriétés
          console.log("Données de l'item :", item); 
          console.log("Titre :", item.variant?.product?.title, "Coché :", !item.checked);
}}
          />
          <button
            onClick={() => onNavigate?.(item.variant?.product?.id, item.variant?.id)}
            className="flex-shrink-0"
            aria-label="View product"
          >
            <img
              src={imageUrl(item.variant?.images)}
              alt={item.variant?.product?.title || "product"}
              className="w-20 h-20 object-cover rounded"
            />
          </button>

          <div className="flex-1 min-w-0">
            <div
              onClick={() => onNavigate?.(item.variant?.product?.id, item.variant?.id)}
              className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer truncate"
              title={item.variant?.product?.title}
            >
              {item.variant?.product?.title} {item.variant?.color ? `(${item.variant.color})` : ""}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-3">
              <span className="font-semibold">{item.variant?.price} $</span>
              {item.size?.size && <span className="text-gray-500">| Size: <span className="text-primary">{item.size.size}</span></span>}
              {item.size?.size && <span className="text-gray-500 flex items-center gap-2 mt">
    |{isWishlisted(item?.variant?.id)
      ? <BiSolidHeart className="text-base text-primary mt-1 cursor-pointer" />
      : <BiHeart className="text-base text-primary mt-1 cursor-pointer" />
    }
  </span>}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={item.variant?.stock ?? 99}
                value={item.quantity}
                onChange={(e) => {
                  const v = Number(e.target.value) || 1;
                  onUpdateQuantity(item, v, selectedIds.includes(item.id));
                }}
                className="w-16 text-sm border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-900"
                aria-label="Quantity"
              />
            </div>

            <button
              onClick={() => onRemove(item)}
              className="text-red-500 hover:text-red-700 text-sm"
              aria-label="Remove item"
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