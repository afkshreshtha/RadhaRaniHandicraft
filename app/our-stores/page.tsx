"use client";
import { useState } from 'react';
import Head from 'next/head';
import { MapPin, Phone, Mail, Clock, ExternalLink, Sparkles, Award, Navigation, Store } from 'lucide-react';

export default function OurStores() {
  const [activeStore, setActiveStore] = useState(0);

  const stores = [
    {
      id: 1,
      name: "Jaipur Murti Bhandar - Agra",
      address: "Pili Phokar, Agra",
      state: "Uttar Pradesh, India",
      phone: "+91 8273366089",
      email: "shreshtha1345@gmail.com",
      hours: "9:00 AM - 7:00 PM",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3545.967890123456!2d78.04164!3d27.259148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39747b0309bca6bb%3A0x3c6a4d435553465c!2sJaipur%20Murti%20Bhandaar!5e0!3m2!1sen!2sin!4v1234567890",
      mapDirectionsUrl: "https://www.google.com/maps/search/jaipur+murti+bhandar+agra/@27.259148,78.0442409,15z",
      description: "Our flagship store featuring the largest collection of handcrafted marble idols and sculptures.",
      badge: "Flagship Store"
    },
    {
      id: 3,
      name: "Kuber Murti Bhandar",
      address: "Opposite NEXA (KTL PVT LTD), Kuberpur",
      state: "Agra, Uttar Pradesh, India",
      phone: "+91 9876543212",
      email: "kuberpur@RadhaRaniHandicraft.com",
      hours: "9:30 AM - 7:30 PM",
      mapEmbedUrl: "https://maps.google.com/maps?q=27.228511,78.147031&z=15&output=embed",
      mapDirectionsUrl: "https://www.google.com/maps/place/%E0%A4%95%E0%A5%81%E0%A4%AC%E0%A5%87%E0%A4%B0+%E0%A4%AE%E0%A5%82%E0%A4%B0%E0%A5%8D%E0%A4%A4%E0%A4%BF+%E0%A4%AD%E0%A4%A3%E0%A5%8D%E0%A4%A1%E0%A4%BE%E0%A4%B0/@27.228647,78.1469029,3a,75y,130.92h,93.74t/data=!3m7!1e1!3m5!1sBsQ3tFazGBDgUZ4el7M8hA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-3.7358623537362092%26panoid%3DBsQ3tFazGBDgUZ4el7M8hA%26yaw%3D130.9213503733858!7i13312!8i6656!4m12!1m5!3m4!2zMjfCsDEzJzQ0LjMiTiA3OMKwMDgnNDcuOCJF!8m2!3d27.228958!4d78.1466133!3m5!1s0x39746f864dd63a2d:0xe1c294e3a81b463!8m2!3d27.228511!4d78.147031!16s%2Fg%2F11vf3y153v",
      description: "Our Kuberpur showroom offering exquisite marble sculptures and idols.",
      badge: "New Location"
    }
  ];

  return (
    <>
      <Head>
        <title>Our Stores | RadhaRani Handicrafts - Visit Jaipur Murti Bhandar Locations</title>
        <meta
          name="description"
          content="Visit our Jaipur Murti Bhandar stores in Agra, Haathi Ghat, and Kuberpur. Experience 38+ years of handcrafted marble deity craftsmanship in person."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com/our-stores" />
      </Head>

      <main className="relative min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-yellow-200/30 to-amber-300/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-amber-200/30 to-yellow-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          
          {/* Floating shapes */}
          <div className="absolute top-20 right-20 w-20 h-20 border-4 border-yellow-300/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-32 left-16 w-16 h-16 border-4 border-amber-300/20 rounded-lg rotate-45 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 lg:py-16">
          
          {/* Header Section - Enhanced */}
          <header className="text-center mb-12 lg:mb-16 max-w-4xl mx-auto animate-fade-in-up">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300/50 rounded-full mb-6 shadow-md">
              <Store className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-900 uppercase tracking-wide">
                Visit Our Locations
              </span>
              <Sparkles className="w-4 h-4 text-yellow-600" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-5">
              <span className="block bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Experience Divine Art
              </span>
              <span className="block bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-600 bg-clip-text text-transparent mt-2">
                In Person
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed">
              <strong className="text-amber-800">RadhaRani Handicrafts</strong> is the online presence of{' '}
              <strong className="text-amber-800">Jaipur Murti Bhandar</strong>. Visit any of our physical locations 
              to experience our divine marble craftsmanship in person.
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-1 w-16 bg-gradient-to-r from-transparent via-yellow-500 to-amber-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
              <div className="h-1 w-16 bg-gradient-to-l from-transparent via-amber-500 to-yellow-500 rounded-full" />
            </div>
          </header>

          {/* Store Locations Section */}
          <section aria-label="Store Locations" className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Store Selector Sidebar */}
              <nav aria-label="Select a store location" className="lg:col-span-1 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-yellow-500 to-amber-500 rounded-full" />
                  <h2 className="text-xl font-bold text-gray-900">Select a Location</h2>
                </div>

                <div className="space-y-4">
                  {stores.map((store, index) => (
                    <button
                      key={store.id}
                      type="button"
                      onClick={() => setActiveStore(index)}
                      className={`group w-full text-left p-5 rounded-2xl transition-all duration-300 border-2
                        ${activeStore === index 
                          ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-400 shadow-xl transform scale-105' 
                          : 'bg-white border-amber-200 hover:border-amber-300 hover:shadow-lg hover:transform hover:scale-102'}
                        focus:outline-none focus:ring-2 focus:ring-amber-500`}
                      aria-current={activeStore === index ? 'location' : undefined}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-bold text-base ${activeStore === index ? 'text-amber-900' : 'text-gray-900 group-hover:text-amber-800'}`}>
                          {store.name}
                        </h3>
                        {store.badge && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-white whitespace-nowrap ml-2">
                            {store.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>{store.address}, {store.state}</span>
                      </p>
                    </button>
                  ))}
                </div>

                {/* CTA Card */}
                <aside className="p-6 bg-gradient-to-br from-yellow-600 via-amber-600 to-yellow-600 text-white rounded-2xl shadow-xl border-2 border-amber-400">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Visit Our Showrooms</h3>
                  </div>
                  <p className="text-yellow-50 mb-5 text-sm leading-relaxed">
                    Experience our sacred marble idols in person and speak with our expert artisans. 
                    38+ years of divine craftsmanship awaits you!
                  </p>
                  <a
                    href="tel:+918273366089"
                    className="group inline-flex items-center justify-center w-full bg-white text-amber-700 px-5 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
                  >
                    <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                    <span className="relative z-10">Call Now</span>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </a>
                </aside>
              </nav>

              {/* Store Details and Map */}
              <article className="lg:col-span-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-100 animate-fade-in-up" style={{ animationDelay: '0.4s' }} aria-live="polite">
                {/* Map with Decorative Border */}
                <div className="relative h-64 sm:h-80 md:h-96 w-full bg-gradient-to-br from-amber-100 to-yellow-100">
                  <iframe
                    src={stores[activeStore].mapEmbedUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    aria-label={`Map showing location of ${stores[activeStore].name}`}
                    loading="lazy"
                    title={`${stores[activeStore].name} Location`}
                  ></iframe>
                  {/* Decorative map border */}
                  <div className="absolute inset-0 pointer-events-none border-4 border-amber-200/50" />
                </div>

                {/* Store Information */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="font-extrabold text-2xl sm:text-3xl bg-gradient-to-r from-yellow-700 to-amber-600 bg-clip-text text-transparent">
                          {stores[activeStore].name}
                        </h2>
                        {stores[activeStore].badge && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                            {stores[activeStore].badge}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{stores[activeStore].description}</p>
                    </div>
                    <a
                      href={stores[activeStore].mapDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 hover:border-amber-400 text-amber-900 rounded-xl font-bold text-sm transition-all hover:shadow-lg whitespace-nowrap"
                    >
                      <Navigation className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      Get Directions
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent my-6" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <section className="space-y-5" aria-labelledby="address-heading">
                      <div className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-200 group-hover:scale-110 transition-transform">
                          <MapPin className="w-5 h-5 text-amber-600" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <h3 id="address-heading" className="font-bold text-gray-900 mb-1">Address</h3>
                          <address className="not-italic text-gray-600 text-sm leading-relaxed">
                            {stores[activeStore].address}<br />
                            {stores[activeStore].state}
                          </address>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-200 group-hover:scale-110 transition-transform">
                          <Clock className="w-5 h-5 text-amber-600" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">Workshop Hours</h3>
                          <p className="text-gray-600 text-sm">
                            <strong className="text-amber-800">Mon - Sat:</strong> {stores[activeStore].hours}<br />
                            <strong className="text-amber-800">Sunday:</strong> Closed
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Right Column */}
                    <section className="space-y-5" aria-labelledby="contact-heading">
                      <div className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-200 group-hover:scale-110 transition-transform">
                          <Phone className="w-5 h-5 text-amber-600" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <h3 id="contact-heading" className="font-bold text-gray-900 mb-1">Phone</h3>
                          <a 
                            href={`tel:${stores[activeStore].phone}`} 
                            className="text-gray-600 hover:text-amber-700 text-sm block focus:outline-none focus:ring-2 focus:ring-amber-500 rounded transition-colors"
                          >
                            {stores[activeStore].phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-200 group-hover:scale-110 transition-transform">
                          <Mail className="w-5 h-5 text-amber-600" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                          <a 
                            href={`mailto:${stores[activeStore].email}`} 
                            className="text-gray-600 hover:text-amber-700 text-sm block focus:outline-none focus:ring-2 focus:ring-amber-500 rounded transition-colors break-all"
                          >
                            {stores[activeStore].email}
                          </a>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* WhatsApp CTA */}
                  <div className="mt-8 p-5 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl">
                    <p className="text-sm text-gray-700 mb-4 flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-amber-800">Have questions about this location?</strong> Contact us directly 
                        on WhatsApp for instant assistance!
                      </span>
                    </p>
                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=I'm interested in visiting your ${encodeURIComponent(stores[activeStore].name)} location. Can you provide more information?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden inline-flex items-center justify-center w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#0A5D4E] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact This Store on WhatsApp
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413A11.815 11.815 0 0012.05 0zm0 21.783a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z"/>
                        </svg>
                      </span>
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* Trust Banner - Enhanced */}
          <section className="mt-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border-2 border-amber-200 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {/* Top decorative border */}
            <div className="h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500" />
            
            <div className="py-12 px-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border-2 border-amber-500/30 rounded-full mb-6">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-amber-400 uppercase tracking-wide">
                  38+ Years of Excellence
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                RadhaRani Handicrafts: The Online Store of{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  Jaipur Murti Bhandar
                </span>
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
                For over <strong className="text-amber-400">38 years</strong>, Jaipur Murti Bhandar has been crafting divine 
                marble sculptures with unmatched devotion and skill. <strong className="text-amber-400">RadhaRani Handicrafts</strong> brings 
                this sacred art directly to your doorstep with the same quality and craftsmanship available at our physical locations.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
