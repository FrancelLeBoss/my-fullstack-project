import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import useCheckout from "../hooks/useCheckout";

const Checkout: React.FC = () => {
  const { items, totalPrice, calculateShipping, calculateTaxes, imageUrl, loading } = useCart();
  const { handleCheckout } = useCheckout();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Canada");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [promoCode, setPromoCode] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const selectedItems = useMemo(() => items.filter((item) => item.checked), [items]);

  const shipping = useMemo(() => {
    if (shippingMethod === "express") return 12;
    return calculateShipping(totalPrice);
  }, [calculateShipping, shippingMethod, totalPrice]);

  const taxes = useMemo(() => calculateTaxes(totalPrice), [calculateTaxes, totalPrice]);

  const discount = useMemo(() => {
    if (promoCode.trim().toUpperCase() === "SHOPSY10") {
      return Number((totalPrice * 0.1).toFixed(2));
    }
    return 0;
  }, [promoCode, totalPrice]);

  const total = useMemo(() => Number((totalPrice + shipping + taxes - discount).toFixed(2)), [totalPrice, shipping, taxes, discount]);

  const missingForFreeShipping = Math.max(0, Number((50 - totalPrice).toFixed(2)));

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      setPromoMessage("Entre un code promo.");
      return;
    }
    if (promoCode.trim().toUpperCase() === "SHOPSY10") {
      setPromoMessage("Code applique: -10% sur le sous-total.");
      return;
    }
    setPromoMessage("Code invalide ou expire.");
  };

  const canProceed =
    selectedItems.length > 0 &&
    termsAccepted &&
    email.trim().length > 0 &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    streetAddress.trim().length > 0 &&
    city.trim().length > 0 &&
    stateProvince.trim().length > 0 &&
    postalCode.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-6">
          <h1 className="text-3xl font-black uppercase tracking-tight">Finaliser ma commande</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Plus qu&apos;une etape avant de recevoir vos articles.
          </p>
        </header>

        <div className="mb-8 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm">
          <div className="grid grid-cols-4 gap-2 text-xs md:text-sm font-semibold uppercase">
            <div className="text-gray-500">Panier</div>
            <div className="text-primary">Checkout</div>
            <div className="text-gray-500">Paiement</div>
            <div className="text-gray-500">Confirmation</div>
          </div>
          <div className="mt-3 h-2 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div className="h-full w-1/2 bg-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <main className="lg:col-span-2 space-y-6">
            <section className="rounded-xl bg-white dark:bg-gray-900 p-5 shadow-sm">
              <h2 className="text-lg font-bold mb-4 uppercase">Informations client</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 bg-transparent rounded-lg p-3"
                />
                <input
                  type="tel"
                  placeholder="Telephone (optionnel)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 bg-transparent rounded-lg p-3"
                />
              </div>
              <p className="text-xs text-gray-500 mt-3">Nous vous enverrons la confirmation de commande par e-mail.</p>
            </section>

            <section className="rounded-xl bg-white dark:bg-gray-900 p-5 shadow-sm">
              <h2 className="text-lg font-bold mb-4 uppercase">Livraison</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Prenom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 bg-transparent rounded-lg p-3"
                />
                <input
                  type="text"
                  placeholder="Nom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 bg-transparent rounded-lg p-3"
                />
                <input
                  type="text"
                  placeholder="Adresse"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 bg-transparent rounded-lg p-3 md:col-span-2"
                />
                <input
                  type="text"
                  placeholder="Appartement (optionnel)"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 bg-transparent rounded-lg p-3 md:col-span-2"
                />
                <input
                  type="text"
                  placeholder="Ville"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 bg-transparent rounded-lg p-3"
                />
                <input
                  type="text"
                  placeholder="Province / Etat"
                  value={stateProvince}
                  onChange={(e) => setStateProvince(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 bg-transparent rounded-lg p-3"
                />
                <input
                  type="text"
                  placeholder="Code postal"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 bg-transparent rounded-lg p-3"
                />
                <input
                  type="text"
                  placeholder="Pays"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 bg-transparent rounded-lg p-3"
                />
              </div>
            </section>

            <section className="rounded-xl bg-white dark:bg-gray-900 p-5 shadow-sm">
              <h2 className="text-lg font-bold mb-4 uppercase">Methode de livraison</h2>
              <div className="space-y-3">
                <label className="flex items-start gap-3 border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "standard"}
                    onChange={() => setShippingMethod("standard")}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold">Standard (3 a 5 jours ouvres)</p>
                    <p className="text-sm text-gray-500">Gratuit des 50 CAD, sinon 10 CAD.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "express"}
                    onChange={() => setShippingMethod("express")}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold">Express (1 a 2 jours ouvres)</p>
                    <p className="text-sm text-gray-500">12 CAD.</p>
                  </div>
                </label>
              </div>

              <p className="mt-4 text-sm text-primary font-medium">
                {missingForFreeShipping > 0 && shippingMethod === "standard"
                  ? `Ajoutez ${missingForFreeShipping.toFixed(2)} CAD pour obtenir la livraison gratuite.`
                  : shippingMethod === "standard"
                  ? "Bonne nouvelle: vous beneficiez de la livraison gratuite."
                  : "Livraison express selectionnee."}
              </p>
            </section>

            <section className="rounded-xl bg-white dark:bg-gray-900 p-5 shadow-sm">
              <h2 className="text-lg font-bold mb-4 uppercase">Paiement securise</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Toutes les transactions sont chiffrees et protegees. Le paiement sera effectue via Stripe.
              </p>
            </section>
          </main>

          <aside className="lg:col-span-1">
            <div className="rounded-xl bg-white dark:bg-gray-900 p-5 shadow-sm sticky top-6">
              <h2 className="text-lg font-bold uppercase mb-4">Recapitulatif</h2>

              <div className="space-y-3 max-h-72 overflow-auto pr-1 mb-4">
                {selectedItems.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucun article selectionne.</p>
                ) : (
                  selectedItems.map((item) => (
                    <div key={`${item.id}-${item.size?.id ?? "nosize"}`} className="flex gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
                      <img
                        src={imageUrl(item.variant?.images)}
                        alt={item.variant?.product?.title || "Produit"}
                        className="w-16 h-16 rounded object-cover bg-gray-100 dark:bg-gray-800"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.variant?.product?.title}</p>
                        <p className="text-xs text-gray-500">
                          Taille: {item.size?.size || "-"} | Qt: {item.quantity}
                        </p>
                        <p className="text-sm font-bold">{item.variant?.price} CAD</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mb-4">
                <label className="text-sm font-semibold">Code promo</label>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Ex: SHOPSY10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 border border-gray-300 dark:border-gray-700 bg-transparent rounded-lg p-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm font-semibold"
                  >
                    Appliquer
                  </button>
                </div>
                {promoMessage && <p className="text-xs text-gray-500 mt-2">{promoMessage}</p>}
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{totalPrice.toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>{shipping === 0 ? "Gratuite" : `${shipping.toFixed(2)} CAD`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>{taxes.toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Remise</span>
                  <span>{discount > 0 ? `-${discount.toFixed(2)} CAD` : "0.00 CAD"}</span>
                </div>
                <div className="flex justify-between text-lg font-black border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span>Total a payer</span>
                  <span>{total.toFixed(2)} CAD</span>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1"
                  />
                  <span>J&apos;accepte les conditions generales de vente.</span>
                </label>
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="mt-1"
                  />
                  <span>Je souhaite recevoir les offres et nouveautes.</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={!canProceed || loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
              >
                Continuer vers le paiement
              </button>

              <Link
                to="/cart"
                className="block text-center text-sm font-semibold text-gray-600 dark:text-gray-300 mt-3 hover:underline"
              >
                Retour au panier
              </Link>

              <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 space-y-1">
                <p>Paiement 100% securise</p>
                <p>Retours simplifies sous 30 jours</p>
                <p>Support client 7j/7</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;