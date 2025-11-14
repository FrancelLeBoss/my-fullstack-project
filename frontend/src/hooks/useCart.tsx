import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";
import { RootState } from "../redux/store";
import { CartItem, VariantImage } from "../types/Product";
import Swal from "sweetalert2";
import { se } from "date-fns/locale";

export default function useCart() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((s: RootState) => s.user);
  const storeItems = useSelector((s: RootState) => s.cart.items) as CartItem[];
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [chooseSizeMsg, setChooseSizeMsg] = useState<string | null>(null);
  const user = useSelector((s: RootState) => s.user.user);
  const [error, setError] = useState<string | null>(null);

  // Local state for optimistic updates
  const [localItems, setLocalItems] = useState<CartItem[]>(storeItems || []);
  const prevItemsRef = useRef<CartItem[]>([]);

  useEffect(() => {
    // sync from store when it changes (initial load or remote updates)
    setLocalItems(storeItems || []);
  }, [storeItems]);

  const imageUrl = (images: VariantImage[] | undefined): string | undefined => {
    const main = images?.find((i) => i.mainImage === true);
    return main ? apiBaseUrl + main.image : images && images.length ? apiBaseUrl + images[0].image : undefined;
  };

    const setMessageSize = useCallback((c: string | null) => {
      setChooseSizeMsg(c);
    }, []);
  

  // local computed total so UI updates immediately with optimistic changes
  const localTotal = useMemo(() => {
    return localItems.reduce((sum, it) => {
      const price = Number(it.variant?.price ?? 0);
      const qty = Number(it.quantity ?? 0);
      return sum + price * qty;
    }, 0);
  }, [localItems]);

  const addToCart = useCallback(async (variantId: number, sizeId: number | null, quantity: number) => {
    console.log("Adding to cart of:", { user});
    if (!user) {
          Swal.fire({
            icon: 'warning',
            title: 'Please log in to add items to your cart: '+user,
            showConfirmButton: true,
            confirmButtonText: 'Get it!',
            confirmButtonColor: '#fea928',
          });
          return;
        }
    setLoading(true);
    setError(null);
    try {
    const res= await axiosInstance.post(
        `${apiBaseUrl}api/cart/add/`,
        {
          user_id: user.id,
          variant_id: variantId,
          size_id: sizeId,
          quantity: quantity,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      //const cartData = res.data as Array<{ id: number; variant: number; size: number | null; quantity: number }>;
      // refetch cart after adding
      fetchCart();
      Swal.fire({
        icon: 'success',
        title: 'Item added to cart',
        showConfirmButton: false,
        timer: 1500
      });
      setChooseSizeMsg(null);
    } catch (err: any) {
      setError(err?.message || "Failed to add to cart");
      console.error("useCart.addToCart error:", err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, apiBaseUrl, dispatch]);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`${apiBaseUrl}api/cart/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const cartData = res.data as Array<{ id: number; variant: number; size: number | null; quantity: number }>;

      const itemsDetailed = await Promise.all(
        cartData.map(async (it) => {
          const [variantRes, sizeRes] = await Promise.all([
            axios.get(`${apiBaseUrl}api/products/variant/${it.variant}/`),
            it.size ? axios.get(`${apiBaseUrl}api/products/size/${it.size}/`) : Promise.resolve({ data: null }),
          ]);
          return {
            id: it.id,
            variant: variantRes.data,
            size: sizeRes.data,
            quantity: it.quantity,
            
          } as CartItem;
        })
      );

      dispatch({ type: "cart/updateCart", payload: itemsDetailed });
      setLocalItems(itemsDetailed);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch cart");
      console.error("useCart.fetchCart error:", err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, apiBaseUrl, dispatch]);

  const clearCart = useCallback(async () => {
    // snapshot current items
    prevItemsRef.current = localItems.map((i) => ({ ...i }));
    // optimistic
    setLocalItems([]);
    try {
      await axiosInstance.get(`${apiBaseUrl}api/cart/empty/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      dispatch({ type: "cart/clearCart" });
    } catch (err) {
      // revert on error
      setLocalItems(prevItemsRef.current);
      console.error("useCart.clearCart error:", err);
    }
  }, [accessToken, apiBaseUrl, dispatch, localItems]);

  const removeItem = useCallback(
    async (variantId: number, sizeId?: number) => {
      // snapshot using functional read to avoid stale closure
      setLocalItems((cur) => {
        prevItemsRef.current = cur.map((i) => ({ ...i }));
        return cur.filter((it) => {
          const vid = it.variant?.id ?? it.id;
          const sid = it.size?.id;
          if (vid !== variantId) return true;
          if (sizeId == null) return false;
          return sid !== sizeId;
        });
      });

      try {
        await axiosInstance.post(
          `${apiBaseUrl}api/cart/remove/`,
          { variant_id: variantId, size_id: sizeId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        dispatch({ type: "cart/removeItem", payload: { variantId, sizeId } });
      } catch (err) {
        // revert on error
        setLocalItems(prevItemsRef.current);
        console.error("useCart.removeItem error:", err);
      }
    },
    [accessToken, apiBaseUrl, dispatch]
  );

  const updateQuantity = useCallback(
    async (variantId: number, sizeId: number | undefined, quantity: number) => {
      // optimistic update using functional setter
      setLocalItems((cur) => {
        const snapshot = cur.map((it) => ({ ...it }));
        prevItemsRef.current = snapshot;
        return cur.map((it) => {
          const vid = it.variant?.id ?? it.id;
          const sid = it.size?.id;
          if (vid === variantId && (sizeId == null || sid === sizeId)) {
            return { ...it, quantity };
          }
          return it;
        });
      });

      try {
        await axiosInstance.post(
          `${apiBaseUrl}api/cart/update/`,
          { variant_id: variantId, size_id: sizeId, quantity },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        dispatch({ type: "cart/updateCartItem", payload: { id: variantId, quantity } });
      } catch (err) {
        // revert on error
        setLocalItems(prevItemsRef.current);
        console.error("useCart.updateQuantity error:", err);
      }
    },
    [accessToken, apiBaseUrl, dispatch]
  );

  useEffect(() => {
    if (accessToken) fetchCart();
  }, [accessToken, fetchCart]);

  return {
    items: localItems,
    totalPrice: localTotal,
    loading,
    error,
    imageUrl,
    addToCart,
    fetchCart,
    clearCart,
    removeItem,
    updateQuantity,
    setMessageSize,
    chooseSizeMsg,
  };
}