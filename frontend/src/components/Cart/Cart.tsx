import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";
import axios from "axios";
import { RootState } from "../../redux/store";
import axiosInstance from "../../api/axiosInstance";
import { login } from "../../redux/userSlice";
import { VariantImage, CartItem } from "../../types/Product";
import useCart from "../../hooks/useCart";
import CartList from "./CartList";

interface CartProps {
  orderPopup: boolean;
  setOrderPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const Cart: React.FC<CartProps> = ({ orderPopup, setOrderPopup }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.user
  );
  const { items, totalPrice, loading, imageUrl, fetchCart, clearCart, removeItem, updateQuantity, updateChecked } = useCart();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // refresh cart when popup opens
  useEffect(() => {
    if (orderPopup && user) {
      fetchCart();
    }
  }, [orderPopup, user, fetchCart]);

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post<{
        access: string;
        refresh: string;
      }>(`api/token/`, {
        username: username,
        password: password,
      });
      const { access, refresh } = response.data;
      const userDetailsResponse = await axiosInstance.get(`api/user/me/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
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

  const handleClearCart = async () => {
    const res = await Swal.fire({
      title: "Clear the cart",
      text: "Are you sure ? You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fea928",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear it!",
    });
    if (res.isConfirmed) {
      await clearCart();
      fetchCart()
      Swal.fire({ title: "Cleared!", text: "Your cart has been emptied.", icon: "success", timer: 1500, showConfirmButton: false });
    }
  };

  const handleRemoveFromCart = async (item: CartItem) => {
    const res = await Swal.fire({
      title: "Remove from cart",
      text: "Are you sure ? You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fea928",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    });
    if (res.isConfirmed && user) {
      await removeItem(item.variant?.id ?? item.id, item.size?.id);
      fetchCart()
      Swal.fire("Removed!", "Your item has been removed from the cart.", "success");
    }
  };

  const handleUpdateQuantity = async (item: CartItem, qty: number, checked: boolean) => {
    const variantId = item.variant?.id ?? item.id;
    const sizeId = item.size?.id;
    await updateQuantity(variantId, sizeId, qty, checked);
    // ne pas forcer fetchCart(), hook fait l'optimistic update
  };

    const handleUpdateChecked = (item: CartItem, checked: boolean) => {
      const variantId = item.variant?.id ?? item.id;
      const sizeId = item.size?.id;
      updateChecked(variantId, sizeId, checked);
    };
  

  const handleNavigate = (productId?: number, variantId?: number) => {
    if (!productId) return;
    window.location.href = `/product/${productId}/${variantId ?? ""}`;
    setOrderPopup(false);
  };

  return (
    <>
      {orderPopup && (
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
                  <h1 className="text-xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100">Your Cart</h1>
                </div>
                <div>
                  <button
                    onClick={() => setOrderPopup(false)}
                    className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300
                               hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center"
                    aria-label="Close cart popup"
                  >
                    <IoCloseOutline className="text-2xl" />
                  </button>
                </div>
              </div>

              {user ? (
                <div>
                  <div className="overflow-auto max-h-[52vh] mt-4 pr-1">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-10 gap-3">
                        <div className="animate-spin rounded-full h-9 w-9 border-2 border-primary/30 border-t-primary"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Loading your cart...</p>
                      </div>
                    ) : (
                      <CartList
                        items={items}
                        onRemove={(item) => handleRemoveFromCart(item)}
                        onUpdateQuantity={(item, qty, checked) => handleUpdateQuantity(item, qty, checked)}
                        imageUrl={imageUrl}
                        onNavigate={(productId, variantId) => handleNavigate(productId, variantId)}
                        onUpdateChecked={handleUpdateChecked}
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h1 className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Price</h1>
                    <h1 className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                      {(totalPrice ?? 0).toFixed(2)} $
                    </h1>
                  </div>

                  {items.length > 0 && (
                    <button
                      className="text-xs font-semibold mt-2 text-red-500 cursor-pointer hover:text-red-600 transition-colors duration-200"
                      onClick={handleClearCart}
                    >
                      Clear the cart
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">Login to proceed</div>
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
                    <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-primary transition-colors duration-200">
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
                      window.location.href = "/cart";
                      setOrderPopup(false);
                    }
                  }}
                  className="w-full md:w-auto min-w-[200px] text-white px-5 py-3 rounded-xl
                             bg-gradient-to-r from-primary to-secondary font-semibold
                             hover:scale-[1.01] active:scale-[0.99] transition-all duration-200
                             shadow-lg shadow-primary/25"
                >
                  {user ? "Purchase now" : "Register"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;