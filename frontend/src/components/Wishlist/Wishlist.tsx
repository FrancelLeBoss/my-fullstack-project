import { IoCloseOutline } from "react-icons/io5";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import { login } from "../../redux/userSlice";
import {
  ProductVariant,
  VariantImage,
  WishlistItem,
} from "../../types/Product";
import { RootState } from "../../redux/store";
import { fireThemedAlert, fireThemedToast } from "../../utils/sweetAlert";

interface WishlistProps {
  wishlistPopup: boolean;
  setWishlistPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const Wishlist = ({ wishlistPopup, setWishlistPopup }: WishlistProps) => {
  const { user, isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.user
  );
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const dispatch = useDispatch();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post<{
        access: string;
        refresh: string;
      }>(`${apiBaseUrl}api/token/`, {
        // simplejwt's TokenObtainPairView expects 'username' by default.
        username: username,
        password: password,
      });
      const { access, refresh } = response.data;
      const userDetailsResponse = await axiosInstance.get(
        `${apiBaseUrl}api/user/me/`,
        {
          headers: {
            Authorization: `Bearer ${access}`, // <-- Ajout manuel de l'en-tête ici
          },
        }
      );
      const userData = userDetailsResponse.data;
      dispatch(
        login({
          user: userData,
          access: access,
          refresh: refresh,
          rememberMe: false,
        })
      );
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await axios
        .get(
          `${apiBaseUrl}api/wishlist/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Assurez-vous que l'utilisateur a un accessToken valide
            },
          }
        )
        .then(async (response) => {
          const data = response.data as Array<{ id: number; variant: number }>;
          const items: WishlistItem[] = await Promise.all(
            data.map(async (item: { id: number; variant: number }) => {
              const variantResponse = await axios.get<ProductVariant>(
                `${apiBaseUrl}api/products/variant/${item.variant}/`
              );
              return {
                id: item.id,
                //user: item.user,
                variant: variantResponse.data, // Stocker la variante entière
              };
            })
          );
          // Dispatch pour mettre à jour la wishlist dans Redux
          dispatch({ type: "wishlist/updateWishlist", payload: items });
        });
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    }
  };

  // Fonction pour supprimer un élément de la wishlist
  interface RemoveWishlistResponse {
    wishlist_item: WishlistItem;
  }

  const handleRemoveFromWishlist = async (
    item: WishlistItem
  ): Promise<void> => {
    try {
      let itemDeleted: number | undefined;
      await axiosInstance
        .post<RemoveWishlistResponse>(`${apiBaseUrl}api/wishlist/remove/`, {
          variant_id: item.variant?.id,
        })
        .then((response) => {
          console.log("Item removed from wishlist:", response.data);
          itemDeleted = response.data.wishlist_item.id;
        });
      // Met à jour le state Redux après suppression
      dispatch({
        type: "wishlist/removeFromWishlist",
        payload: { itemDeleted },
      });
      fireThemedToast({
        icon: "success",
        title: "Supprimé",
        text: "Produit retiré de la liste de souhaits.",
      });
    } catch (error) {
      fireThemedAlert({
        icon: "error",
        title: "Erreur",
        text: "Impossible de retirer l'article.",
      });
    }
  };

  // Fonction pour vider la wishlist
  const handleClearWishlist = async () => {
    try {
      await axiosInstance.post(`${apiBaseUrl}api/wishlist/empty/`);
      dispatch({ type: "wishlist/clearWishlist" });
      fireThemedToast({
        icon: "success",
        title: "Liste vidée",
        text: "Votre liste de souhaits est maintenant vide.",
      });
    } catch (error) {
      fireThemedAlert({
        icon: "error",
        title: "Erreur",
        text: "Impossible de vider la liste.",
      });
      console.error("Error clearing wishlist:", error);
    }
  };

  const imageUrl = (images: VariantImage[] | undefined): string => {
    if (!images || images.length === 0) return "";
    for (let i = 0; i < images.length; i++) {
      if (images[i].mainImage) {
        return resolveMediaUrl(images[i].image, apiBaseUrl);
      }
      return resolveMediaUrl(images[0].image, apiBaseUrl);
    }
    return "";
  };

  return (
    <>
      {wishlistPopup && (
        <div className="popup">
          <div className="h-screen w-screen fixed top-0 left-0 bg-black/60 backdrop-blur-md z-50">
            <div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         w-[94vw] max-w-2xl max-h-[88vh] overflow-hidden
                         p-5 md:p-6 bg-white dark:bg-gray-900 rounded-2xl duration-200
                         border border-gray-100 dark:border-gray-800
                         shadow-[0_20px_55px_-30px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500 font-semibold">
                    Quick View
                  </p>
                  <h1 className="text-xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100">
                    Liste des souhaits
                  </h1>
                </div>
                <div>
                  <button
                    onClick={() => setWishlistPopup(false)}
                    className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300
                               hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center"
                    aria-label="Close wishlist popup"
                  >
                    <IoCloseOutline className="text-2xl" />
                  </button>
                </div>
              </div>
              {user && (
                <div>
                  <div className="overflow-auto max-h-[52vh] mt-4 pr-1 space-y-3">
                    {wishlist?.length > 0 ? (
                      wishlist?.map((item, index) => (
                        <div
                          key={index}
                          className="group flex items-center gap-4 rounded-2xl p-3 md:p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                                     shadow-[0_14px_35px_-28px_rgba(0,0,0,0.45)] hover:shadow-[0_18px_40px_-30px_rgba(0,0,0,0.55)]
                                     hover:border-primary/30 transition-all duration-300"
                        >
                          <img
                            src={imageUrl(item?.variant?.images)}
                            alt={item?.variant?.product?.title}
                            className="w-16 h-16 md:w-20 md:h-20 object-cover cursor-pointer rounded-2xl ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-[1.02] transition-transform duration-300"
                            title="See details"
                            onClick={() => {
                              window.location.href = `/product/${item?.variant?.product?.id}/${item?.variant?.id}`;
                            }}
                          />
                          <div className="flex flex-col gap-1 w-full">
                            <div
                              className="text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-primary transition-colors duration-200 truncate"
                              title="See details"
                              onClick={() => {
                                window.location.href = `/product/${item?.variant?.product?.id}/${item?.variant?.id}`;
                              }}
                            >
                              {item.variant?.product?.title} ({item.variant?.color})
                            </div>
                            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 flex gap-4 items-center font-semibold justify-between mt-2">
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-1 font-bold">
                                  {item.variant?.price} $
                                </span>
                              </div>
                              <div className="flex items-center gap-2 justify-end w-full cursor-pointer">
                                <button
                                  className="text-red-500 hover:text-red-600 font-semibold transition-colors duration-200"
                                  onClick={() => {
                                    handleRemoveFromWishlist(item);
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-950/30 py-10 text-center text-gray-500 dark:text-gray-400">
                        Votre liste de souhaits est vide
                      </div>
                    )}
                    {wishlist?.length > 0 && (
                      <button
                        className="text-xs font-semibold flex items-center gap-2 text-red-500 cursor-pointer hover:text-red-600 transition-colors duration-200 mt-3"
                        onClick={handleClearWishlist}
                      >
                        <span>clear the list</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
              {!user && (
                <div className="mt-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Login to proceed
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3 py-2.5 rounded-xl
                               focus:outline-primary/20 focus:outline-2 mb-3"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3 py-2.5 rounded-xl
                                 focus:outline-primary/20 focus:outline-2"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-primary transition-colors duration-200"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center group mt-5">
                <button
                  onClick={() => {
                    if (!user) {
                      handleLogin();
                    } else {
                      setWishlistPopup(false);
                    }
                  }}
                  className="w-full md:w-auto min-w-[200px] text-white px-5 py-3 rounded-xl
                             bg-gradient-to-r from-primary to-secondary font-semibold
                             hover:scale-[1.01] active:scale-[0.99] transition-all duration-200
                             shadow-lg shadow-primary/25"
                >
                  {user ? "got it!" : "Register"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Wishlist;
