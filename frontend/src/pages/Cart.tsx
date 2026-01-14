import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import useCart from "../hooks/useCart";
import CartList from "../components/Cart/CartList";
import { CartItem } from "../types/Product";
import axiosInstance from "../api/axiosInstance";
import { FaStripe } from "react-icons/fa";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const { user, isAuthenticated } = useSelector((s: RootState) => s.user);
  const {accessToken} = useSelector((s: RootState) => s.user);
  const { items, totalPrice, loading, imageUrl, fetchCart, clearCart, removeItem, updateQuantity, updateChecked } = useCart();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  const handleClear = async () => {
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
      Swal.fire({ title: "Cleared!", text: "Your cart has been emptied.", icon: "success", timer: 1500, showConfirmButton: false });
    }
  };

  const handleRemove = async (item: CartItem) => {
    const res = await Swal.fire({
      title: "Remove from cart",
      text: "Are you sure ? You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fea928",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    });
    if (res.isConfirmed) {
      await removeItem(item.variant?.id ?? item.id, item.size?.id);
      Swal.fire("Removed!", "Your item has been removed from the cart.", "success");
    }
  };

  const handleCheckout = async (items: CartItem[]) => {
      const res = await Swal.fire({
      title: "Checkout",
      text: "Are you sure ? You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fea928",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Proceed!",
    });
    if (res.isConfirmed) {
      try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    // On utilise le token 'access' récupéré de Redux
                    Authorization: `Bearer ${accessToken}`, 
                },
            };
            const data = {
                cartItems: items.map(item => ({
                    variant_id: item.variant?.id, 
                    size_id: item.size?.id,       
                    qty: item.quantity             
                }))
            };

            const response = await axiosInstance.post<any>(
                `${apiBaseUrl}api/create-checkout-session/`, 
                data, 
                config
            );
            if (response.data.url) {
                window.location.href = response.data.url;
            }

        } catch (error : any) {
            console.error("Erreur:", error.response?.data?.error || error.message);
        }
    }
  };

  const handleUpdateQty = (item: CartItem, qty: number, checked: boolean) => {
    const variantId = item.variant?.id ?? item.id;
    const sizeId = item.size?.id;
    updateQuantity(variantId, sizeId, qty, checked);
  };

  const handleUpdateChecked = (item: CartItem, checked: boolean) => {
    const variantId = item.variant?.id ?? item.id;
    const sizeId = item.size?.id;
    updateChecked(variantId, sizeId, checked);
  };

  const handleNavigate = (productId?: number, variantId?: number) => {
    if (!productId) return;
    navigate(`/product/${productId}/${variantId ?? ""}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <main className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-primary">Your Cart</h1>
            <div className="flex items-center gap-3">
              <button onClick={handleClear} className="text-sm text-red-500 hover:underline">
                Clear
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <CartList
              items={items}
              onRemove={handleRemove}
              onUpdateQuantity={handleUpdateQty}
              onUpdateChecked={handleUpdateChecked}
              imageUrl={imageUrl}
              onNavigate={handleNavigate}
            />
          )}
        </main>

        <aside className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{(totalPrice ?? 0).toFixed(2)} $</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>—</span>
            </div>

            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Total</span>
              <span>{(totalPrice ?? 0).toFixed(2)} $</span>
            </div>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  Swal.fire({ title: "Please login", icon: "info", timer: 1500, showConfirmButton: false });
                  return;
                }
                handleCheckout(items);
              }}
              className="w-full mt-4 bg-primary text-white py-1 rounded-lg flex items-center justify-center hover:scale-105 transition-colors"
            >
              <span>Checkout with</span>
              <FaStripe className="ml-2 w-8 h-8 text-gray-800"/>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;