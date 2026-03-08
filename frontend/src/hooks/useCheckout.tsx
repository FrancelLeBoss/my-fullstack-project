import Swal from "sweetalert2";
import axiosInstance from "../api/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import useCart from "./useCart";

export default function useCheckout() {
  const { accessToken, isAuthenticated } = useSelector((s: RootState) => s.user);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  const { items, totalPrice, calculateShipping, calculateTaxes } = useCart();

  const handleCheckout = async () => {
    // 1. Vérification de sécurité
    if (!isAuthenticated) {
      return Swal.fire({ title: "Please login", icon: "info", timer: 1500, showConfirmButton: false });
    }
    const selectedItems = items.filter((item) => item.checked);

    if (selectedItems.length === 0) {
      return Swal.fire("Empty selection", "Please select at least one item.", "warning");
    }

    // 2. Calcul du total pour l'affichage dans l'alerte
    const shipping = calculateShipping(totalPrice);
    const taxes = calculateTaxes(totalPrice);
    const finalAmount = (totalPrice + shipping + taxes).toFixed(2);

    // 3. Confirmation
    const res = await Swal.fire({
      title: "Confirm Order",
      html: `Total to pay: <b>${finalAmount} $</b><br/><small>(including shipping and taxes)</small>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#fea928",
      confirmButtonText: "Proceed to Payment",
    });

    if (!res.isConfirmed) return;

    // 4. Appel API
    try {
      const data = {
        cartItems: selectedItems.map((item) => ({
          variant_id: item.variant?.id ?? item.id,
          size_id: item.size?.id,
          qty: item.quantity,
        })),
      };

      const response = await axiosInstance.post<{ url: string }>(
        `${apiBaseUrl}api/create-checkout-session/`,
        data,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      Swal.fire("Error", "Could not initiate payment session.", "error");
    }
  };

  return { handleCheckout };
}