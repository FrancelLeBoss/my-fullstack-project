import React from 'react'
import { HiOutlineMail, HiOutlinePhone, HiOutlineTruck, HiOutlineRefresh, HiOutlineCreditCard, HiOutlineUserCircle } from 'react-icons/hi'

const helpTopics = [
  {
    icon: <HiOutlineTruck />,
    title: 'Shipping & delivery',
    description: 'Track your order, learn about shipping times, and understand delivery options.',
  },
  {
    icon: <HiOutlineCreditCard />,
    title: 'Payments & billing',
    description: 'Find answers about card payments, refunds, and payment failures.',
  },
  {
    icon: <HiOutlineRefresh />,
    title: 'Returns & exchanges',
    description: 'See how to return an item, request an exchange, or report an issue.',
  },
  {
    icon: <HiOutlineUserCircle />,
    title: 'Account & profile',
    description: 'Manage your profile, update your information, and secure your account.',
  },
]

const faqs = [
  {
    question: 'How long does delivery take?',
    answer: 'Delivery times depend on the destination and shipping method. Orders are usually processed quickly and then handed over to the carrier.',
  },
  {
    question: 'How can I track my order?',
    answer: 'You can track your order from your profile page or by checking the confirmation email and payment success page.',
  },
  {
    question: 'Can I return an item?',
    answer: 'Yes, returns depend on the item condition and the current return policy. Contact support with your order number to get started.',
  },
  {
    question: 'What should I do if payment fails?',
    answer: 'Verify your card details, try again, or use another payment method. If the issue persists, contact support.',
  },
]

const Help = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <section className="bg-gradient-to-r from-primary to-secondary py-12 md:py-16">
        <div className="container mx-auto px-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/75 font-semibold">Support center</p>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-1">How can we help?</h1>
          <p className="text-white/80 text-sm md:text-base mt-3 max-w-2xl">
            Find answers to common questions, get support for your orders, or contact our team directly.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 md:py-14 space-y-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {helpTopics.map((topic) => (
            <div
              key={topic.title}
              className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-[0_20px_55px_-34px_rgba(0,0,0,0.45)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl mb-4">
                {topic.icon}
              </div>
              <h2 className="text-xl font-bold mb-2">{topic.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{topic.description}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-start">
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 md:p-7 shadow-[0_20px_55px_-34px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 font-semibold">FAQ</p>
                <h2 className="text-2xl font-black tracking-tight mt-1">Frequently asked questions</h2>
              </div>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 md:p-7 shadow-[0_20px_55px_-34px_rgba(0,0,0,0.45)]">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 font-semibold">Need direct help?</p>
              <h2 className="text-2xl font-black tracking-tight mt-1 mb-4">Contact options</h2>

              <div className="space-y-3">
                <a href="tel:+12633828170" className="flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-4 hover:border-primary/40 transition-colors">
                  <HiOutlinePhone className="text-2xl text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">Phone support</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">+1 (263) 382-8170</p>
                  </div>
                </a>

                <a href="mailto:contact@shopsy.com" className="flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-4 hover:border-primary/40 transition-colors">
                  <HiOutlineMail className="text-2xl text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">Email support</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">contact@shopsy.com</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-6 md:p-7">
              <h3 className="text-xl font-black tracking-tight mb-2">Still need help?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                Visit the contact page to send us a detailed message about your order or request.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-5 py-3 font-semibold shadow-sm hover:scale-[1.01] transition-transform"
              >
                Go to Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help