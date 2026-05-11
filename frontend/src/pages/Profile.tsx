import React, { useEffect, useState } from 'react'
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import useCart from '../hooks/useCart';
import axiosInstance from '../api/axiosInstance';
import { orderItem } from '../types/Order';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const user = useSelector((s: RootState) => s.user.user);
  const addresses = useSelector((s: RootState) => s.user.addresses);
  const [orders, setOrders] = useState<orderItem[]>([]);
  const cart = useSelector(
      (state: RootState) => (state.cart as RootState["cart"]).items
    );
    const wishlist = useSelector((state: RootState) => state.wishlist.items);
    const totalWishlistItems = wishlist?.length || 0;
    const totalItems = cart?.length || 0;
    const { imageUrl} = useCart();

    const getUserOrders = async (user: any) => {
      try {
        const response = await axiosInstance.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        console.log("User Orders:", response.data);
        return response.data as orderItem[];
      } catch (error) {
        console.error("Error fetching user orders:", error);
        return [];
      }
    }
  useEffect(() => {
    if (user) {
      getUserOrders(user).then((orders) => {
        setOrders(orders);
      });
    }
  }, [user]);

  return (
    <div className="bg-gray-50 min-h-screen pb-8 dark:bg-gray-950 text-black dark:text-white">
        <section className="bg-gradient-to-r from-primary to-secondary py-10 md:py-12">
            <div className="container mx-auto px-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/75 font-semibold">My Space</p>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-1">Hi {user?.username}!</h1>
                <p className="text-white/80 text-sm mt-2 max-w-2xl">
                    Manage your activity, follow your orders, and update your account details.
                </p>
            </div>
        </section>

        <div className="container mx-auto mt-8 px-4">
            <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 p-1 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm">
                    {['feed', 'orders', 'account'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 text-xs md:text-sm font-bold uppercase rounded-xl transition-all duration-200 ${
                                activeTab === tab
                                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/25'
                                  : 'text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-primary/10'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-7 min-h-[440px]
              border border-gray-100 dark:border-gray-800
              shadow-[0_16px_45px_-28px_rgba(0,0,0,0.45)]"
            >
                
                {/* --- ONGLET : FEED --- */}
                {activeTab === 'feed' && (
                    <div className="animate-in fade-in duration-500">
                        <h2 className="text-xl md:text-2xl font-black uppercase mb-6 tracking-tight">
                            In My Shopping Bag ({totalItems})
                        </h2>
                        
                        {totalItems === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 flex flex-col items-center mb-8 bg-gray-50/60 dark:bg-gray-950/40">
                                <p className="text-gray-500 dark:text-gray-400 mb-4">Your shopping bag is empty</p>
                                <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 font-bold uppercase text-sm rounded-xl hover:scale-[1.02] transition-all">
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8 mb-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {cart.slice(0, 4).map((item, index) => (
                                        <div key={index} className="group cursor-pointer">
                                            <div className="bg-gray-100 dark:bg-gray-800 aspect-square relative overflow-hidden flex items-center justify-center p-4 rounded-2xl border border-gray-200/70 dark:border-gray-700/70">
                                                <img
                                                  src={imageUrl(item.variant?.images)}
                                                  alt={item.variant?.product?.title || "product"}
                                                  className="w-32 h-32 object-cover rounded-lg shadow-inner group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-black/80 px-2.5 py-1 text-xs font-bold rounded-md shadow-sm">
                                                    ${item.variant?.price}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <h3 className="text-sm font-semibold uppercase tracking-tight text-gray-800 dark:text-gray-100 line-clamp-2">
                                                    {item.variant?.product?.title || "Product"}
                                                </h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <button 
                                      className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest hover:opacity-85 transition-all active:scale-95"
                                      onClick={() => window.location.href = '/cart'} >
                                        View my shopping bag
                                    </button>
                                </div>
                            </div>
                        )}
                        <hr className="border-t border-primary/20 my-8" />
                        <h2 className="text-xl md:text-2xl font-black uppercase mb-6 tracking-tight">
                            Your wishlist ({totalWishlistItems})
                        </h2>
                        {totalWishlistItems === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 flex flex-col items-center bg-gray-50/60 dark:bg-gray-950/40">
                                <p className="text-gray-500 dark:text-gray-400 mb-4">Your wishlist is empty</p>
                                <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 font-bold uppercase text-sm rounded-xl hover:scale-[1.02] transition-all">
                                    Start Adding
                                </button>
                            </div>
                        ) : (
                          <div className="space-y-8 mb-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {wishlist.slice(0, 4).map((item, index) => (
                                    <div key={index} className="group cursor-pointer">
                                        <div className="bg-gray-100 dark:bg-gray-800 aspect-square relative overflow-hidden flex items-center justify-center p-4 rounded-2xl border border-gray-200/70 dark:border-gray-700/70">
                                            <img
                                              src={imageUrl(item.variant?.images)}
                                              alt={item.variant?.product?.title || "product"}
                                              className="w-32 h-32 object-cover rounded-lg shadow-inner group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-black/80 px-2.5 py-1 text-xs font-bold rounded-md shadow-sm">
                                                ${item.variant?.price}
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <h3 className="text-sm font-semibold uppercase tracking-tight text-gray-800 dark:text-gray-100 line-clamp-2">
                                                {item.variant?.product?.title || "Product"}
                                            </h3>
                                        </div>                              
                                    </div>                  
                                ))}            
                            </div>
                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <button 
                                      className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest hover:opacity-85 transition-all active:scale-95"
                                      onClick={() => window.location.href = '/wishlist'} >
                                        View my wishlist
                                    </button>
                                </div>
                          </div>

                        )}

                        <hr className="border-t border-primary/20 my-8" />
                        <h2 className="text-xl md:text-2xl font-black uppercase mb-6 tracking-tight">
                            Your last comments
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
                                <h3 className="text-sm font-bold uppercase mb-1">Product Name</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Reviewed on August 20, 2025</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">This is a sample comment. The product was amazing and I loved it!</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
                                <h3 className="text-sm font-bold uppercase mb-1">Another Product</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Reviewed on July 15, 2025</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">I had some issues with this product, but customer service was very helpful in resolving them.</p>
                            </div>
                        </div>
                    </div>
                )} {/* <--- C'était ici que la parenthèse manquait */}

                {/* --- ONGLET : ORDERS --- */}
                {activeTab === 'orders' && (
                    <div className="animate-in fade-in duration-500">
                        <h2 className="text-xl md:text-2xl font-black uppercase mb-6 tracking-tight">
                            Historique des commandes
                        </h2>
                        
                        {orders.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 flex flex-col items-center bg-gray-50/60 dark:bg-gray-950/40">
                                <p className="text-gray-500 dark:text-gray-400 mb-4">You have no orders yet</p>
                                <button 
                                    className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-bold uppercase text-sm hover:scale-[1.02] transition-all"
                                    onClick={() => window.location.href = '/shop'}
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-y border-gray-200 dark:border-gray-800 text-xs uppercase text-gray-500 bg-gray-50 dark:bg-gray-900/40">
                                            <th className="py-4 px-2 font-bold">Commander</th>
                                            <th className="py-4 px-2 font-bold">Date</th>
                                            <th className="py-4 px-2 font-bold">État des paiements</th>
                                            <th className="py-4 px-2 font-bold">État d'avancement</th>
                                            <th className="py-4 px-2 font-bold text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {orders.slice(0, 5).map((order) => (
                                            <tr 
                                                key={order.id} 
                                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                            >
                                                <td className="py-6 px-2 underline font-bold text-primary tracking-tight cursor-pointer"
                                                    onClick={() => window.location.href = `/payment-success/${order.id}`}>
                                                    #{order.id}
                                                </td>
                                                <td className="py-6 px-2 text-gray-600 dark:text-gray-400">
                                                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="py-6 px-2 italic">
                                                    {order.is_paid ? "Payée" : "En attente"}
                                                </td>
                                                <td className="py-6 px-2 uppercase text-xs font-semibold">
                                                    <span className={`px-2 py-1 rounded-full ${order.status === 'delivered' ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20' : 'text-orange-700 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-6 px-2 text-right font-black tracking-tight">
                                                    ${order.total_price} CAD
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                {/* --- ONGLET : ACCOUNT --- */}
                {activeTab === 'account' && (
                    <div className="animate-in fade-in duration-500 grid md:grid-cols-2 gap-10">
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-gray-50/60 dark:bg-gray-950/40">
                            <h2 className="text-xl font-black uppercase mb-4 border-b-2 border-primary w-fit">Account Details</h2>
                            <div className="space-y-2 text-sm md:text-base">
                                <p><span className="font-bold">username:</span> {user?.username || "N/A"}</p>
                                <p><span className="font-bold">First Name:</span> {user?.first_name || "N/A"}</p>
                                <p><span className="font-bold">Last Name:</span> {user?.last_name || "N/A"}</p>
                                <p><span className="font-bold">Email:</span> {user?.email || "N/A"}</p>
                                <p><span className="font-bold">Phone:</span> {user?.phone_number || "N/A"}</p>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-gray-50/60 dark:bg-gray-950/40">
                            {addresses && (
                                <>
                                    <h2 className="text-xl font-black uppercase mb-4 border-b-2 border-primary w-fit">My Addresses</h2>
                                    <div className="space-y-4">
                                        {addresses.map((address) => (
                                            <div key={address.id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl bg-white dark:bg-gray-900">
                                                <p>{address.street_address}</p>
                                                <p>{address.city}, {address.state_province} {address.postal_code}</p>
                                                <p>{address.country}</p>
                                                {address.is_default && <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20 font-bold">Default</span>}
                                            </div>                      
                                        ))}                           
                                    </div>                
                                </>
                            )}                    
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="mt-12 mx-4 md:mx-10 rounded-2xl bg-gradient-to-r from-primary/15 to-secondary/15 border border-primary/20 py-12 px-6 text-center">
            <h2 className="text-2xl font-black uppercase mb-2">Restez Connecte</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 uppercase tracking-widest">Inscrivez-vous pour 20% de rabais</p>
            <button className="bg-white text-black border-2 border-black px-10 py-2.5 rounded-xl font-bold uppercase hover:bg-black hover:text-white transition-all">
                S'inscrire
            </button>
        </div>
    </div>
  )
}

export default Profile