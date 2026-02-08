"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  User,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (replace with your actual API call)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+91 8273366089", "+91 9897264601"],
      link: "tel:+918273366089",
      clickable: "Call us",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["shreshthaagarwal1345@gmail.com"],
      link: "mailto:shreshthaagarwal1345@gmail.com",
      clickable: "Email us",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      details: ["Pilkhana, Near Peera Masjid", "Agra, Uttar Pradesh 282004"],
      link: "https://www.google.com/maps/dir//Jaipur+Murti+Bhandaar,+Hathras+Rd,+near+sonu+dhaba,+opp.+MS+Farm+House,+Pilipokhar,+Agra,+Poiya,+Uttar+Pradesh+283126/@27.2333849,78.0306041,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x39747b0309bca6bb:0x3c6a4d435553465c!2m2!1d78.0442409!2d27.259148?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D",
      clickable: "Get Directions",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: [
        "Monday - Saturday: 9:00 AM - 7:00 PM",
        "Sunday: Closed",
      ],
      link: null,
      clickable: null,
    },
  ];

  const subjects = [
    "Product Inquiry",
    "Custom Order",
    "Bulk Purchase",
    "Shipping Query",
    "General Question",
    "Other",
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-200 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-2 rounded-full border border-yellow-300 mb-6">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">
                We're Here to Help
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-6">
              Get in Touch
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Have questions about our handcrafted marble deities? Our artisans
              are ready to assist you with custom orders, product inquiries, and
              more.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border-2 border-amber-100 hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-amber-600">{info.icon}</div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {info.title}
                </h3>

                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p
                      key={idx}
                      className="text-sm text-gray-600 leading-relaxed"
                    >
                      {detail}
                    </p>
                  ))}
                </div>

                {info.link && (
                  <a
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700 mt-3 group"
                  >
                    <span>{info.clickable}</span>

                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form and Map Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}


            {/* Map and Additional Info */}
            <div className="space-y-6">
              {/* Map */}
              <div className="bg-white rounded-3xl shadow-xl border-2 border-amber-100 overflow-hidden h-[400px]">
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3545.967890123456!2d78.04164!3d27.259148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39747b0309bca6bb%3A0x3c6a4d435553465c!2sJaipur%20Murti%20Bhandaar!5e0!3m2!1sen!2sin!4v1234567890"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>

              </div>

              {/* WhatsApp Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl border-2 border-green-200 p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Prefer WhatsApp?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Chat with us directly on WhatsApp for instant responses
                    </p>
                    <a
                      href="https://wa.me/918273366089"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl shadow-xl border-2 border-amber-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  🕉️ Sacred Craftsmanship Since 1986
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  With over 38+ years of expertise in handcrafting marble
                  deities, we bring divine artistry to your sacred spaces. Every
                  piece is meticulously carved by master artisans in Jaipur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid gap-6">
            {[
              {
                q: "Do you offer custom deity designs?",
                a: "Yes! We specialize in custom orders. Share your requirements via the contact form or WhatsApp, and our artisans will create a personalized design for you.",
              },
              {
                q: "What is the typical delivery time?",
                a: "Standard products ship within 3-5 business days. Custom orders typically take 15-30 days depending on complexity. We'll provide an exact timeline during consultation.",
              },
              {
                q: "Do you ship internationally?",
                a: "Yes, we ship worldwide. Shipping costs and delivery times vary by location. Contact us for a detailed quote.",
              },
              {
                q: "What materials do you use?",
                a: "We use premium quality marble including Vietnam white marble, Makrana marble, and other authentic Indian marble varieties. Each piece is hand-selected for quality.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md border-2 border-amber-100 hover:border-amber-300 transition-all"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold"
            >
              Browse Our Collection
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
