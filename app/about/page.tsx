import Image from "next/image";
import { MapPin, Mail, Phone, Clock, ChevronRight, Award, Users, Sparkles, Package, Heart, Star } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About RadhaRani Handicrafts | 38+ Years of Sacred Marble Craftsmanship",
  description: "Discover the story behind RadhaRani Handicrafts - Jaipur Murti Bhandar. Premium handcrafted Makrana marble statues since 1985. Visit our workshop in Agra.",
  openGraph: {
    title: "About RadhaRani Handicrafts - Where Faith Meets Fine Art",
    description: "38+ years of authentic marble deity craftsmanship in Agra. Premium Makrana marble, traditional techniques.",
    images: [
      {
        url: "/about-marble.png",
        width: 1200,
        height: 630,
        alt: "RadhaRani Handicrafts - Handcrafted Marble Deities",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-yellow-200/30 to-amber-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-amber-200/30 to-yellow-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-20 h-20 border-4 border-yellow-300/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-32 left-16 w-16 h-16 border-4 border-amber-300/20 rounded-lg rotate-45 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 lg:py-16">
        
        {/* Hero Section - Enhanced */}
        <section className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden mb-12 border-2 border-amber-100 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Content Side */}
            <div className="p-8 sm:p-10 lg:p-16 flex flex-col justify-center">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300/50 rounded-full mb-6 shadow-md w-fit">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-bold text-amber-900 uppercase tracking-wide">
                  Since 1985
                </span>
                <Sparkles className="w-4 h-4 text-yellow-600" />
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
                <span className="block bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  RadhaRani
                </span>
                <span className="block bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  Handicrafts
                </span>
              </h1>

              <p className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                Where Faith Meets Fine Art
              </p>

              <p className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed">
                Handcrafted Makrana marble statues that bring spiritual presence and timeless beauty to your sacred spaces. 
                <span className="font-bold text-amber-800"> 38+ years of devotion</span> to divine artistry.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b-2 border-amber-100">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-yellow-700 to-amber-600 bg-clip-text text-transparent">
                    38+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Years Legacy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-yellow-700 to-amber-600 bg-clip-text text-transparent">
                    500+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Happy Devotees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-yellow-700 to-amber-600 bg-clip-text text-transparent">
                    150+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Sacred Designs</div>
                </div>
              </div>

              <Link href="/products">
                <button className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white rounded-xl font-bold text-base transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center sm:justify-start w-full sm:w-fit">
                  <span className="relative z-10 flex items-center gap-2">
                    View Sacred Collection
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              </Link>
            </div>

            {/* Image Side */}
            <div className="relative w-full h-64 sm:h-80 lg:h-auto min-h-[400px] lg:min-h-[600px] order-first lg:order-last bg-gradient-to-br from-amber-50 to-yellow-50">
              <Image
                src="/about-marble.png"
                alt="RadhaRani Handicrafts - Premium Marble Deity Statue"
                fill
                className="object-cover lg:object-contain p-4 lg:p-8"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent lg:hidden" />
            </div>
          </div>
        </section>

        {/* Our Story Section - Enhanced */}
        <section className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden mb-12 border-2 border-amber-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="p-8 sm:p-10 lg:p-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-12 bg-gradient-to-b from-yellow-500 to-amber-500 rounded-full" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-yellow-700 to-amber-600 bg-clip-text text-transparent">
                Our Sacred Journey
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                  At <strong className="text-amber-800">RadhaRani Handicrafts</strong>, we are the proud online presence of{' '}
                  <strong className="text-amber-800">Jaipur Murti Bhandar</strong>, a name synonymous with excellence in 
                  marble deity craftsmanship for over <strong className="text-amber-800">38 years</strong>.
                </p>
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                  We specialize in hand-carved marble statues of Hindu deities, designed to bring divine energy, spiritual beauty, 
                  and timeless tradition into your home, temple, or sacred space.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                  Based in the heart of <strong className="text-amber-800">Agra</strong>, our master artisans blend age-old 
                  traditional craftsmanship with modern precision to sculpt each murti with unwavering devotion and meticulous 
                  attention to detail.
                </p>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border-2 border-amber-200">
                  <p className="text-sm text-gray-700 leading-relaxed flex items-start gap-3">
                    <Heart className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Every piece is blessed with prayers and crafted as an offering to the divine, ensuring that your deity 
                      carries spiritual energy from our workshop to your sacred space.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Craftsmanship Section - Enhanced */}
        <section className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden mb-12 border-2 border-amber-100 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Content Side with Gradient Background */}
            <div className="p-8 sm:p-10 lg:p-16 bg-gradient-to-br from-yellow-600 via-amber-600 to-yellow-600 text-white">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-12 bg-white rounded-full" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">
                  Our Master Craftsmanship
                </h2>
              </div>

              <p className="text-yellow-50 mb-8 text-base lg:text-lg leading-relaxed">
                Each statue passes through the skilled hands of master artisans who have inherited generations of traditional 
                knowledge. Our commitment to excellence is reflected in every detail.
              </p>

              <ul className="space-y-5">
                {[
                  { icon: '💎', title: 'Premium Makrana Marble', desc: 'Same marble used in the Taj Mahal' },
                  { icon: '🎨', title: 'Traditional Hand Carving', desc: 'No machinery, pure artisan skill' },
                  { icon: '🕉️', title: 'Authentic Iconography', desc: 'True to ancient scriptures' },
                  { icon: '✨', title: 'Meticulous Finishing', desc: 'Hand-polished to perfection' },
                  { icon: '🙏', title: 'Blessed with Prayers', desc: 'Spiritual energy infused' },
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-xl text-2xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-yellow-100 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Side */}
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
              <div className="relative w-full h-full min-h-[400px] lg:min-h-[600px]">
                <Image
                  src="/all.png"
                  alt="RadhaRani Handicrafts - Master Marble Craftsmanship"
                  fill
                  className="object-contain p-6 lg:p-10"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-yellow-400/20 to-transparent rounded-tr-full" />
            </div>
          </div>
        </section>

        {/* Map and Location Section - Enhanced */}
        <section className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border-2 border-amber-100 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Contact Info Side */}
            <div className="p-8 sm:p-10 lg:p-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-12 bg-gradient-to-b from-yellow-500 to-amber-500 rounded-full" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-yellow-700 to-amber-600 bg-clip-text text-transparent">
                  Visit Our Workshop
                </h2>
              </div>

              <p className="text-base lg:text-lg text-gray-700 mb-8 leading-relaxed">
                We warmly welcome visitors to our workshop in Agra, where you can witness our master artisans at work 
                and explore our complete collection of sacred marble deities.
              </p>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-200 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">Workshop Address</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      <strong className="text-amber-800">Jaipur Murti Bhandar</strong><br />
                      Pilipokhar, Hathras Rd, near Sonu Dhaba,<br />
                      opp. MS Farm House, Agra,<br />
                      Uttar Pradesh 282006
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-200 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                    <a href="tel:+918273366089" className="text-gray-600 hover:text-amber-700 transition-colors text-sm">
                      +91 82733 66089
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-200 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:shreshtha1345@gmail.com" className="text-gray-600 hover:text-amber-700 transition-colors text-sm break-all">
                      shreshtha1345@gmail.com
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-200 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">Workshop Hours</h3>
                    <p className="text-gray-600 text-sm">
                      <strong className="text-amber-800">Monday - Saturday:</strong> 9:00 AM - 6:00 PM<br />
                      <strong className="text-amber-800">Sunday:</strong> Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl">
                <p className="text-sm text-gray-700 mb-4 flex items-start gap-2">
                  <Star className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-amber-800">Custom Orders Welcome!</strong> Visit us to discuss your specific requirements 
                    or connect via WhatsApp for personalized assistance.
                  </span>
                </p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#0A5D4E] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 shadow-lg"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  WhatsApp Us Now
                </a>
              </div>
            </div>

            {/* Map Side */}
            <div className="relative w-full h-96 lg:h-auto min-h-[400px] lg:min-h-[600px] order-first lg:order-last">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d443.59092346334695!2d78.04414147447797!3d27.25918195068673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39747b0309bca6bb%3A0x3c6a4d435553465c!2sJaipur%20Murti%20Bhandaar!5e0!3m2!1sen!2sin!4v1713785850245!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 rounded-3xl lg:rounded-l-none lg:rounded-r-3xl"
                title="Jaipur Murti Bhandar Location Map"
              ></iframe>
              {/* Map overlay for style */}
              <div className="absolute inset-0 pointer-events-none border-4 border-amber-200 rounded-3xl lg:rounded-l-none lg:rounded-r-3xl" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
