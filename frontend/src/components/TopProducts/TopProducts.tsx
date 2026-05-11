import React from 'react'
import useProduct from '../../hooks/useProduct'
import { BsStarFill } from 'react-icons/bs';
import { BiStar, BiSolidStarHalf } from 'react-icons/bi';
import { resolveMediaUrl } from '../../utils/mediaUrl';

const TopProducts = () => {
    const { topRatedProducts } = useProduct();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const StarRating = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(<BsStarFill key={i} className="text-primary" />);
            } else if (rating >= i - 0.5) {
                stars.push(<BiSolidStarHalf key={i} className="text-primary" />);
            } else {
                stars.push(<BiStar key={i} className="text-gray-300 dark:text-gray-600" />);
            }
        }
        return <div className="flex gap-0.5">{stars}</div>;
    }

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-950">
            <div className="container">

                {/* ── Header ── */}
                <div className="flex flex-col items-center text-center mb-16 gap-3">
                    <span
                        className="inline-block bg-primary/10 text-secondary dark:text-primary
                        text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full"
                        data-aos="fade-up"
                        data-aos-duration="400"
                    >
                        Handpicked for you
                    </span>
                    <h2
                        className="text-4xl font-black tracking-tight dark:text-white"
                        data-aos="fade-up"
                        data-aos-delay="100"
                        data-aos-duration="400"
                    >
                        Top Rated Products
                    </h2>
                    <p
                        className="text-sm text-gray-400 max-w-xs"
                        data-aos="fade-up"
                        data-aos-delay="150"
                        data-aos-duration="400"
                    >
                        Our customers' absolute favourites — rated, reviewed, and loved.
                    </p>
                </div>

                {/* ── Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 place-items-center">
                    {topRatedProducts.slice(0, 3).map((data, index) => (
                        <div
                            key={data.id}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                            data-aos-duration="500"
                            className="group relative bg-white dark:bg-gray-800 rounded-3xl
                            shadow-md hover:shadow-xl hover:shadow-primary/20
                            transition-all duration-300 w-full max-w-[300px]
                            flex flex-col items-center pt-16 pb-6 px-6 mt-10"
                        >
                            {/* Badge numéro */}
                            <span className="absolute top-4 left-4 text-xs font-bold
                            text-primary bg-primary/10 rounded-full w-7 h-7
                            flex items-center justify-center">
                                #{index + 1}
                            </span>

                            {/* Image flottante */}
                            <div className="absolute -top-10 w-[120px] h-[120px]
                            bg-gradient-to-br from-primary/10 to-secondary/10
                            rounded-2xl flex items-center justify-center
                            shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <img
                                    src={resolveMediaUrl(
                                        data.variants[0].images.find(i => i.mainImage)?.image
                                        || "/product_fallback_img.png",
                                        apiBaseUrl
                                    )}
                                    alt={data.title}
                                    onClick={() => window.location.href = `/product/${data.id}/1`}
                                    className="w-[100px] h-[100px] object-contain cursor-pointer drop-shadow-md"
                                />
                            </div>

                            {/* Étoiles */}
                            <div className="flex items-center gap-2 mt-2">
                                {StarRating(data.avg_rating)}
                                <span className="text-xs text-gray-400 font-medium">
                                    ({data.avg_rating?.toFixed(1)})
                                </span>
                            </div>

                            {/* Titre */}
                            <h3 className="font-bold text-lg dark:text-white text-center mt-2 leading-snug">
                                {data.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-400 dark:text-gray-500
                            text-center line-clamp-2 mt-1 leading-relaxed">
                                {data.short_desc}
                            </p>

                            {/* Séparateur */}
                            <div className="w-12 h-0.5 bg-primary/30 rounded-full my-4" />

                            {/* CTA */}
                            <button
                                onClick={() => window.location.href = `/product/${data.id}/1`}
                                className="w-full bg-gradient-to-r from-primary to-secondary
                                text-white font-semibold py-2.5 rounded-xl
                                hover:scale-105 active:scale-95
                                transition-all duration-200 shadow-md shadow-primary/30
                                text-sm"
                            >
                                View Product →
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default TopProducts