import React from 'react'
import Slider from 'react-slick'
import Image1 from '../../assets/hero/men-discount.jpg'
import Image2 from '../../assets/hero/women-discount.jpg'
import Image3 from '../../assets/hero/family-discount.jpg'

const ImageList = [
    {
        id: 1,
        img: Image1,
        title: "Up to 50% off on all Men's Wear",
        description: "Upgrade your wardrobe without breaking the bank. From sharp casualwear to weekend essentials — now at half the price.",
        badge: "Limited Time",
        cta: "Shop Men's",
        lien: "/category/men-wear",
    },
    {
        id: 2,
        img: Image2,
        title: "30% off on all Women's Wear",
        description: "Fresh styles, unbeatable prices. From everyday looks to statement pieces. Free shipping, no minimum.",
        badge: "New Arrivals",
        cta: "Shop Women's",
        lien: "/category/women-wear",
    },
    {
        id: 3,
        img: Image3,
        title: "40% off on all children's Wear",
        description: "Our biggest sale of the season is live. Thousands of styles, now up to 40% off. Top picks selling out fast.",
        badge: "🔥 Hot children Deal",
        cta: "Enjoy children's best offfers",
        lien: "/category/children-wear",
    },
]

interface HeroProps {
    handleOrderPopup: () => void;
    message?: string;
}

const Hero = ({ handleOrderPopup, message }: HeroProps) => {

    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 900,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        cssEase: 'ease-in-out',
        pauseOnHover: false,
        pauseOnFocus: true,
    }

    return (
        <div className="relative overflow-hidden min-h-[600px] sm:min-h-[650px] bg-white dark:bg-gray-950 dark:text-white">
            <Slider {...settings}>
                {ImageList.map((data) => (
                    <div key={data.id}>
                        <div className="relative grid grid-cols-1 sm:grid-cols-2 min-h-[600px] sm:min-h-[650px]">

                            {/* ── Colonne texte ── */}
                            <div className="flex flex-col justify-center gap-6 px-8 sm:px-16 lg:px-24 pt-16 sm:pt-0 z-10">

                                {/* Badge */}
                                <span
                                    className="inline-block w-fit bg-primary/20 text-secondary
                                    text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full
                                    dark:bg-primary/10 dark:text-primary"
                                    data-aos="fade-down"
                                    data-aos-duration="400"
                                    data-aos-once="true"
                                >
                                    {data.badge}
                                </span>

                                {/* Titre */}
                                <h1
                                    className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight"
                                    data-aos="fade-up"
                                    data-aos-duration="500"
                                    data-aos-once="true"
                                >
                                    {data.title}
                                </h1>

                                {/* Description */}
                                <p
                                    className="text-gray-500 dark:text-gray-400 text-base max-w-sm leading-relaxed"
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                    data-aos-duration="500"
                                    data-aos-once="true"
                                >
                                    {data.description}
                                </p>

                                {/* CTAs */}
                                <div
                                    className="flex items-center gap-4"
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                    data-aos-duration="500"
                                    data-aos-once="true"
                                >
                                    <button
                                        onClick={() => {
                                            window.location.href = data.lien;
                                        }}
                                        className="bg-gradient-to-r from-primary to-secondary
                                        text-white font-bold px-6 py-3 rounded-xl
                                        hover:scale-105 active:scale-95
                                        transition-all duration-200 shadow-md shadow-primary/30"
                                    >
                                        {data.cta}
                                    </button>
                                    <button className="text-sm font-semibold text-gray-400
                                    hover:text-secondary dark:hover:text-primary
                                    underline underline-offset-4 transition-colors duration-200">
                                        View all deals →
                                    </button>
                                </div>
                            </div>

                            {/* ── Colonne image ── */}
                            <div className="relative h-[350px] sm:h-full overflow-hidden">

                                {/* Image pleine */}
                                <img
                                    src={data.img}
                                    alt={data.title}
                                    className="absolute inset-0 w-full h-full object-cover object-top"
                                    data-aos="zoom-in"
                                    data-aos-duration="600"
                                    data-aos-once="true"
                                />

                                {/* Dégradé gauche */}
                                <div className="absolute inset-0 bg-gradient-to-r
                                from-white dark:from-gray-950
                                via-white/30 dark:via-gray-950/30
                                to-transparent" />

                                {/* Badge prix flottant */}
                                <div
                                    className="absolute top-8 right-8 bg-white dark:bg-gray-800
                                    rounded-2xl shadow-xl shadow-primary/20 px-4 py-3 text-center"
                                    data-aos="fade-left"
                                    data-aos-delay="300"
                                    data-aos-duration="500"
                                    data-aos-once="true"
                                >
                                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Sale</p>
                                    <p className="text-2xl font-black text-primary">
                                        {data.title.match(/\d+%/)?.[0]}
                                    </p>
                                    <p className="text-xs text-secondary font-semibold">off</p>
                                </div>

                                {/* Accent décoratif coin bas gauche */}
                                <div className="absolute bottom-0 left-0 w-32 h-32
                                bg-gradient-to-tr from-primary/20 to-transparent rounded-tr-full" />
                            </div>

                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default Hero