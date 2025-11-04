import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import useCart from "../hooks/useCart";
import CartList from "../components/Cart/CartList";
import { CartItem } from "../types/Product";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((s: RootState) => s.user);
  const { items, totalPrice, loading, imageUrl, fetchCart, clearCart, removeItem, updateQuantity } = useCart();

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

  const handleUpdateQty = (item: CartItem, qty: number) => {
    const variantId = item.variant?.id ?? item.id;
    const sizeId = item.size?.id;
    updateQuantity(variantId, sizeId, qty);
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
                navigate("/checkout");
              }}
              className="w-full mt-4 bg-primary text-white py-2 rounded-lg"
            >
              Checkout
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;