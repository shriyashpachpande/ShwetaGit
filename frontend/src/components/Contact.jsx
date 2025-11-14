"use client";
import React, { useRef, useState } from "react";
import { Mail, Phone } from "lucide-react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";

// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Contact() {
  const form = useRef(null);
  const root = useRef(null);
  const [sending, setSending] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const { t } = useTranslation();

  const sendEmail = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await emailjs.sendForm(
        "service_r1qcsm7",
        "template_d2il9zg",
        form.current,
        "aJXtZw4PMqHN078NI"
      );
      alert(t("contact.success"));
      form.current.reset();
    } catch (error) {
      console.error("EmailJS error:", error);
      alert(t("contact.failure") + (error?.text ? `: ${error.text}` : ""));
    } finally {
      setSending(false);
    }
  };

  const faqs = t("contact.faqs", { returnObjects: true });

  // Animations
  useGSAP(
    () => {
      gsap.from(".contact-title", { y: 12, autoAlpha: 0, duration: 0.6 });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="min-h-screen w-full bg-[#f5f5f5] px-5 sm:px-10 lg:px-40 py-16 contact-root"
    >
      {/* Title */}
      <h2 className="contact-title text-3xl md:text-6xl font-semibold text-center text-black mb-5">
        {t('Reach Us At Anytime')}
      </h2>
      <p className="text-center text-gray-600 mb-12">
        {t('Have questions or need any help? We’re here to help you with that')}
      </p>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 *:"
      
      
      >
        {/* LEFT SIDE CONTACT INFO */}
        <div className="space-y-15">
          {/* Email */}
          <div className=" space-y-5 items-start gap-4 p-6 bg-[#f5f5f5] sm:ml-0 md:ml-20 rounded-xl "
          style={{boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px"}}
          >
            <Mail className="w-10 h-10 text-black" />
            <div className="space-y-5" >
              <p className="text-gray-700 text-justify">
                {t('Feel free to email me if you have any questions or need more details!')}
              </p>
              <a
                href="mailto:orbai@support.com"
                className="text-gray-600 "
              >
                clausesense@support.com
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className=" items-start space-y-5 gap-4 p-6 bg-[#f5f5f5] rounded-2xl sm:ml-0 md:ml-20 mt-20"
          style={{boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px"}}
          >
            <Phone className="w-10 space-y-5 h-10 text-black" />
            <div className="space-y-5" >
              <p className="text-gray-700 text-justify">
                {t('Feel free to book a call if that’s more convenient and easier for you')}
              </p>
              <a href="#" className="text-gray-600 ">
                {t('Book a call')}
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM (original fields, untouched) */}
        <form
          ref={form}
          onSubmit={sendEmail}
          className="bg-[#f5f5f5] rounded-xl shadow-md p-6 space-y-6 sm:mr-0 md:mr-20"
          style={{boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px"}}
        >
          <input
            type="text"
            name="user_name"
            placeholder={t("contact.form.namePlaceholder")}
            required
            className="contact-field w-full rounded-lg px-3 py-3 border border-gray-300 focus:outline-none"
            style={{
            boxShadow:
              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
          }}
          />
          <input
            type="email"
            name="user_email"
            placeholder={t("contact.form.emailPlaceholder")}
            required
            className="contact-field w-full rounded-lg px-3 py-3 border border-gray-300 focus:outline-none"
            style={{
            boxShadow:
              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
          }}
          />
          <select
            name="subject"
            required
            className="contact-field w-full rounded-lg px-3 py-3 cursor-pointer border border-gray-300 focus:outline-none"
            style={{
            boxShadow:
              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
          }}
          >
            <option value="">{t("contact.form.selectPlaceholder")}</option>
            <option value="support" className="cursor-pointer">{t("contact.subjects.support")}</option>
            <option value="feedback" className="cursor-pointer">{t("contact.subjects.feedback")}</option>
            <option value="business" className="cursor-pointer">{t("contact.subjects.business")}</option>
          </select>
          <textarea
            name="message"
            placeholder={t("contact.form.messagePlaceholder")}
            rows="5"
            required
            className="contact-field w-full rounded-lg px-3 py-3 border border-gray-300 focus:outline-none"
            style={{
            boxShadow:
              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
          }}
          ></textarea>
          <button
            type="submit"
            disabled={sending}
            className="contact-field w-full bg-black text-white cursor-pointer font-semibold rounded-lg py-3 shadow-md disabled:bg-gray-400"
          >
            {sending ? t("contact.button.sending") : t("contact.button.send")}
          </button>
        </form>
      </div>

      {/* FAQ Section */}
      <div className="mt-20 bg-[#f5f5f5] p-6 rounded-xl sm:ml-0 md:ml-20 sm:mr-0 md:mr-20"
      style={{boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px"}}
      >
        <h3 className="text-xl font-semibold mb-4">
          {t("contact.faqTitle")}
        </h3>
        {faqs.map((faq, index) => (
          <div key={index} className="border-b py-2">
            <button
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              className="flex justify-between w-full text-left text-lg font-medium"
            >
              {faq.question}
              <span>{openFAQ === index ? "−" : "+"}</span>
            </button>
            {openFAQ === index && (
              <p className="text-gray-700 mt-2">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

