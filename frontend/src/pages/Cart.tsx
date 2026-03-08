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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* SECTION GAUCHE : LISTE DES PRODUITS */}
        <main className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-primary">Your Cart</h1>
            <button onClick={handleClear} className="text-sm text-red-500 hover:underline">
              Clear Cart
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
        <aside className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm h-fit sticky top-8">
          <h2 className="text-lg font-medium mb-4">Summary</h2>

          <div className="space-y-3 text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{totalPrice.toFixed(2)} $</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className={calculateShipping(totalPrice) === 0 ? "text-green-500 font-medium" : ""}>
                {calculateShipping(totalPrice) === 0 ? "Free" : `${calculateShipping(totalPrice)} $`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Taxes (provincial and federal)</span>
              <span>{calculateTaxes(totalPrice)} $</span>
            </div>

            <div className="flex justify-between text-xl font-bold border-t pt-4 text-gray-900 dark:text-white">
              <span>Total</span>
              <span>{grandTotal.toFixed(2)} $</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || !items.some(item => item.checked)}
              className="w-full mt-6 bg-primary text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              <span>Pay with</span>
              <FaStripe className="text-3xl" />
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default CartPage;