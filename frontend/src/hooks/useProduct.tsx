import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import type {
  Product as ProductType,
  ProductVariant,
  ProductSize,
  ProductVariantImage,
  CommentType,
} from "../types/Product";
import type { RootState } from "../redux/store";
import { se } from "date-fns/locale";
import useComment from "./useComment";

/**
 * useProduct
 * - centralise la logique de la page Product.tsx : fetch product, related products,
 *   category, comments + user infos, wishlist checks et actions.
 *
 * Utilisation:
 * const {
 *   product, loading, error, category,
 *   relatedByCat, relatedBySubCat, comments, userInfos,
 *   productWished,
 *   refetch, fetchRelated, addComment, addToWishlist, removeFromWishlist, checkWishlist
 * } = useProduct(productId);
 */

export default function useProduct(productId?: string | number | null) {
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.user.user);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [product, setProduct] = useState<ProductType | null>(null);
  const [category, setCategory] = useState<{ title: string; id: number; slug: string } | null>(null);
  const [relatedBySubCat, setRelatedBySubCat] = useState<ProductType[]>([]);
  const [relatedByCat, setRelatedByCat] = useState<ProductType[]>([]);
  const [userInfos, setUserInfos] = useState<Record<number, { username: string }>>({});
  const [productWished, setProductWished] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setCommentsState } = useComment(productId);

  const getUserInfo = useCallback(
    async (userId: number) => {
      if (userInfos[userId]) return userInfos[userId];
      try {
        const res = await axiosInstance.get<{ username: string }>(`api/user/${userId}/`);
        setUserInfos((prev) => ({ ...prev, [userId]: res.data }));
        return res.data;
      } catch (err) {
        console.error("getUserInfo error:", err);
        return null;
      }
    },
    [userInfos]
  );

  const fetchProduct = useCallback(
    async (id?: string | number | null) => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get<ProductType>(`api/products/${id}/`);
        setProduct(res.data);

        // fetch category
        if (res.data.category) {
          try {
            const cat = await axiosInstance.get<{ title: string; id: number; slug: string }>(
              `api/categories/${res.data.category}/`
            );
            setCategory(cat.data);
          } catch (err) {
            console.error("fetchCategory error:", err);
          }
        }

        // fetch comments and users
        try {
          const comRes = await axiosInstance.get<CommentType[]>(`api/comments/${id}/`);
          setCommentsState(comRes.data);
          // prefetch unique users
          const uniqueUserIds = Array.from(new Set(comRes.data.map((c) => c.user)));
          await Promise.all(uniqueUserIds.map((uid) => getUserInfo(uid)));
        } catch (err) {
          console.error("fetchComments error:", err);
        }
      } catch (err: any) {
        setError(err?.message || "Failed to fetch product");
        console.error("fetchProduct error:", err);
      } finally {
        setLoading(false);
      }
    },
    [getUserInfo]
  );

  const fetchRelated = useCallback(
    async (prod?: ProductType | null) => {
      if (!prod) return;
      try {
        if (prod.category) {
          const res = await axiosInstance.get<ProductType[]>(`api/products/category/${prod.category}/`);
          setRelatedByCat(res.data || []);
        }
        if (prod.subCategory) {
          const res2 = await axiosInstance.get<ProductType[]>(`api/products/subcategory/${prod.subCategory}/`);
          setRelatedBySubCat(res2.data || []);
        }
      } catch (err) {
        console.error("fetchRelated error:", err);
      }
    },
    []
  );

  const checkWishlist = useCallback(
    async (variantId?: number) => {
      if (!user?.id || !variantId) {
        setProductWished(false);
        return false;
      }
      try {
        const res = await axiosInstance.post<{ exists: boolean }>(`api/wishlist/already_exists/`, {
          user_id: user.id,
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

  const addToWishlist = useCallback(
    async (variantId?: number) => {
      if (!user?.id || !variantId) return null;
      try {
        const res = await axiosInstance.post<{ wishlist_item: { id: number } }>(`api/wishlist/add/`, { user_id: user.id, variant_id: variantId });
        // optionnel : récupérer variant details et dispatcher vers store
        const variantResp = await axiosInstance.get(`api/products/variant/${variantId}/`);
        dispatch({ type: "wishlist/addToWishlist", payload: { id: res.data.wishlist_item.id, variant: variantResp.data } });
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

  const removeFromWishlist = useCallback(
    async (variantId?: number) => {
      if (!user?.id || !variantId) return null;
      try {
        const res = await axiosInstance.post<{ wishlist_item: { id: number } }>(`api/wishlist/remove/`, { user_id: user.id, variant_id: variantId });
        dispatch({ type: "wishlist/removeFromWishlist", payload: { itemDeleted: res.data.wishlist_item.id } });
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

  // small helpers
  const mainVariant = useCallback((p: ProductType | null): ProductVariant | undefined => p?.variants?.[0], []);
  const indexOfMainImageOfVariant = useCallback((variant: ProductVariant): number => {
    const idx = variant.images.findIndex((img: ProductVariantImage) => img.mainImage === true);
    return idx !== -1 ? idx : 0;
  }, []);

  // Effects
  useEffect(() => {
    fetchProduct(productId);
  }, [productId, fetchProduct]);

  useEffect(() => {
    if (product) fetchRelated(product);
  }, [product, fetchRelated]);

  useEffect(() => {
    // check wishlist for the visible variant
    const vId = product?.variants?.find((v) => v.id)?.id;
    if (vId) checkWishlist(vId);
  }, [product, checkWishlist]);

  return {
    product,
    loading,
    error,
    category,
    relatedByCat,
    relatedBySubCat,
    userInfos,
    productWished,
    apiBaseUrl,
    refetch: fetchProduct,
    fetchRelated,
    checkWishlist,
    addToWishlist,
    removeFromWishlist,
    mainVariant,
    indexOfMainImageOfVariant,
  };
}