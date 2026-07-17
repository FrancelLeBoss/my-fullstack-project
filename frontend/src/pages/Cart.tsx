import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import useCart from "../hooks/useCart";
import useCheckout from "../hooks/useCheckout"; 
import CartList from "../components/Cart/CartList";
import { CartItem } from "../types/Product";
import { FaStripe } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s: RootState) => s.user);
  
  // On récupère tout depuis useCart
  const { 
    items, totalPrice, grandTotal, loading, imageUrl, 
    fetchCart, clearCart, removeItem, updateQuantity, 
    updateChecked, calculateShipping, calculateTaxes 
  } = useCart();

  // On récupère la logique de paiement
  const { handleCheckout } = useCheckout();

  // Chargement initial
  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);


  const handleClear = async () => {
    const res = await Swal.fire({
      title: "Clear the cart",
      text: "Are you sure? You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fea928",
      confirmButtonText: "Yes, clear it!",
    });
    if (res.isConfirmed) {
      await clearCart();
      Swal.fire({ title: "Cleared!", icon: "success", timer: 1500, showConfirmButton: false });
    }
  };

  const handleRemove = async (item: CartItem) => {
    const res = await Swal.fire({
      title: "Remove item",
      text: "Remove this item from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fea928",
      confirmButtonText: "Yes, remove it!",
    });
    if (res.isConfirmed) {
      await removeItem(item.variant?.id ?? item.id, item.size?.id);
    }
  };

  const handleUpdateQty = (item: CartItem, qty: number, checked: boolean) => {
    updateQuantity(item.variant?.id ?? item.id, item.size?.id, qty, checked);
  };

  const handleUpdateChecked = (item: CartItem, checked: boolean) => {
    updateChecked(item.variant?.id ?? item.id, item.size?.id, checked);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <section className="bg-gradient-to-r from-primary to-secondary py-10">
        <div className="container mx-auto px-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/70 font-semibold">Checkout</p>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-1">Your Cart</h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            Review your selected items, adjust quantities, and complete your order securely.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SECTION GAUCHE : LISTE DES PRODUITS */}
        <main
          className="md:col-span-2 rounded-2xl p-5 md:p-6
          bg-white/95 dark:bg-gray-900
          border border-gray-100 dark:border-gray-800
          shadow-[0_16px_45px_-28px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Shopping Bag
              </h2>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                {items.length} item{items.length > 1 ? "s" : ""} in your cart
              </p>
            </div>

            <button
              onClick={handleClear}
              className="text-sm font-semibold text-red-500 hover:text-red-600
              transition-colors duration-200"
            >
              Clear Cart
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary/30 border-t-primary"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading your cart...</p>
            </div>
          ) : (
            <CartList
              items={items}
              onRemove={handleRemove}
              onUpdateQuantity={handleUpdateQty}
              onUpdateChecked={handleUpdateChecked}
              imageUrl={imageUrl}
              onNavigate={(p, v) => navigate(`/product/${p}/${v ?? ""}`)}
            />
          )}
        </main>

        {/* SECTION DROITE : RÉSUMÉ DES COÛTS */}
        <aside
          className="md:col-span-1 h-fit sticky top-6 rounded-2xl p-5 md:p-6
          bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800
          shadow-[0_16px_45px_-28px_rgba(0,0,0,0.45)]"
        >
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 font-semibold">
              Payment
            </p>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">Order Summary</h3>
          </div>

          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">{totalPrice.toFixed(2)} $</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Shipping</span>
              <span className={calculateShipping(totalPrice) === 0 ? "text-green-500 font-semibold" : "font-semibold text-gray-800 dark:text-gray-100"}>
                {calculateShipping(totalPrice) === 0 ? "Free" : `${calculateShipping(totalPrice)} $`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Taxes (provincial and federal)</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">{calculateTaxes(totalPrice)} $</span>
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-800" />

            <div className="flex justify-between items-end text-gray-900 dark:text-white">
              <span className="text-base font-semibold">Total</span>
              <span className="text-2xl font-black tracking-tight">{grandTotal.toFixed(2)} $</span>
            </div>

            <button
              onClick={() => {
                window.location.href = "/checkout";
              }}
              disabled={loading || !items.some((item) => item.checked)}
              className="w-full mt-5 py-3.5 rounded-xl flex items-center justify-center gap-2
              bg-gradient-to-r from-primary to-secondary text-white font-semibold
              shadow-lg shadow-primary/25 hover:shadow-primary/35
              hover:scale-[1.015] active:scale-[0.985] transition-all duration-200
              disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
            >
              <span>Checkout</span>
            </button>

            <p className="text-[11px] text-center text-gray-400 dark:text-gray-500 leading-relaxed pt-1 flex items-center gap-2">
              Secure checkout powered by
              <FaStripe className="text-3xl" />
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;