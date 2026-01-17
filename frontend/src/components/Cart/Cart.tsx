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
          <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 backdrop-blur-sm z-50">
            <div
              className="fixed top-1/2 left-1/3 -translate-y-1/2 p-4 shadow-md bg-white
                         dark:bg-gray-900 rounded-md duration-200 min-w-[500px]"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-xl text-gray-800 dark:text-gray-300">Cart</h1>
                <div>
                  <IoCloseOutline className="text-2xl cursor-pointer" onClick={() => setOrderPopup(false)} />
                </div>
              </div>

              {user ? (
                <div>
                  <div className="overflow-auto max-h-[500px] mt-4">
                    {loading ? (
                      <div className="text-center py-8">Loading...</div>
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

                  <div className="flex items-center justify-between mt-4">
                    <h1 className="text-sm text-gray-800 dark:text-gray-300">Total Price</h1>
                    <h1 className="text-sm text-gray-800 dark:text-gray-300">{(totalPrice ?? 0).toFixed(2)} $</h1>
                  </div>

                  {items.length > 0 && (
                    <div className="text-xs flex items-center justify-between mt-2 text-red-600 cursor-pointer underline hover:text-red-700 w-32" onClick={handleClearCart}>
                      <span>Clear the cart</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Login to proceed</div>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full  border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-3 py-2 focus:outline-primary/20 focus:outline-1 mb-4"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full  border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-3 py-2 focus:outline-primary/20 focus:outline-1 "
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700">
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center group mt-4">
                <button
                  onClick={() => {
                    if (!user) {
                      handleLogin();
                    } else {
                      window.location.href = "/cart";
                      setOrderPopup(false);
                    }
                  }}
                  className="text-white px-3 py-2 bg-primary hover:bg-secondary"
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