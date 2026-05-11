import React from 'react'
import Banner from '../../assets/website/footer-pattern.jpg'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi'

const FooterLinks = [
    { id: 1, title: "Home",     link: "/#" },
    { id: 2, title: "About",    link: "/#about" },
    { id: 3, title: "Contact",  link: "/contact" },
    { id: 4, title: "Help",     link: "/help" },
]

const ShopLinks = [
    { id: 1, title: "Men's Wear",     link: "/category/men-wear" },
    { id: 2, title: "Women's Wear",   link: "/category/women-wear" },
    { id: 3, title: "Kids Wear",      link: "/category/kids-wear" },
    { id: 4, title: "Top Rated",      link: "/category/top-rated" },
    { id: 5, title: "Sale",           link: "/category/top-rated" },
]

const socials = [
    { icon: <FaInstagram />, label: "Instagram", link: "#" },
    { icon: <FaFacebook />,  label: "Facebook",  link: "#" },
    { icon: <FaLinkedin />,  label: "LinkedIn",  link: "#" },
    { icon: <FaTwitter />,   label: "Twitter",   link: "#" },
]

const Footer = () => {
    return (
        <footer
            className="relative text-white overflow-hidden"
            style={{
                backgroundImage: `url(${Banner})`,
                backgroundPosition: 'bottom',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gray-900/85 backdrop-blur-sm" />

            <div className="relative container">

                {/* ── Grille principale ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pt-16 pb-12">

                    {/* Colonne 1 — Marque */}
                    <div className="flex flex-col gap-5" data-aos="fade-up" data-aos-duration="400">

                        {/* Logo texte Option B */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center">
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                    <circle cx="18" cy="18" r="18" fill="#111827"/>
                                    <path
                                        d="M11 12Q11 9 14 9H22Q25 9 25 12Q25 15 18 15Q11 15 11 18Q11 21 18 21H25Q25 24 22 24H14Q11 24 11 21"
                                        stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none"
                                    />
                                    <circle cx="25" cy="24" r="1.5" fill="#F59E0B"/>
                                </svg>
                            </div>
                            <span className="text-2xl font-black tracking-tight">
                                shop<span className="text-primary">sy</span>
                            </span>
                        </div>

                        <p className="text-sm text-white/60 leading-relaxed max-w-[220px]">
                            Your go-to destination for stylish clothing — for her, for him, for everyone. Quality you can see, prices you'll love.
                        </p>

                        {/* Réseaux sociaux */}
                        <div className="flex gap-3 mt-1">
                            {socials.map((s) => (
                            <a
                                    key={s.label}
                                    href={s.link}
                                    aria-label={s.label}
                                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-primary
                                    flex items-center justify-center text-white/70 hover:text-white
                                    transition-all duration-200 hover:scale-110 text-sm"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Colonne 2 — Navigation */}
                    <div className="flex flex-col gap-4" data-aos="fade-up" data-aos-delay="100" data-aos-duration="400">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                            Navigation
                        </h3>
                        <ul className="flex flex-col gap-2.5">
                            {FooterLinks.map((link) => (
                                <li key={link.id}>
                                    <a
                                        href={link.link}
                                        className="text-sm text-white/60 hover:text-primary
                                        hover:translate-x-1 transition-all duration-200
                                        flex items-center gap-1.5 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-primary/40
                                        group-hover:bg-primary transition-colors duration-200" />
                                        {link.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 3 — Boutique */}
                    <div className="flex flex-col gap-4" data-aos="fade-up" data-aos-delay="200" data-aos-duration="400">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                            Shop
                        </h3>
                        <ul className="flex flex-col gap-2.5">
                            {ShopLinks.map((link) => (
                                <li key={link.id}>
                                    <a
                                        href={link.link}
                                        className="text-sm text-white/60 hover:text-primary
                                        hover:translate-x-1 transition-all duration-200
                                        flex items-center gap-1.5 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-primary/40
                                        group-hover:bg-primary transition-colors duration-200" />
                                        {link.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 4 — Contact */}
                    <div className="flex flex-col gap-4" data-aos="fade-up" data-aos-delay="300" data-aos-duration="400">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                            Contact
                        </h3>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-start gap-3">
                                <HiOutlineLocationMarker className="text-primary shrink-0 mt-0.5 text-lg" />
                                <span className="text-sm text-white/60 leading-snug">
                                    Montréal, QC, Canada
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <HiOutlinePhone className="text-primary shrink-0 text-lg" />
                                <a href="tel:+12633828170"
                                    className="text-sm text-white/60 hover:text-primary transition-colors duration-200">
                                    +1 (263) 382-8170
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <HiOutlineMail className="text-primary shrink-0 text-lg" />
                                <a href="mailto:contact@shopsy.com"
                                    className="text-sm text-white/60 hover:text-primary transition-colors duration-200">
                                    contact@shopsy.com
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* ── Bas de footer ── */}
                <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-white/40">
                        © {new Date().getFullYear()} Shopsy. All rights reserved.
                    </p>
                    <div className="flex gap-5">
                        {["Privacy Policy", "Terms of Service", "Cookies"].map((item) => (
                            <a key={item} href="#"
                                className="text-xs text-white/40 hover:text-primary transition-colors duration-200">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </footer>
    )
}

export default Footer