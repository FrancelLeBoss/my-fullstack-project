import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";
import { RootState } from "../redux/store";
import Swal from "sweetalert2";
import { se } from "date-fns/locale";
import { addToWishlist as addToWishlistAction, removeFromWishlist as removeFromWishlistAction } from "../redux/WishlistSlice";


export default function useWishlist() {

    const dispatch = useDispatch();
    const user = useSelector((s: RootState) => s.user.user);
    const [productWished, setProductWished] = useState(false);

    const addToWishlist = useCallback(
    async (variantId?: number) => {
      if (!user?.id || !variantId) return null;
      try {
        const res = await axiosInstance.post<{ wishlist_item: { id: number } }>(`api/wishlist/add/`, { variant_id: variantId });
        // optionnel : récupérer variant details et dispatcher vers store
        const variantResp = await axiosInstance.get(`api/products/variant/${variantId}/`);
        dispatch(addToWishlistAction({ id: res.data.wishlist_item.id, variant: variantResp.data }));
        setProductWished(true);
        Swal.fire({
          icon: 'success',
          title: 'Product added to wishlist',
          showConfirmButton: false,
          timer: 1500
        });
        return res.data;
      } catch (err) {
        console.error("addToWishlist error:", err);
        return null;
      }
    },
    [user, dispatch]
  );

  const setProductWishedState = useCallback((wished: boolean) => {
    setProductWished(wished);
  }, []);
  const checkWishlist = useCallback(
      async (variantId?: number) => {
        if (!user?.id || !variantId) {
          setProductWished(false);
          return false;
        }
        try {
          const res = await axiosInstance.post<{ exists: boolean }>(`api/wishlist/already_exists/`, {
            variant_id: variantId,
          });
          setProductWished(res.data.exists);
          return res.data.exists;
        } catch (err) {
          console.error("checkWishlist error:", err);
          return false;
        }
      },
      [user]
    );
  const removeFromWishlist = useCallback(
    async (variantId?: number) => {
      if (!user?.id || !variantId) return null;
      try {
        const res = await axiosInstance.post<{ wishlist_item: { id: number } }>(`api/wishlist/remove/`, { variant_id: variantId });
        dispatch(removeFromWishlistAction({ itemDeleted: res.data.wishlist_item.id }));
        setProductWished(false);
        Swal.fire({
                  icon: 'success',
                  title: 'Product removed from wishlist',
                  showConfirmButton: false,
                  timer: 1500
                });
        return res.data;
      } catch (err) {
        console.error("removeFromWishlist error:", err);
        return null;
      }
    },
    [user, dispatch]
  );
  
    return {productWished, addToWishlist, checkWishlist ,setProductWishedState, removeFromWishlist};
}