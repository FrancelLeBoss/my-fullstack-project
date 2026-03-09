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
    <div className="bg-gray-100 min-h-screen pb-4 dark:bg-gray-950 text-black dark:text-white">
        {/* Header Original */}
        <div className="bg-primary/40 py-3">
            <div className="text-xl text-secondary text-center font-semibold uppercase">
                YOUR PROFILE
            </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 px-4">
            {/* 1. Salutation Shopsy */}
            <h1 className="text-3xl font-black uppercase mb-6 tracking-tight text-center md:text-left">
                Hi {user?.username} !
            </h1>

            {/* 2. Barre d'onglets (Navigation Shopsy) */}
            <div className="flex justify-center border-b border-gray-300 dark:border-gray-800 mb-8">
                <div className="flex gap-10">
                    {['feed', 'orders', 'account'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-bold uppercase transition-all relative ${
                                activeTab === tab ? 'text-black dark:text-white' : 'text-gray-400 hover:text-primary'
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary animate-in fade-in duration-300" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Contenu de la Page */}
            <div className="bg-white dark:bg-gray-900 shadow-sm rounded-sm p-6 min-h-[400px]">
                
                {/* --- ONGLET : FEED --- */}
                {activeTab === 'feed' && (
                    <div className="animate-in fade-in duration-500">
                        <h2 className="text-xl font-black uppercase mb-6 italic tracking-tight">
                            In My Shopping Bag ({totalItems})
                        </h2>
                        
                        {totalItems === 0 ? (
                            <div className="border border-dashed border-gray-300 p-10 flex flex-col items-center mb-8">
                                <p className="text-gray-500 italic mb-4">Your shopping bag is empty</p>
                                <button className="bg-black text-white px-8 py-3 font-bold uppercase text-sm hover:opacity-80 transition-all">
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8 mb-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {cart.slice(0, 4).map((item, index) => (
                                        <div key={index} className="group cursor-pointer">
                                            <div className="bg-gray-200 dark:bg-gray-800 aspect-square relative overflow-hidden flex items-center justify-center p-4">
                                                <img
                                                  src={imageUrl(item.variant?.images)}
                                                  alt={item.variant?.product?.title || "product"}
                                                  className="w-32 h-32 object-cover rounded shadow-inner"
                                                />
                                                <div className="absolute bottom-4 left-4 bg-white dark:bg-black px-2 py-1 text-xs font-bold shadow-sm">
                                                    ${item.variant?.price}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <h3 className="text-sm font-medium uppercase tracking-tight">
                                                    {item.variant?.product?.title || "Product"}
                                                </h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <button 
                                      className="bg-black text-white px-6 py-4 font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all active:scale-95"
                                      onClick={() => window.location.href = '/cart'} >
                                        View my shopping bag
                                    </button>
                                </div>
                            </div>
                        )}
                        <hr className="border-t border-primary/20 my-8" />
                        <h2 className="text-xl font-black uppercase mb-6 italic tracking-tight">
                            Your wishlist ({totalWishlistItems})
                        </h2>
                        {totalWishlistItems === 0 ? (
                            <div className="border border-dashed border-gray-300 p-10 flex flex-col items-center">
                                <p className="text-gray-500 italic mb-4">Your wishlist is empty</p>
                                <button className="bg-black text-white px-8 py-3 font-bold uppercase text-sm hover:opacity-80 transition-all">
                                    Start Adding
                                </button>
                            </div>
                        ) : (
                          <div className="space-y-8 mb-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {wishlist.slice(0, 4).map((item, index) => (
                                    <div key={index} className="group cursor-pointer">
                                        <div className="bg-gray-200 dark:bg-gray-800 aspect-square relative overflow-hidden flex items-center justify-center p-4">
                                            <img
                                              src={imageUrl(item.variant?.images)}
                                              alt={item.variant?.product?.title || "product"}
                                              className="w-32 h-32 object-cover rounded shadow-inner"
                                            />
                                            <div className="absolute bottom-4 left-4 bg-white dark:bg-black px-2 py-1 text-xs font-bold shadow-sm">
                                                ${item.variant?.price}
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <h3 className="text-sm font-medium uppercase tracking-tight">
                                                {item.variant?.product?.title || "Product"}
                                            </h3>
                                        </div>                              
                                    </div>                  
                                ))}            
                            </div>
                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <button 
                                      className="bg-black text-white px-6 py-4 font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all active:scale-95"
                                      onClick={() => window.location.href = '/wishlist'} >
                                        View my wishlist
                                    </button>
                                </div>
                          </div>

                        )}

                        <hr className="border-t border-primary/20 my-8" />
                        <h2 className="text-xl font-black uppercase mb-6 italic tracking-tight">
                            Your last comments
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                                <h3 className="text-sm font-bold uppercase mb-1">Product Name</h3>
                                <p className="text-xs italic text-gray-500 dark:text-gray-400 mb-2">Reviewed on August 20, 2025</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">This is a sample comment. The product was amazing and I loved it!</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                                <h3 className="text-sm font-bold uppercase mb-1">Another Product</h3>
                                <p className="text-xs italic text-gray-500 dark:text-gray-400 mb-2">Reviewed on July 15, 2025</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">I had some issues with this product, but customer service was very helpful in resolving them.</p>
                            </div>
                        </div>
                    </div>
                )} {/* <--- C'était ici que la parenthèse manquait */}

                {/* --- ONGLET : ORDERS --- */}
                {activeTab === 'orders' && (
                    <div className="animate-in fade-in duration-500">
                        <h2 className="text-xl font-black uppercase mb-6 tracking-tight">
                            Historique des commandes
                        </h2>
                        
                        {orders.length === 0 ? (
                            <div className="border border-dashed border-gray-300 p-10 flex flex-col items-center">
                                <p className="text-gray-500 italic mb-4">You have no orders yet</p>
                                <button 
                                    className="bg-black text-white px-8 py-3 font-bold uppercase text-sm hover:opacity-80 transition-all"
                                    onClick={() => window.location.href = '/shop'}
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-y border-gray-200 dark:border-gray-800 text-xs uppercase text-gray-500 bg-gray-50/50 dark:bg-gray-900/30">
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
                                                <td className="py-6 px-2 underline font-bold text-primary tracking-tighter cursor-pointer">
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
                                                    <span className={order.status === 'delivered' ? 'text-green-600' : 'text-orange-500'}>
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
                        <div>
                            <h2 className="text-xl font-black uppercase mb-4 border-b-2 border-primary w-fit">Account Details</h2>
                            <div className="space-y-2">
                                <p><span className="font-bold">username:</span> {user?.username || "N/A"}</p>
                                <p><span className="font-bold">First Name:</span> {user?.first_name || "N/A"}</p>
                                <p><span className="font-bold">Last Name:</span> {user?.last_name || "N/A"}</p>
                                <p><span className="font-bold">Email:</span> {user?.email || "N/A"}</p>
                                <p><span className="font-bold">Phone:</span> {user?.phone_number || "N/A"}</p>
                            </div>
                        </div>
                        <div>
                            {addresses && (
                                <>
                                    <h2 className="text-xl font-black uppercase mb-4 border-b-2 border-primary w-fit">My Addresses</h2>
                                    <div className="space-y-4">
                                        {addresses.map((address) => (
                                            <div key={address.id} className="border p-4 rounded">
                                                <p>{address.street_address}</p>
                                                <p>{address.city}, {address.state_province} {address.postal_code}</p>
                                                <p>{address.country}</p>
                                                {address.is_default && <span className="text-sm text-green-600 font-bold">Default</span>}
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

        {/* Footer Shopsy Style */}
        <div className="mt-12 bg-primary/10 border-t border-primary/20 py-12 px-6 text-center">
            <h2 className="text-2xl font-black uppercase mb-2">Restez Connecté</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 uppercase tracking-widest">Inscrivez-vous pour 20% de rabais</p>
            <button className="bg-white text-black border-2 border-black px-10 py-2 font-bold uppercase hover:bg-black hover:text-white transition-all">
                S'inscrire
            </button>
        </div>
    </div>
  )
}

export default Profile