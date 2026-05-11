import React from 'react'
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineClock } from 'react-icons/hi'

export const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <section className="bg-gradient-to-r from-primary to-secondary py-12 md:py-16">
        <div className="container mx-auto px-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/75 font-semibold">Support</p>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-1">Contact us</h1>
          <p className="text-white/80 text-sm md:text-base mt-3 max-w-2xl">
            Need help with an order, a product question, or a partnership request? Send us a message and our team will get back to you quickly.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] items-start">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 md:p-7 shadow-[0_20px_55px_-34px_rgba(0,0,0,0.45)]">
              <h2 className="text-2xl font-black tracking-tight mb-5">Get in touch</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 p-4">
                  <HiOutlineLocationMarker className="text-2xl text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Head office</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Montréal, QC, Canada</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 p-4">
                  <HiOutlinePhone className="text-2xl text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">+1 (263) 382-8170</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 p-4">
                  <HiOutlineMail className="text-2xl text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">contact@shopsy.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 p-4">
                  <HiOutlineClock className="text-2xl text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Opening hours</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mon-Fri: 9:00 - 18:00</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sat: 10:00 - 15:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 md:p-7 shadow-[0_20px_55px_-34px_rgba(0,0,0,0.45)]">
              <h2 className="text-2xl font-black tracking-tight mb-4">Quick answers</h2>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 p-4">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Order tracking</p>
                  <p>Use your account page to follow your order status, payment history, and shipment details.</p>
                </div>
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 p-4">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Returns & exchanges</p>
                  <p>Contact us with your order number and the item details, and we will guide you through the next steps.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 md:p-7 shadow-[0_20px_55px_-34px_rgba(0,0,0,0.45)]">
            <h2 className="text-2xl font-black tracking-tight mb-2">Send a message</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Fill out the form below and we will reply as soon as possible.
            </p>

            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">First name</span>
                  <input
                    type="text"
                    placeholder="John"
                    className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Last name</span>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Email</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Subject</span>
                  <input
                    type="text"
                    placeholder="Order issue, partnership, question..."
                    className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Message</span>
                <textarea
                  rows={7}
                  placeholder="Tell us how we can help..."
                  className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </label>

              <button
                type="button"
                className="w-full rounded-2xl bg-gradient-to-r from-primary to-secondary text-white py-3.5 font-semibold shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Send message
              </button>

              <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                This form is ready for integration with your backend or email service.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact