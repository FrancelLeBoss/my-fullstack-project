import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import DarkMode from "./DarkMode";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import { BiCart, BiHeart } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { reset as resetCart } from "../../redux/cartSlice";
import { reset as resetWishlist } from "../../redux/WishlistSlice";
import axiosInstance from "../../api/axiosInstance";
import Swal from "sweetalert2";
import type { RootState } from "../../redux/store";
import { logout, rehydrateAuth } from "../../redux/userSlice";
import ShopsyLogo from "../ShopsyLogo";

interface ImportMetaEnv { readonly VITE_API_BASE_URL: string }
interface ImportMeta { readonly env: ImportMetaEnv }

const Menu = [
  { id: 1, name: "Home",         link: "/" },
  { id: 2, name: "Top Rated",    link: "category/top-rated" },
  { id: 3, name: "Kids Wear",    link: "/category/kids-wear" },
  { id: 4, name: "Mens Wear",    link: "/category/men-wear" },
  { id: 5, name: "Womens Wear",  link: "/category/women-wear" },
]

const DropdownLinks = [
  { id: 1, name: "Trending Products", link: "/#" },
  { id: 2, name: "Best Selling",      link: "/#" },
  { id: 3, name: "Top Rated",         link: "/#" },
]

const Navbar: React.FC<{
  handleOrderPopup: () => void;
  handleWishlistPopup: () => void;
}> = ({ handleOrderPopup, handleWishlistPopup }) => {

  const { user, isAuthenticated, refreshToken } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const cart = useSelector((state: RootState) => (state.cart as RootState["cart"]).items)
  const wishlist = useSelector((state: RootState) => state.wishlist.items)
  const totalItems = cart?.length || 0
  const totalWishlistItems = wishlist?.length || 0
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const [logoSize, setLogoSize] = useState<"sm" | "md" | "lg">("md")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleResize = () => setLogoSize(window.innerWidth < 768 ? "sm" : "md")
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Effet de scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => { dispatch(rehydrateAuth()) }, [dispatch])

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      axiosInstance.get(`${apiBaseUrl}api/cart/`)
        .then(async (response) => {
          const items = await Promise.all(response.data.map(async (item: any) => {
            const variantResponse = await axiosInstance.get(`${apiBaseUrl}api/products/variant/${item.variant}/`)
            const sizeResponse = await axiosInstance.get(`${apiBaseUrl}api/products/size/${item.size}/`)
            return { id: item.id, variant: variantResponse.data, size: sizeResponse.data, quantity: item.quantity }
          }))
          dispatch({ type: "cart/updateCart", payload: items })
        })
        .catch((error) => console.error("Error fetching cart:", error))

      axiosInstance.get(`${apiBaseUrl}api/wishlist/`)
        .then(async (response) => {
          const items = await Promise.all(response.data.map(async (item: any) => {
            const variantResponse = await axiosInstance.get(`${apiBaseUrl}api/products/variant/${item.variant}/`)
            return { id: item.id, variant: variantResponse.data }
          }))
          dispatch({ type: "wishlist/updateWishlist", payload: items })
        })
        .catch((error) => console.error("Error fetching wishlist:", error))
    }
  }, [isAuthenticated, user?.id, dispatch, apiBaseUrl])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedAccessToken = localStorage.getItem("accessToken")
    const storedRefreshToken = localStorage.getItem("refreshToken")
    if (storedUser && storedAccessToken && storedRefreshToken) {
      try {
        dispatch({ type: "user/login", payload: { user: JSON.parse(storedUser), access: storedAccessToken, refresh: storedRefreshToken, rememberMe: true } })
      } catch (error) {
        console.error("Failed to hydrate auth state:", error)
      }
    }
  }, [])

  const handleLogout = () => {
    Swal.fire({
      title: "Déconnexion",
      text: "Êtes-vous sûr de vouloir vous déconnecter ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fea928",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, me déconnecter !",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (refreshToken) {
          try {
            await axiosInstance.post(`${apiBaseUrl}api/token/blacklist/`, { refresh: refreshToken })
          } catch (error) {
            console.error("Error blacklisting token:", error)
          }
        }
        dispatch(logout())
        dispatch(resetCart())
        dispatch(resetWishlist())
        Swal.fire("Déconnecté !", "Vous avez été déconnecté avec succès.", "success")
      }
    })
  }

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300
      ${scrolled
        ? "shadow-lg shadow-black/10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md"
        : "shadow-sm bg-white dark:bg-gray-900"
      }`}
    >

      {/* ── Barre top ── */}
      <div className="hidden md:flex border-b border-gray-100 dark:border-gray-800">
        <div className="container flex justify-between items-center py-2 text-sm">

          {/* Promo */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-primary font-semibold">Free shipping</span>
            <span className="text-gray-400">on all orders</span>
          </div>

          {/* Links droite */}
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <Link to="/help" className="hover:text-primary transition-colors duration-200">Help</Link>
            <span className="text-gray-200 dark:text-gray-700">|</span>
            <Link to="/contact" className="hover:text-primary transition-colors duration-200">Contact</Link>
            <span className="text-gray-200 dark:text-gray-700">|</span>

            {user ? (
              <>
                <Link to="/profile"
                  className="text-primary font-medium hover:text-secondary transition-colors duration-200">
                  {user.username}
                </Link>
                <span className="text-gray-200 dark:text-gray-700">|</span>
                <button onClick={handleLogout}
                  className="hover:text-red-400 transition-colors duration-200">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="hover:text-primary transition-colors duration-200">Login</Link>
                <span className="text-gray-200 dark:text-gray-700">|</span>
                <Link to="/register"
                  className="hover:text-primary transition-colors duration-200">Register</Link>
              </>
            )}

            <span className="text-gray-200 dark:text-gray-700">|</span>
            <DarkMode />
          </div>
        </div>
      </div>

      {/* ── Barre principale ── */}
      <div className="container flex items-center justify-between py-3 gap-6">

        {/* Logo */}
        <Link to="/" className="shrink-0">
          <ShopsyLogo size={logoSize} />
        </Link>

        {/* Nav centrale */}
        <nav className="hidden md:flex items-center gap-1">
          {Menu.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300
              hover:text-primary hover:bg-primary/5 rounded-lg
              transition-all duration-200"
            >
              {item.name}
            </Link>
          ))}

          {/* Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium
            text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5
            rounded-lg transition-all duration-200">
              Trending
              <FiChevronDown className="transition-transform duration-200 group-hover:rotate-180 text-xs" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-48
            bg-white dark:bg-gray-800 rounded-xl shadow-xl shadow-black/10
            border border-gray-100 dark:border-gray-700
            opacity-0 invisible group-hover:opacity-100 group-hover:visible
            translate-y-1 group-hover:translate-y-0
            transition-all duration-200 z-50 p-1.5">
              {DropdownLinks.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className="flex items-center gap-2 px-3 py-2 text-sm
                  text-gray-600 dark:text-gray-300
                  hover:text-primary hover:bg-primary/5
                  rounded-lg transition-all duration-200"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/40" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-2">

          {/* Search */}
          <div className="relative hidden sm:flex items-center group">
            <input
              type="text"
              placeholder="Search products..."
              className="w-40 group-focus-within:w-64 py-2 pl-4 pr-9
              text-sm rounded-xl border border-gray-200 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800 dark:text-white
              placeholder:text-gray-400
              focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-gray-700
              transition-all duration-300"
            />
            <IoMdSearch className="absolute right-3 text-gray-400 group-focus-within:text-primary
            transition-colors duration-200" />
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlistPopup}
            title={`${totalWishlistItems} items in wishlist`}
            className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400
            hover:text-primary hover:bg-primary/10
            transition-all duration-200"
          >
            <BiHeart className="text-2xl" />
            {totalWishlistItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5
              bg-primary text-white text-[10px] font-bold
              w-4 h-4 rounded-full flex items-center justify-center">
                {totalWishlistItems}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={handleOrderPopup}
            title={`${totalItems} items in cart`}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl
            bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold
            hover:scale-105 active:scale-95 transition-all duration-200
            shadow-md shadow-primary/30"
          >
            <BiCart className="text-xl" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="bg-white text-primary text-[10px] font-black
              w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  )
}

export default Navbar