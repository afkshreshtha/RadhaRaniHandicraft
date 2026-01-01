import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Facebook,
  Youtube,
  Phone,
  MapPin,
  Mail,
  Clock,
  Award,
  Sparkles,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tl from-amber-500 to-yellow-600 rounded-full blur-3xl" />
      </div>

      {/* Top Decorative Border */}
      <div className="relative h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Branding & Logo Section */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="inline-block group">
              <div className="relative w-48 h-24 sm:w-56 sm:h-28 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/bg-logo.png"
                  alt="RadhaRani Handicrafts"
                  fill
                  className="object-contain object-left"
                  sizes="224px"
                />
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-amber-400/20 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
            </Link>

            <p className="text-sm leading-relaxed text-gray-400">
              The official online store of{" "}
              <span className="font-bold text-amber-400">
                Jaipur Murti Bhandar
              </span>
              . Sacred marble idols handcrafted in Jaipur with generations of
              expertise.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-semibold text-amber-400">
                  38+ Years
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-semibold text-amber-400">
                  Authentic
                </span>
              </div>
            </div>

            {/* Social Media - Uncomment when ready */}
            {/* <div className="flex space-x-4 pt-2">
              <a 
                href="https://instagram.com/yourhandle" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-amber-500 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer" 
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-amber-500 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://youtube.com/yourchannel"
                target="_blank"
                rel="noopener noreferrer" 
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-amber-500 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <Youtube size={18} />
              </a>
            </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-amber-500 rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/products", label: "Products" },
                { href: "/categories", label: "Categories" },
                { href: "/about", label: "About Us" },
                { href: "/our-stores", label: "Visit Our Store" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group text-sm text-gray-400 hover:text-amber-400 transition-all duration-200 flex items-center"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-amber-500 rounded-full" />
              Visit Our Store
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start group">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 mr-3 group-hover:bg-amber-500/20 transition-colors">
                  <MapPin className="h-4 w-4 text-amber-400" />
                </div>
                <address className="not-italic text-gray-400 group-hover:text-gray-300 transition-colors">
                  <span className="font-bold text-amber-400">
                    Jaipur Murti Bhandar
                  </span>
                  <br />
                  Pili Phokar, Agra
                  <br />
                  Uttar Pradesh, India
                </address>
              </li>

              <li className="flex items-center group">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 mr-3 group-hover:bg-amber-500/20 transition-colors">
                  <Phone className="h-4 w-4 text-amber-400" />
                </div>
                <a
                  href="tel:+918273366089"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-200"
                >
                  +91 8273366089
                </a>
              </li>

              <li className="flex items-start group">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 mr-3 group-hover:bg-amber-500/20 transition-colors">
                  <Mail className="h-4 w-4 text-amber-400" />
                </div>
                <a
                  href="mailto:shreshtha1345@gmail.com"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-200 break-all"
                >
                  shreshtha1345@gmail.com
                </a>
              </li>

              {/* Business Hours */}
              <li className="flex items-start group">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 mr-3 group-hover:bg-amber-500/20 transition-colors">
                  <Clock className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  <span className="font-semibold text-amber-400">
                    Mon - Sat:
                  </span>{" "}
                  9 AM - 7 PM
                  <br />
                  <span className="font-semibold text-amber-400">
                    Sunday:
                  </span>{" "}
                  Closed
                </div>
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-amber-500 rounded-full" />
              Get in Touch
            </h3>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Have questions about our marble idols? Chat directly with our
              master artisans from Jaipur Murti Bhandar.
            </p>

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#0A5D4E] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                WhatsApp Now
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </span>

              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </a>

            {/* Additional Info Card */}
            <div className="mt-5 p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-xs text-gray-400 leading-relaxed">
                <span className="font-bold text-amber-400">
                  🎨 Custom Orders Welcome!
                </span>
                <br />
                We specialize in creating bespoke marble deities tailored to
                your spiritual needs.
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Section (Optional) */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Stay Connected
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              Subscribe to receive updates about new collections and exclusive
              offers
            </p>
            {/* Newsletter form can be added here */}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-xs text-gray-500 text-center sm:text-left">
              © {currentYear}{" "}
              <span className="font-bold text-amber-400">
                RadhaRani Handicrafts
              </span>{" "}
              • All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-gray-500">
              <Link
                href="/privacy"
                className="hover:text-amber-400 transition-colors duration-200 relative group"
              >
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
              <Link
                href="/terms"
                className="hover:text-amber-400 transition-colors duration-200 relative group"
              >
                Terms of Service
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
              <Link
                href="/shipping"
                className="hover:text-amber-400 transition-colors duration-200 relative group"
              >
                Shipping Policy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            </div>
          </div>

          {/* Crafted with love message */}
          <div className="mt-4 pt-4 border-t border-gray-800/50 text-center">
            <p className="text-xs text-gray-600 flex items-center justify-center gap-2">
              Crafted with
              <span className="text-red-500 animate-pulse">❤️</span>
              in Agra • Delivered Worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
