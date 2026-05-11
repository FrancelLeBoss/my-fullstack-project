import React from 'react'
import BannerImage from '../../assets/women/women2.jpg'
import { GrSecure } from 'react-icons/gr'
import { BsTruck } from 'react-icons/bs'
import { MdOutlineLocalOffer } from 'react-icons/md'
import { RiRefund2Line } from 'react-icons/ri'

const perks = [
    {
        id: 1,
        icon: <GrSecure className="text-xl" />,
        title: "Quality Guaranteed",
        desc: "Every item is quality-checked before shipping.",
        bg: "bg-primary/10 dark:bg-primary/20",
        text: "text-secondary dark:text-primary",
    },
    {
        id: 2,
        icon: <BsTruck className="text-xl" />,
        title: "Fast Delivery",
        desc: "Free shipping on all orders, delivered in 2–4 days.",
        bg: "bg-primary/10 dark:bg-primary/20",
        text: "text-secondary dark:text-primary",
    },
    {
        id: 3,
        icon: <RiRefund2Line className="text-xl" />,
        title: "Easy Returns",
        desc: "Not satisfied? Return within 30 days, no questions asked.",
        bg: "bg-primary/10 dark:bg-primary/20",
        text: "text-secondary dark:text-primary",
    },
    {
        id: 4,
        icon: <MdOutlineLocalOffer className="text-xl" />,
        title: "Exclusive Offers",
        desc: "Members get early access to sales and special discounts.",
        bg: "bg-primary/10 dark:bg-primary/20",
        text: "text-secondary dark:text-primary",
    },
]

const Banner = () => {
    return (
        <section className="py-20 bg-white dark:bg-gray-950">
            <div className="container">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 items-center">

                    {/* ── Image ── */}
                    <div className="relative" data-aos="zoom-in" data-aos-duration="500">

                        {/* Bloc décoratif derrière */}
                        <div className="absolute -bottom-4 -right-4 w-full h-full
                        bg-gradient-to-br from-primary/20 to-secondary/10
                        rounded-3xl -z-10" />

                        <img
                            src={BannerImage}
                            alt="Winter Sale"
                            className="w-full max-w-[420px] h-[460px] mx-auto
                            object-cover object-top rounded-3xl
                            shadow-2xl shadow-primary/20"
                        />

                        {/* Badge flottant */}
                        <div className="absolute -bottom-5 -left-5
                        bg-white dark:bg-gray-800 rounded-2xl
                        shadow-xl shadow-primary/20 px-5 py-3 text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Winter Sale</p>
                            <p className="text-3xl font-black text-primary leading-none">50%</p>
                            <p className="text-xs text-secondary font-semibold">off everything</p>
                        </div>
                    </div>

                    {/* ── Texte + perks ── */}
                    <div className="flex flex-col gap-8">

                        {/* Header */}
                        <div className="flex flex-col gap-3">
                            <span
                                className="inline-block w-fit bg-primary/10 text-secondary dark:text-primary
                                text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full"
                                data-aos="fade-up"
                                data-aos-duration="400"
                            >
                                Limited Time
                            </span>
                            <h2
                                className="text-4xl sm:text-5xl font-black tracking-tight dark:text-white leading-tight"
                                data-aos="fade-up"
                                data-aos-delay="100"
                                data-aos-duration="400"
                            >
                                Winter Sale <br />
                                <span className="text-primary">Up to 50% Off</span>
                            </h2>
                            <p
                                className="text-gray-400 text-sm leading-relaxed max-w-sm"
                                data-aos="fade-up"
                                data-aos-delay="150"
                                data-aos-duration="400"
                            >
                                Refresh your wardrobe this winter without breaking the bank.
                                Hundreds of styles on sale — for her, for him, for everyone.
                            </p>
                        </div>

                        {/* Perks */}
                        <div className="grid grid-cols-1 gap-4">
                            {perks.map((perk, index) => (
                                <div
                                    key={perk.id}
                                    className="flex items-center gap-4"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 80}
                                    data-aos-duration="400"
                                >
                                    {/* Icône */}
                                    <div className={`shrink-0 w-11 h-11 rounded-xl
                                    flex items-center justify-center
                                    ${perk.bg} ${perk.text}`}>
                                        {perk.icon}
                                    </div>

                                    {/* Texte */}
                                    <div>
                                        <p className="font-semibold text-sm dark:text-white">
                                            {perk.title}
                                        </p>
                                        <p className="text-xs text-gray-400 leading-snug">
                                            {perk.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div
                            data-aos="fade-up"
                            data-aos-delay="400"
                            data-aos-duration="400"
                            className="flex items-center gap-4"
                        >
                            <button className="bg-gradient-to-r from-primary to-secondary
                            text-white font-semibold px-6 py-3 rounded-xl
                            hover:scale-105 active:scale-95
                            transition-all duration-200 shadow-md shadow-primary/30">
                                Shop the Sale →
                            </button>
                            <button className="text-sm font-semibold text-gray-400
                            hover:text-secondary dark:hover:text-primary
                            underline underline-offset-4 transition-colors duration-200">
                                View all deals
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner