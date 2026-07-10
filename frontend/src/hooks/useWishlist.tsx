import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { RootState } from "../redux/store";
import { addToWishlist as addToWishlistAction, removeFromWishlist as removeFromWishlistAction } from "../redux/WishlistSlice";
import { fireThemedToast } from "../utils/sweetAlert";

export default function useWishlist() {
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.user.user);
  const [productWished, setProductWished] = useState(false);

  const addToWishlist = useCallback(
    async (variantId?: number) => {
      if (!user?.id || !variantId) return null;

      try {
        const res = await axiosInstance.post<{ wishlist_item: { id: number } }>(`api/wishlist/add/`, {
          variant_id: variantId,
        });
        const variantResp = await axiosInstance.get(`api/products/variant/${variantId}/`);

        dispatch(addToWishlistAction({ id: res.data.wishlist_item.id, variant: variantResp.data }));
        setProductWished(true);
        fireThemedToast({
          icon: "success",
          title: "Produit ajouté",
          text: "L’article a bien été ajouté à ta wishlist.",
        });

        return res.data;
      } catch (err) {
        console.error("addToWishlist error:", err);
        return null;
      }
    },
    [user, dispatch]
  );

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

  const setProductWishedState = useCallback((wished: boolean) => {
    setProductWished(wished);
  }, []);

  const removeFromWishlist = useCallback(
    async (variantId?: number) => {
      if (!user?.id || !variantId) return null;

      try {
        const res = await axiosInstance.post<{ wishlist_item: { id: number } }>(`api/wishlist/remove/`, {
          variant_id: variantId,
        });

        dispatch(removeFromWishlistAction({ itemDeleted: res.data.wishlist_item.id }));
        setProductWished(false);
        fireThemedToast({
          icon: "success",
          title: "Produit retiré",
          text: "L’article a été retiré de ta wishlist.",
        });

        return res.data;
      } catch (err) {
        console.error("removeFromWishlist error:", err);
        return null;
      }
    },
    [user, dispatch]
  );

  return { productWished, addToWishlist, checkWishlist, setProductWishedState, removeFromWishlist };
}
