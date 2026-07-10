import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { new_price } from "../utils/price";
import { BsStarFill } from 'react-icons/bs';
import { BiStar } from 'react-icons/bi';
import { Link } from "react-router-dom";
import { FaRuler } from 'react-icons/fa';
import { GrDown, GrUp } from "react-icons/gr";
import axiosInstance from '../api/axiosInstance';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import useCart from '../hooks/useCart';

// Typage RootState et User depuis votre Redux store
import type { RootState } from '../redux/store';
import {User} from '../types/User'
import { CommentType, ProductSize, Product as ProductType, ProductVariant, ProductVariantImage } from '../types/Product';
import useComment from '../hooks/useComment';
import useWishlist from '../hooks/useWishlist';
import { resolveMediaUrl } from '../utils/mediaUrl';

const formatRelativeTime = (dateString: any) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: fr });
};

// ... (vos interfaces restent inchangées)
interface UserInfoForComment {
  username: string;
  // Ajoutez d'autres champs si nécessaire
}


type CartItemApi = {
  id: number;
  variant: number;
  size: number;
  quantity: number;
}

type CartItemRedux = {
  id: number;
  variant: ProductVariant;
  size: ProductSize;
  quantity: number;
}

type WishlistItemRedux = {
  id: number;
  variant: ProductVariant;
}


const Product = () => {
  const { productId, v } = useParams<{ productId: string, v: string }>();
  const user: User | null = useSelector((state: RootState) => state.user.user);
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const { productWished, addToWishlist, setProductWishedState, removeFromWishlist} = useWishlist();
  const { addComment, comments,comment,setCommentState,setCommentsState } = useComment(productId);
  const {setMessageSize,chooseSizeMsg,addToCart} = useCart();
  const [variantId, setVariantId] = useState<number | null>(parseInt(v || '', 10) || null);
  const [sizeId, setSizeId] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [selectedStar, setSelectedStar] = useState<number>(0);
  const [currentComPage, setCurrentComPage] = useState(1);
  const [relatedBySubCatProducts, setRelatedBySubCatProducts] = useState<ProductType[]>([]);
  const [relatedByCatProducts, setRelatedByCatProducts] = useState<ProductType[]>([]);
  const commentsPerPage = 5;
  const indexOfLastComment = currentComPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments
    .slice()
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(indexOfFirstComment, indexOfLastComment);
  const totalCommentsPages = Math.ceil(comments.length / commentsPerPage);

  const handleNextPage = () => {
    if (currentComPage < totalCommentsPages) {
      setCurrentComPage(currentComPage + 1);
    }
  };
  const handlePreviousPage = () => {
    if (currentComPage > 1) {
      setCurrentComPage(currentComPage - 1);
    }
  };

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [product, setProduct] = useState<ProductType | null>(null);
  const [displayReviews, setDisplayReviews] = useState(false);
  const [category, setCategory] = useState<{ title: string, id: number , slug: string } | null>(null);

  // Fonction pour obtenir la variante sélectionnée
  const selectedVariant = (vId: number | null): ProductVariant | undefined => {
    return product?.variants?.find((variant: ProductVariant) => variant.id === vId);
  };
  const mainVariant = (product:ProductType | null):ProductVariant | undefined => {
    return product?.variants[0];
  }

  const variant = selectedVariant(variantId);

     const [selectedVariantImage, setSelectedVariantImage] = useState<string | null>(null);
  const [userInfos, setUserInfos] = useState<{ [key: number]: UserInfoForComment }>({});

  // Initialisation du produit et de l'image de la variante
  useEffect(() => {
    if (productId) {
      axiosInstance.get<ProductType>(`api/products/${productId}/`)
        .then(response => {
          setProduct(response.data);
          const initialVariant = response.data.variants.find(v => v.id === variantId) || response.data.variants[0];
          if (initialVariant) {
            const mainImage = initialVariant.images.find(img => img.mainImage)?.image || initialVariant.images[0]?.image;
            setSelectedVariantImage(mainImage || null);
          }
        })
        .catch(error => console.error("Error fetching product data:", error));
    }
  }, [productId, variantId]);

  // Vérifier si le produit est déjà dans la wishlist de l'utilisateur
  useEffect(() => {
    if (user?.id && variant?.id) {
  axiosInstance.post<{ exists: boolean }>(`api/wishlist/already_exists/`, { variant_id: variant.id })
      .then(response => {
          setProductWishedState(response.data.exists);
        })
        .catch(error => console.error("Error checking wishlist existence:", error));
    } else {
      setProductWishedState(false);
    }
  }, [user, variant]);

  // Récupération de la catégorie du produit
  useEffect(() => {
    if (product?.category) {
      axiosInstance.get<{ title: string, id: number , slug: string }>(`api/categories/${product.category}/`)
        .then(response => {
          setCategory(response.data);
        })
        .catch(error => console.error("Error fetching category data:", error));
    }
  }, [product]);

  //recuperation des produits dans la meme sous categorie et  categorie 
    useEffect(() => {
     if (product?.category) {
      axiosInstance.get<ProductType[]>(`api/products/category/${product.category}/`)
        .then(response => {
          setRelatedByCatProducts(response.data);
          console.log("relatedByCatProducts:", response.data);
        })
        .catch(error => console.error("Error fetching related products:", error));
    }
    if (product?.subCategory) {
      axiosInstance.get<ProductType[]>(`api/products/subcategory/${product.subCategory}/`)
        .then(response => {
          setRelatedBySubCatProducts(response.data);
          console.log("relatedBySubCatProducts:", response.data);
        })
        .catch(error => console.error("Error fetching subcategory products:", error));
    }
  }, [product?.category, product?.subCategory]);

  // Récupération des commentaires et infos utilisateur
  useEffect(() => {
    const fetchCommentsAndUsers = async () => {
      if (!productId) return;

      try {
        const response = await axiosInstance.get<CommentType[]>(`api/comments/${productId}/`);
        setCommentsState(response.data);

        const users: { [key: number]: UserInfoForComment } = {};
        for (const comment of response.data) {
          if (!users[comment.user]) {
            const userInfo = await getUserInfo(comment.user);
            if (userInfo) {
              users[comment.user] = userInfo;
            }
          }
        }
        setUserInfos(users);
      } catch (error) {
        console.error("Error fetching the comments or user info:", error);
      }
    };

    fetchCommentsAndUsers();
  }, [productId]);

  // Fonction pour obtenir les infos utilisateur d'un commentaire
  const getUserInfo = async (userId: number): Promise<UserInfoForComment | null> => {
    try {
      const response = await axiosInstance.get<UserInfoForComment>(`api/user/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };


  const averageStars = () => {
    if (comments.length === 0) return 0;
    const totalStars = comments.reduce((acc, comment) => acc + comment.stars, 0);
    //return (totalStars / comments.length).toFixed(1);
    return Math.round(totalStars / comments.length);
  }

const sortRelatedProducts = (products: ProductType[], currentProduct: ProductType | null) => {
  if (!currentProduct) return products;

  return products.slice().sort((a, b) => {
    // Priorité à la même subCategory
    const aSameSubCat = a.subCategory === currentProduct.subCategory ? 1 : 0;
    const bSameSubCat = b.subCategory === currentProduct.subCategory ? 1 : 0;

    if (aSameSubCat !== bSameSubCat) {
      return bSameSubCat - aSameSubCat; // Les produits de la même subCategory passent en premier
    }

    // Sinon, tri par nombre d'étoiles décroissant (propriété déjà présente)
    return (b.id ?? 0) - (a.id ?? 0);
  });
};

  const fetchCart = async () => {
    if (!user?.id) {
      console.log("User not logged in, cannot fetch cart.");
      return;
    }
    try {
      const response = await axiosInstance.get<CartItemApi[]>(`api/cart/`);
      const cartData = response.data;
      console.log("User ", user.id, " cart data: ", cartData);

      const items: CartItemRedux[] = await Promise.all(
        cartData.map(async (item) => {
          const variantResponse = await axiosInstance.get<ProductVariant>(`api/products/variant/${item.variant}/`);
          const sizeResponse = await axiosInstance.get<ProductSize>(`api/products/size/${item.size}/`)
          return {
            id: item.id,
            variant: variantResponse.data,
            size: sizeResponse.data,
            quantity: item.quantity,
          };
        })
      );
      dispatch({ type: 'cart/updateCart', payload: items });
      console.log("Cart fetched successfully:", response.data);

    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchCart();

      axiosInstance.get<any[]>(`api/wishlist/`)
        .then(async response => {
          const wishlistData = response.data;
          const items: WishlistItemRedux[] = await Promise.all(
            wishlistData.map(async (item: any) => {
              const variantResponse = await axiosInstance.get<ProductVariant>(`api/products/variant/${item.variant}/`);
              return {
                id: item.id,
                variant: variantResponse.data,
              };
            }))
          dispatch({ type: 'wishlist/updateWishlist', payload: items });
        })
        .catch((error) => console.error("Error fetching wishlist data in useEffect:", error));

    }
  }, [user, dispatch]);

  const indexOfMainImageOfvariant = (variant: ProductVariant): number => {
    const index = variant.images.findIndex((image: ProductVariantImage) => image.mainImage === true);
    return index !== -1 ? index : 0;
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-950">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Loading product details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <section className="bg-gradient-to-r from-primary to-secondary py-10 md:py-12">
        <div className="container mx-auto px-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/75 font-semibold">Product story</p>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-1">Product Details</h1>
          <p className="text-white/80 text-sm mt-2 max-w-2xl">
            Explore materials, variants, reviews and related picks in one polished view.
          </p>
          <div className="text-sm text-white/75 mt-4 flex flex-wrap items-center gap-2">
            <Link className="hover:text-white transition-colors duration-200" to="/">Home</Link>
            <span>/</span>
            <Link className="hover:text-white transition-colors duration-200" to={`/category/${category?.slug}`}>{category?.title || "Loading..."}</Link>
            <span>/</span>
            <span className="font-medium text-white">{product?.title}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] items-start">
          {/* Left side */}
          <div className="lg:sticky lg:top-6 self-start space-y-6">
            <div className="grid gap-4 lg:grid-cols-[88px_minmax(0,1fr)]">
              <div className="order-2 lg:order-1 flex lg:flex-col flex-row gap-3 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                {selectedVariant(variantId)?.images.map((img: ProductVariantImage) => (
                  <button
                    key={img.id}
                    type="button"
                    className={`w-[72px] h-[72px] rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                      selectedVariantImage === img.image ? 'border-primary shadow-md shadow-primary/20' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <img
                      src={resolveMediaUrl(img.image, apiBaseUrl)}
                      className="h-full w-full object-cover"
                      alt=""
                      onMouseEnter={() => setSelectedVariantImage(img.image)}
                      onClick={() => setSelectedVariantImage(img.image)}
                    />
                  </button>
                ))}
              </div>

              <div className="order-1 lg:order-2 relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-[0_20px_55px_-34px_rgba(0,0,0,0.45)]">
                {productWished && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '24px',
                      left: '-48px',
                      width: '180px',
                      transform: 'rotate(-45deg)',
                      background: 'linear-gradient(90deg, #22c55e 80%, #16a34a 100%)',
                      color: 'white',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      padding: '6px 0',
                      zIndex: 10,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      borderRadius: '8px'
                    }}
                  >
                    In Wishlist
                  </div>
                )}
                <img src={resolveMediaUrl(selectedVariantImage, apiBaseUrl)} className="h-[420px] md:h-[620px] w-full object-cover" alt="" />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-5">
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 md:p-6 shadow-[0_20px_55px_-34px_rgba(0,0,0,0.45)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">{product?.title}</h2>
                  <p className="text-base md:text-lg font-medium text-gray-500 dark:text-gray-300">{product?.short_desc}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                    {(variant && variant.discount > 0)
                      ? "$" + new_price(variant.price, variant.discount)
                      : "$" + (variant ? variant.price : "")}
                  </div>
                  {(variant && variant.discount > 0) && (
                    <div className="flex flex-wrap justify-end gap-2 text-sm">
                      <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-gray-500 dark:text-gray-300 line-through">${variant.price}</span>
                      <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/20 px-3 py-1 text-green-700 dark:text-green-400 font-semibold">
                        Enjoy -{variant.discount}% on this product
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {product?.variants?.map((v: ProductVariant) => (
                  <button
                    key={v.id}
                    type="button"
                    className={`group overflow-hidden rounded-2xl border-2 transition-all duration-200 bg-gray-50 dark:bg-gray-800 ${Number(variantId) === v.id ? 'border-primary shadow-md shadow-primary/15' : 'border-gray-200 dark:border-gray-700 hover:border-primary/40'}`}
                    onClick={() => {
                      setVariantId(v.id);
                    }}
                  >
                    <img
                      src={
                        Array.isArray(v.images) && v.images.length > 0
                          ? resolveMediaUrl(v.images.find((img: ProductVariantImage) => img.mainImage)?.image || v.images[0].image, apiBaseUrl)
                          : resolveMediaUrl("/default-image.jpg", apiBaseUrl)
                      }
                      alt="Variant Image"
                      className="h-24 w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3 text-sm md:text-base font-bold text-gray-700 dark:text-gray-200">
                  <div>Select Size</div>
                  <Link to={'/'} className="inline-flex items-center gap-1 text-primary hover:opacity-80 transition-opacity"><FaRuler /> Size guide</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 font-semibold">
                  {product?.variants?.find((v: ProductVariant) => v.id == variantId)?.sizes.map((s: ProductSize) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`p-4 rounded-2xl border transition-all duration-200 ${sizeId == s.id ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-primary/40'}`}
                      onClick={() => setSizeId(s.id)}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
                <div className={`${!sizeId && chooseSizeMsg ? 'flex font-serif text-red-600' : 'hidden'}`}>Please select a size </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  className="bg-gradient-to-r from-primary to-secondary text-gray-50 py-4 px-4 w-full rounded-2xl font-semibold text-lg shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  onClick={() => {
                    setMessageSize("Please select a size before adding to cart.");
                    if (sizeId) {
                      addToCart(variantId!, sizeId, 1, true);
                    }
                  }}
                >
                  Add to Cart
                </button>
                <button
                  title={productWished ? "Remove from the wishlist" : "Add to the wish list"}
                  className="text-gray-50 hover:bg-black bg-black/85 dark:bg-gray-800 dark:hover:bg-black/80 rounded-2xl lg:py-4 lg:px-4 p-3 text-lg font-semibold w-full transition-all active:scale-[0.99]"
                  onClick={() => {
                    if (productWished) {
                      removeFromWishlist(variantId!);
                      setProductWishedState(false);
                    } else {
                      addToWishlist(variantId!);
                      setProductWishedState(true);
                    }
                  }}
                >
                  {productWished ? "Remove from the Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 md:p-6 shadow-[0_20px_55px_-34px_rgba(0,0,0,0.45)] space-y-4">
              <div className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">Product details</div>
              <p className="font-medium text-gray-500 dark:text-gray-400 leading-relaxed">{product?.long_desc}</p>
              <div className="font-semibold text-gray-700 dark:text-gray-200 cursor-pointer hover:text-primary dark:hover:text-primary transition-colors text-lg">
                More about the product
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 md:p-6 shadow-[0_20px_55px_-34px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between cursor-pointer text-lg md:text-xl font-semibold text-gray-900 dark:text-white" onClick={() => setDisplayReviews(!displayReviews)}>
                <span>Reviews ({comments.length})</span>
                <div className="flex gap-1 items-center text-base md:text-lg text-primary">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="cursor-pointer transition-colors duration-300 text-primary">
                        {star <= averageStars() ? <BsStarFill /> : <BiStar />}
                    </span>
                  ))}
                  <span> {displayReviews ? <GrUp /> : <GrDown />} </span>
                </div>
              </div>

              {displayReviews && (
                <div className="mt-5 flex flex-col gap-4">
                  {user && (
                    <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-3">
                      <textarea
                        className="min-h-[120px] p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                        placeholder="Add a comment"
                        onChange={(e) => setCommentState(e.target.value)}
                        value={comment || ""}
                      ></textarea>
                      <div className="flex flex-wrap justify-between items-center gap-3">
                        <div className="font-semibold text-gray-700 dark:text-gray-200">How many stars?</div>
                        <div className="flex items-center justify-end gap-1 text-primary">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(0)}
                              onClick={() => setSelectedStar(star)}
                              className="cursor-pointer transition-colors duration-300"
                            >
                              {(hoveredStar > 0 ? star <= hoveredStar : star <= selectedStar)
                                  ? <BsStarFill />
                                  : <BiStar />}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        className="self-start px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:scale-[1.01] transition-all"
                        onClick={() =>{
                        addComment(comment, selectedStar, productId)
                      }}
                      >
                        Submit
                      </button>
                    </div>
                  )}
                  {!user && (
                    <div className="text-center text-gray-600 dark:text-gray-300 py-4">
                      Please <Link to="/login" className="text-primary hover:underline">log in</Link> to add a comment.
                    </div>
                  )}

                  {currentComments.map((c) => (
                    <div key={c.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-4 flex flex-col gap-2">
                      <div className="text-gray-800 dark:text-gray-100 font-semibold flex items-center justify-between gap-3">
                        <span>{userInfos[c.user]?.username || "Loading..."}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{formatRelativeTime(c.updated_at)}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{c.comment}</p>
                      <div className="flex items-center gap-1 text-primary">
                          {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className="cursor-pointer">
                                {star <= c.stars ? <BsStarFill /> : <BiStar />}
                              </span>
                            ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-end gap-2 pt-2 text-sm">
                    <button className="px-3 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={handlePreviousPage} disabled={currentComPage === 1}>Previous</button>
                    <span className="text-gray-500">{currentComPage} / {totalCommentsPages}</span>
                    <button className="px-3 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={handleNextPage} disabled={currentComPage === totalCommentsPages}>Next</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          <div className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white">People wear this so nicely</div>
          <div className="h-px bg-gray-200 dark:bg-gray-800" />
        </div>

        <div className="mt-10 space-y-4">
          <div className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white">You might be interested...</div>
          <div className="p-1 md:p-2 flex gap-4 mb-4 overflow-x-auto snap-x snap-mandatory pb-3">
    {
        sortRelatedProducts(
            relatedBySubCatProducts.length > 5 ? relatedBySubCatProducts : relatedByCatProducts,
            product
        )
        .filter((p) => p.id !== product?.id).map((n) => (
            <a 
                key={n.id} 
                className='flex flex-col gap-3 cursor-pointer flex-shrink-0 w-[78vw] sm:w-1/2 md:w-1/3 lg:w-1/4 snap-start rounded-3xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-[0_20px_55px_-34px_rgba(0,0,0,0.45)] hover:shadow-[0_24px_60px_-32px_rgba(0,0,0,0.55)] transition-all duration-300' 
                href={`/product/${n.id}/${n.variants[0]?.id}`} 
            >
                <div className='h-[420px] bg-gray-100 dark:bg-gray-800'>
                    <img 
                        src={resolveMediaUrl(mainVariant(n)?.images.find((image) => image.mainImage)?.image || mainVariant(n)?.images[0]?.image, apiBaseUrl)} 
                        alt={n?.title} 
                        className='w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500' 
                    />
                </div>
                <div className='p-4 space-y-2'>
                  <div className='text-lg font-semibold dark:text-gray-100 text-gray-900'>{n.title}</div>
                  <div className='block text-gray-500 dark:text-gray-400 text-base line-clamp-2 max-h-[72px]'>{n.short_desc}</div>
                  <div className='text-primary font-bold text-lg'>${mainVariant(n)?.price}</div>
                </div>
            </a>
        ))
    }
</div>
        </div>
      </div>
    </div>
  )
}

export default Product