import React, { useState } from 'react'
import Banner from '../../assets/website/orange-pattern.jpg'

const Subscribe = () => {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setSubmitted(true)
    }

    return (
        <section
            data-aos="zoom-in"
            data-aos-duration="500"
            className="relative overflow-hidden"
            style={{
                backgroundImage: `url(${Banner})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
            {/* Overlay sombre pour lisibilité */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <div className="relative container py-20 text-center text-white">
                <div className="flex flex-col gap-6 items-center max-w-2xl mx-auto">

                    {/* Badge */}
                    <span
                        className="inline-block bg-primary/20 border border-primary/40
                        text-primary text-xs font-semibold tracking-widest uppercase
                        px-4 py-1.5 rounded-full"
                        data-aos="fade-up"
                        data-aos-duration="400"
                    >
                        Newsletter
                    </span>

                    {/* Titre */}
                    <h2
                        className="text-4xl sm:text-5xl font-black tracking-tight leading-tight"
                        data-aos="fade-up"
                        data-aos-delay="100"
                        data-aos-duration="400"
                    >
                        Never Miss a <span className="text-primary">Deal</span>
                    </h2>

                    {/* Sous-titre */}
                    <p
                        className="text-sm text-white/70 max-w-sm leading-relaxed"
                        data-aos="fade-up"
                        data-aos-delay="150"
                        data-aos-duration="400"
                    >
                        Subscribe to get early access to new arrivals, exclusive offers,
                        and members-only discounts — straight to your inbox.
                    </p>

                    {/* Formulaire */}
                    {!submitted ? (
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row gap-3 w-full max-w-lg"
                            data-aos="fade-up"
                            data-aos-delay="200"
                            data-aos-duration="400"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                                className="flex-1 px-5 py-3 rounded-xl text-gray-800
                                dark:text-white dark:bg-gray-800
                                placeholder:text-gray-400
                                focus:outline-none focus:ring-2 focus:ring-primary
                                transition-all duration-200 text-sm"
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-primary to-secondary
                                text-white font-semibold px-6 py-3 rounded-xl
                                hover:scale-105 active:scale-95
                                transition-all duration-200 shadow-md shadow-primary/40
                                whitespace-nowrap text-sm"
                            >
                                Subscribe →
                            </button>
                        </form>
                    ) : (
                        <div
                            className="flex items-center gap-3 bg-primary/20 border border-primary/40
                            text-white px-6 py-4 rounded-2xl"
                            data-aos="zoom-in"
                        >
                            <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-sm font-semibold">
                                You're in! Check your inbox for a welcome offer 🎉
                            </p>
                        </div>
                    )}

                    {/* Micro-texte rassurant */}
                    {!submitted && (
                        <p className="text-xs text-white/40">
                            No spam, ever. Unsubscribe anytime.
                        </p>
                    )}

                </div>
            </div>
        </section>
    )
}

export default Subscribe