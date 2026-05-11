import React from 'react'
import Slider from 'react-slick'

const TestimonialData = [
    {
        id: 1,
        name: "Victor M.",
        role: "Verified Buyer",
        text: "Honestly the best online shopping experience I've had. Fast delivery, quality products, and the sale prices are unbeatable. Will definitely order again!",
        img: 'https://fastly.picsum.photos/id/783/101/101.jpg?hmac=-AT9hej6gY68HvQoxN2xZrp59GpEoevcpJYvrnvwwWA',
        rating: 5,
    },
    {
        id: 2,
        name: "Sarah K.",
        role: "Fashion Enthusiast",
        text: "Found my favourite jacket here during the Women's Wear sale. The quality exceeded my expectations — and free shipping sealed the deal.",
        img: 'https://fastly.picsum.photos/id/0/102/102.jpg?hmac=gE1kfSPoA2bvluUcNNqlaABGx5Ic7wF-MyOUq0jHBAU',
        rating: 5,
    },
    {
        id: 3,
        name: "James R.",
        role: "Regular Customer",
        text: "Great variety for men's wear. I refreshed my whole wardrobe for half the price. The checkout process is smooth and delivery was on time.",
        img: 'https://fastly.picsum.photos/id/274/104/104.jpg?hmac=rojUcdaLqXScWFeAnLipGgEa9HexlM1lQObLZn4dNxU',
        rating: 4,
    },
    {
        id: 4,
        name: "Amina T.",
        role: "Verified Buyer",
        text: "Shopsy has become my go-to for kids' wear. Good prices, easy returns, and the sizing guide is super helpful. Love this store!",
        img: 'https://fastly.picsum.photos/id/473/300/300.jpg?hmac=aPTe1knrJgAvwf90lQ9QcolzUAyTJ7BEdygDXemA6Ck',
        rating: 5,
    },
]

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
            <svg
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-primary' : 'text-gray-200 dark:text-gray-700'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
)

const Testimony = () => {

    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 600,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        cssEase: 'ease-in-out',
        pauseOnHover: true,
        pauseOnFocus: true,
        responsive: [
            {
                breakpoint: 10000,
                settings: { slidesToShow: 3, slidesToScroll: 1, infinite: true }
            },
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2, slidesToScroll: 1 }
            },
            {
                breakpoint: 640,
                settings: { slidesToShow: 1, slidesToScroll: 1 }
            }
        ]
    }

    return (
        <section className="py-20 bg-white dark:bg-gray-950">
            <div className="container">

                {/* ── Header ── */}
                <div className="flex flex-col items-center text-center mb-14 gap-3">
                    <span
                        className="inline-block bg-primary/10 text-secondary dark:text-primary
                        text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full"
                        data-aos="fade-up"
                        data-aos-duration="400"
                    >
                        Customer Reviews
                    </span>
                    <h2
                        className="text-4xl font-black tracking-tight dark:text-white"
                        data-aos="fade-up"
                        data-aos-delay="100"
                        data-aos-duration="400"
                    >
                        What People Are Saying
                    </h2>
                    <p
                        className="text-sm text-gray-400 max-w-sm"
                        data-aos="fade-up"
                        data-aos-delay="150"
                        data-aos-duration="400"
                    >
                        Real reviews from real customers — no filters, no fluff.
                    </p>
                </div>

                {/* ── Slider ── */}
                <div data-aos="fade-up" data-aos-duration="500">
                    <Slider {...settings}>
                        {TestimonialData.map((data) => (
                            <div key={data.id} className="px-3 py-6">
                                <div className="relative bg-white dark:bg-gray-800
                                border border-gray-100 dark:border-gray-700
                                rounded-3xl p-6 shadow-md hover:shadow-xl
                                hover:shadow-primary/10 transition-all duration-300
                                flex flex-col gap-4">

                                    {/* Guillemet décoratif */}
                                    <span className="absolute top-4 right-5
                                    text-6xl font-serif leading-none
                                    text-primary/20 dark:text-primary/10 select-none">
                                        "
                                    </span>

                                    {/* Étoiles */}
                                    <StarRating rating={data.rating} />

                                    {/* Texte */}
                                    <p className="text-sm text-gray-500 dark:text-gray-400
                                    leading-relaxed line-clamp-3">
                                        "{data.text}"
                                    </p>

                                    {/* Séparateur */}
                                    <div className="w-10 h-0.5 bg-primary/30 rounded-full" />

                                    {/* Auteur */}
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={data.img}
                                            alt={data.name}
                                            className="w-11 h-11 rounded-full object-cover
                                            ring-2 ring-primary/30"
                                        />
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">
                                                {data.name}
                                            </p>
                                            <p className="text-xs text-secondary dark:text-primary/70 font-medium">
                                                {data.role}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>

            </div>
        </section>
    )
}

export default Testimony