import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { OrderDetails } from "../types/Order";
import { ProductSize, ProductVariant, ProductVariantImage } from "../types/Product";
import { Address } from "../types/User";
import { calculateCheckoutAmounts } from "../hooks/useCheckout";

const buildFallbackImage = (label: string) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#e5e7eb'/>
        <stop offset='100%' stop-color='#cbd5e1'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#475569' font-size='18' font-family='Arial'>${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};


const PaymentSucceded: React.FC = () => {
  const { order_id } = useParams<{ order_id: string }>();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderedProducts, setOrderedProducts] = useState<
    Array<{
      orderItem: NonNullable<OrderDetails["items"]>[number];
      variant: ProductVariant | null;
      title: string;
      imageUrl: string;
      variantName: string;
      sizeName: string;
    }>
  >([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);

  const parsedOrderId = useMemo(() => Number(order_id), [order_id]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!parsedOrderId || Number.isNaN(parsedOrderId)) {
        setError("Identifiant de commande invalide.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get<OrderDetails[]>("api/orders/");
        const currentOrder = response.data.find((o) => o.id === parsedOrderId) || null;

        if (!currentOrder) {
          setError("Commande introuvable dans votre historique.");
        } else {
          setOrder(currentOrder);
        }
      } catch (err) {
        console.error("Erreur lors de la recuperation de la commande:", err);
        setError("Impossible de recuperer les details de la commande pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [parsedOrderId]);

  useEffect(() => {
    const fetchOrderedProducts = async () => {
      if (!order?.items || order.items.length === 0) {
        setOrderedProducts([]);
        return;
      }

      setProductsLoading(true);

      try {
        const cards = await Promise.all(
          order.items.map(async (item) => {
            try {
              const response = await axiosInstance.get<ProductVariant & { product?: { id: number; title?: string } }>(
                `api/products/variant/${item.variant}/`
              );
              const variant = response.data;
              const mainImg =
                variant.images?.find((img: ProductVariantImage) => img.mainImage) || variant.images?.[0];
              const imageUrl = mainImg?.image
                ? `${apiBaseUrl}${mainImg.image}`
                : buildFallbackImage(`Produit ${item.variant}`);

              let sizeName = "N/A";
              if (item.size) {
                const localSize = variant.sizes?.find((s: ProductSize) => s.id === item.size);
                if (localSize?.size) {
                  sizeName = localSize.size;
                } else {
                  try {
                    const sizeResponse = await axiosInstance.get<ProductSize>(`api/products/size/${item.size}/`);
                    sizeName = sizeResponse.data?.size || "N/A";
                  } catch {
                    sizeName = "N/A";
                  }
                }
              }

              return {
                orderItem: item,
                variant,
                title: variant.product?.title || `Produit #${item.variant}`,
                imageUrl,
                variantName: variant.color || "Variante non specifiee",
                sizeName,
              };
            } catch (variantError) {
              console.warn(`Impossible de recuperer la variante ${item.variant}:`, variantError);

              let fallbackSizeName = "N/A";
              if (item.size) {
                try {
                  const sizeResponse = await axiosInstance.get<ProductSize>(`api/products/size/${item.size}/`);
                  fallbackSizeName = sizeResponse.data?.size || "N/A";
                } catch {
                  fallbackSizeName = "N/A";
                }
              }

              return {
                orderItem: item,
                variant: null,
                title: `Produit #${item.variant}`,
                imageUrl: buildFallbackImage(`Produit ${item.variant}`),
                variantName: "Variante non specifiee",
                sizeName: fallbackSizeName,
              };
            }
          })
        );

        setOrderedProducts(cards);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchOrderedProducts();
  }, [apiBaseUrl, order]);

  useEffect(() => {
    const fetchAddresses = async () => {
      setAddressesLoading(true);
      try {
        const response = await axiosInstance.get<Address[]>("api/user/get_address/");
        setAddresses(response.data || []);
      } catch (addressErr) {
        console.warn("Impossible de recuperer les adresses:", addressErr);
        setAddresses([]);
      } finally {
        setAddressesLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const subtotal = useMemo(() => {
    if (!order?.items?.length) return 0;
    return order.items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  }, [order]);

  const estimatedTax = useMemo(() => calculateCheckoutAmounts(subtotal, 0).taxes, [subtotal]);

  const estimatedShipping = useMemo(() => calculateCheckoutAmounts(subtotal, 0).shipping, [subtotal]);

  const estimatedBeforePromo = useMemo(() => calculateCheckoutAmounts(subtotal, 0).total, [subtotal]);

  const promoAmount = useMemo(() => {
    const total = Number(order?.total_price || 0);
    const promo = estimatedBeforePromo - total;
    return promo > 0 ? Number(promo.toFixed(2)) : 0;
  }, [estimatedBeforePromo, order?.total_price]);

  const defaultAddress = useMemo(() => {
    if (!addresses.length) return null;
    return addresses.find((a) => a.is_default) || addresses[0];
  }, [addresses]);

  const orderSteps = [
    "Commande payee",
    "Preparation",
    "En cours de livraison",
    "Livre",
  ];

  const getProgressIndex = (status?: string) => {
    switch (status) {
      case "pending":
        return 0;
      case "processing":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      default:
        return 0;
    }
  };

  const progressIndex = getProgressIndex(order?.status);
  const progressPercent = (progressIndex / (orderSteps.length - 1)) * 100;
  const isCancelled = order?.status === "cancelled";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm max-w-xl w-full text-center">
          <div className="mx-auto mb-4 h-9 w-9 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-gray-700 dark:text-gray-200">Chargement de votre confirmation de commande...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm max-w-xl w-full text-center">
          <h1 className="text-2xl font-black uppercase mb-3 text-red-600">Confirmation indisponible</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/profile"
              className="px-5 py-3 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition"
            >
              Voir mes commandes
            </Link>
            <Link
              to="/"
              className="px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Retour a l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4 text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 px-6 py-6">
            <p className="text-xs uppercase tracking-widest text-green-700 dark:text-green-300 font-semibold mb-2">
              Paiement confirme
            </p>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Merci pour votre commande</h1>
            <p className="text-sm text-green-800/80 dark:text-green-200/80">
              Votre paiement a bien ete recu. Un email de confirmation vous sera envoye sous peu.
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <p className="text-xs uppercase text-gray-500 mb-1">Numero de commande</p>
                <p className="text-xl font-black">#{order?.id || order_id}</p>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <p className="text-xs uppercase text-gray-500 mb-1">Montant total</p>
                <p className="text-xl font-black">{Number(order?.total_price || 0).toFixed(2)} CAD</p>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <p className="text-xs uppercase text-gray-500 mb-1">Statut</p>
                <p className="text-sm font-semibold uppercase">{order?.status || "processing"}</p>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <p className="text-xs uppercase text-gray-500 mb-1">Date</p>
                <p className="text-sm font-semibold">
                  {order?.created_at
                    ? new Date(order.created_at).toLocaleString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase mb-3">Produits commandes</h2>

              {productsLoading ? (
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm text-gray-500">
                  Chargement des produits commandes...
                </div>
              ) : orderedProducts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4 text-sm text-gray-500">
                  Les details produits ne sont pas encore disponibles. Vous pourrez les verifier apres mise a jour de l'endpoint.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {orderedProducts.map((item) => {
                    const unitPrice = Number(item.orderItem.price || item.variant?.price || 0);
                    const quantity = Number(item.orderItem.quantity || 0);
                    const lineTotal = Number(unitPrice * quantity).toFixed(2);

                    return (
                      <article
                        key={`${item.orderItem.id}-${item.orderItem.variant}`}
                        className="rounded-xl border border-gray-200 dark:border-gray-800 p-3 flex gap-3"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-20 h-20 rounded-lg object-cover bg-gray-100 dark:bg-gray-800"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold truncate">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-1">Variante: {item.variantName}</p>
                          <p className="text-xs text-gray-500">
                            Taille: {item.sizeName} | Qt: {quantity}
                          </p>
                          <p className="text-sm font-semibold mt-1">{lineTotal} CAD</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <section className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <h3 className="text-sm font-bold uppercase tracking-wide mb-3">Details du prix</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sous-total</span>
                    <span>{subtotal.toFixed(2)} CAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Taxes</span>
                    <span>{estimatedTax.toFixed(2)} CAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frais de livraison</span>
                    <span>{estimatedShipping.toFixed(2)} CAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Promotion</span>
                    <span>{promoAmount > 0 ? `-${promoAmount.toFixed(2)} CAD` : "0.00 CAD"}</span>
                  </div>
                  <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 font-bold">
                    <span>Total paye</span>
                    <span>{Number(order?.total_price || 0).toFixed(2)} CAD</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Les montants taxes/livraison/promo sont affiches selon les regles actuelles du checkout.
                </p>
              </section>

              <section className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <h3 className="text-sm font-bold uppercase tracking-wide mb-3">Adresses</h3>

                {addressesLoading ? (
                  <p className="text-sm text-gray-500">Chargement des adresses...</p>
                ) : defaultAddress ? (
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-semibold">Adresse de facturation</p>
                      <p>{defaultAddress.street_address}</p>
                      <p>
                        {defaultAddress.city}, {defaultAddress.state_province} {defaultAddress.postal_code}
                      </p>
                      <p>{defaultAddress.country}</p>
                    </div>

                    <div>
                      <p className="font-semibold">Adresse de livraison</p>
                      <p>{defaultAddress.street_address}</p>
                      <p>
                        {defaultAddress.city}, {defaultAddress.state_province} {defaultAddress.postal_code}
                      </p>
                      <p>{defaultAddress.country}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Aucune adresse disponible pour cette commande. Vous pouvez en ajouter depuis votre profil.
                  </p>
                )}
              </section>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wide">Suivi de commande</h3>
                <span className="text-xs text-gray-500">Statut: {order?.status || "pending"}</span>
              </div>

              {isCancelled ? (
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  Cette commande a ete annulee. Contactez le support si besoin d&apos;assistance.
                </p>
              ) : (
                <>
                  <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                    <div
                      className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {orderSteps.map((step, index) => {
                      const reached = index <= progressIndex;
                      return (
                        <div key={step} className="flex items-start gap-2">
                          <div
                            className={`mt-0.5 h-3 w-3 rounded-full ${
                              reached ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          />
                          <p
                            className={`text-xs font-medium leading-tight ${
                              reached ? "text-gray-900 dark:text-gray-100" : "text-gray-500"
                            }`}
                          >
                            {step}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/profile"
                className="flex-1 text-center px-5 py-3 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition"
              >
                Suivre ma commande
              </Link>
              <Link
                to="/"
                className="flex-1 text-center px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSucceded;