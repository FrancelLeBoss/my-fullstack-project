import React from 'react'
import Image1 from '../../assets/women/women.png'
import Image2 from '../../assets/women/women2.jpg'
import Image3 from '../../assets/women/women3.jpg'
import Image4 from '../../assets/women/women4.jpg'
import Image5 from '../../assets/women/women3.jpg'

const ProductsData = [
    {
        id: 1,
        title: "Women Ethnic",
        img: Image1,
        color: "White",
        stars: 5,
        price: "$49.99",
        badge: "Bestseller",
        aosDelay: 0,
    },
    {
        id: 2,
        title: "Women Western",
        img: Image2,
        color: "Red",
        stars: 4.5,
        price: "$34.99",
        badge: "New",
        aosDelay: 100,
    },
    {
        id: 3,
        title: "Goggles",
        img: Image3,
        color: "Brown",
        stars: 4.7,
        price: "$19.99",
        badge: null,
        aosDelay: 200,
    },
    {
        id: 4,
        title: "Printed T-Shirt",
        img: Image4,
        color: "Yellow",
        stars: 4.4,
        price: "$24.99",
        badge: "Sale",
        aosDelay: 300,
    },
    {
        id: 5,
        title: "Fashion T-Shirt",
        img: Image5,
        color: "Pink",
        stars: 4.5,
        price: "$27.99",
        badge: null,
        aosDelay: 400,
    },
]

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5 items-center">
        {Array.from({ length: 5 }).map((_, i) => (
            <svg
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-primary' : 'text-gray-200 dark:text-gray-700'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
        <span className="text-xs text-gray-400 ml-1">{rating}</span>
    </div>
)

const Products = () => {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-950">
            <div className="container">

                {/* ── Header ── */}
                <div className="flex flex-col items-center text-center mb-14 gap-3">
                    <span
                        className="inline-block bg-primary/10 text-secondary dark:text-primary
                        text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full"
                        data-aos="fade-up"
                        data-aos-duration="400"
                    >
                        Top Selling
                    </span>
                    <h2
                        className="text-4xl font-black tracking-tight dark:text-white"
                        data-aos="fade-up"
                        data-aos-delay="100"
                        data-aos-duration="400"
                    >
                        Our Products
                    </h2>
                    <p
                        className="text-sm text-gray-400 max-w-sm"
                        data-aos="fade-up"
                        data-aos-delay="150"
                        data-aos-duration="400"
                    >
                        Handpicked styles for every occasion — quality you can see, prices you'll love.
                    </p>
                </div>

                {/* ── Grid ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {ProductsData.map((item) => (
                        <div
                            key={item.id}
                            data-aos="fade-up"
                            data-aos-delay={item.aosDelay}
                            data-aos-duration="400"
                            className="group relative bg-white dark:bg-gray-800
                            rounded-2xl overflow-hidden shadow-sm
                            hover:shadow-lg hover:shadow-primary/10
                            transition-all duration-300 cursor-pointer"
                        >
                            {/* Badge */}
                            {item.badge && (
                                <span className={`absolute top-2 left-2 z-10
                                text-[10px] font-bold uppercase tracking-wider
                                px-2 py-0.5 rounded-full
                                ${item.badge === 'Sale'
                                    ? 'bg-secondary text-white'
                                    : item.badge === 'New'
                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                    : 'bg-primary text-white'
                                }`}>
                                    {item.badge}
                                </span>
                            )}

                            {/* Image */}
                            <div className="relative h-[220px] overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover
                                    group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Overlay au hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10
                                transition-all duration-300" />

                                {/* Bouton rapide au hover */}
                                <button className="absolute bottom-3 left-1/2 -translate-x-1/2
                                bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                                text-xs font-semibold px-4 py-1.5 rounded-full
                                opacity-0 group-hover:opacity-100
                                translate-y-2 group-hover:translate-y-0
                                transition-all duration-300 shadow-md whitespace-nowrap">
                                    Quick View
                                </button>
                            </div>

                            {/* Infos */}
                            <div className="p-3 flex flex-col gap-1">
                                <h3 className="font-semibold text-sm dark:text-white truncate">
                                    {item.title}
                                </h3>
                                <span className="text-xs text-gray-400">{item.color}</span>
                                <div className="flex items-center justify-between mt-1">
                                    <StarRating rating={item.stars} />
                                    <span className="text-sm font-bold text-secondary dark:text-primary">
                                        {item.price}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── CTA ── */}
                <div className="text-center mt-12"
                    data-aos="fade-up"
                    data-aos-duration="400"
                >
                    <button className="bg-gradient-to-r from-primary to-secondary
                    text-white font-semibold px-8 py-3 rounded-xl
                    hover:scale-105 active:scale-95
                    transition-all duration-200 shadow-md shadow-primary/30">
                        View All Products →
                    </button>
                </div>

            </div>
        </section>
    )
}

export default Products