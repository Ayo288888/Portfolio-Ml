"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, Linkedin, Github, Sparkles, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react"
import emailjs from "@emailjs/browser"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const publicKey = "d2HifzYa8UyshPnn2"
  const serviceId = "service_9w8wbmi"
  const templateId = "template_sqlf2a9"

  useEffect(() => {
    try {
      emailjs.init(publicKey)
    } catch (e) {
      console.warn("EmailJS init warning:", e)
    }
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const templateParams = {
      from_name: formData.name,
      name: formData.name,
      from_email: formData.email,
      email: formData.email,
      reply_to: formData.email,
      user_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      to_email: "wisdomilori0@gmail.com",
    }

    try {
      // Send using EmailJS options object for v4 compatibility
      const response = await emailjs.send(serviceId, templateId, templateParams, {
        publicKey: publicKey,
      })

      if (response.status === 200 || response.text === "OK") {
        setIsSubmitting(false)
        setIsSubmitted(true)
        setFormData({ name: "", email: "", subject: "", message: "" })
        setTimeout(() => setIsSubmitted(false), 6000)
      } else {
        throw new Error(response.text || `EmailJS returned status ${response.status}`)
      }
    } catch (err: any) {
      console.error("EmailJS Send Failed:", err)
      setIsSubmitting(false)
      const detailMsg = err?.text || err?.message || (typeof err === "string" ? err : "")
      setError(
        detailMsg
          ? `EmailJS Error: ${detailMsg}. You can also email wisdomilori0@gmail.com directly.`
          : "Failed to send message via EmailJS. Please try emailing wisdomilori0@gmail.com directly."
      )
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: "EMAIL",
      value: "wisdomilori0@gmail.com",
      href: "mailto:wisdomilori0@gmail.com",
    },
    {
      icon: Phone,
      label: "PHONE",
      value: "+234 8163797443",
      href: "tel:+2348163797443",
    },
    {
      icon: MapPin,
      label: "LOCATION",
      value: "Abuja, Nigeria",
      href: "#",
    },
  ]

  const socialLinks = [
    {
      icon: Linkedin,
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/ayomide-ilori-33318a270/",
    },
    {
      icon: Github,
      name: "GitHub",
      href: "https://github.com/Ayo288888",
    },
  ]

  const mailtoFallbackUrl = `mailto:wisdomilori0@gmail.com?subject=${encodeURIComponent(
    formData.subject || "Portfolio Contact Inquiry"
  )}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
  )}`

  return (
    <section className="relative min-h-screen pt-32 pb-36 px-6 md:px-12 bg-background text-foreground overflow-hidden">
      {/* Ambient Monochromatic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 pb-8 border-b border-white/10"
        >
          <div className="flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-zinc-400 mb-3 uppercase">
            <span>05 — GET IN TOUCH</span>
          </div>
          <h1 className="font-sans text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-4">
            Let's Work <span className="italic font-normal">Together</span>
          </h1>
          <p className="font-mono text-xs text-muted-foreground max-w-2xl leading-relaxed">
            Have an exciting AI, NLP, Machine Learning, or Full-Stack project in mind? Send a message and let's create something extraordinary.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-8 md:p-10 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl"
          >
            <h3 className="font-sans text-2xl font-light text-white mb-6">Send Me a Message</h3>

            {/* Success Toast */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-mono text-xs flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Thank you for your message!</p>
                  <p className="text-emerald-300/80">I will get back to you within 24 hours.</p>
                </div>
              </motion.div>
            )}

            {/* Error Toast */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 font-mono text-xs flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  <p className="font-semibold text-white">Message Notice</p>
                </div>
                <p className="text-rose-300/80">{error}</p>
                <a
                  href={mailtoFallbackUrl}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition-colors w-fit"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send via Email Client</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block font-mono text-xs text-muted-foreground mb-2 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white font-mono text-xs focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-mono text-xs text-muted-foreground mb-2 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white font-mono text-xs focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block font-mono text-xs text-muted-foreground mb-2 uppercase">
                  Project Type
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white font-mono text-xs focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-colors"
                >
                  <option value="" className="bg-[#09090b] text-zinc-400">Select project type</option>
                  <option value="web development" className="bg-[#09090b] text-white">Web Development</option>
                  <option value="ai-development" className="bg-[#09090b] text-white">AI / Machine Learning</option>
                  <option value="fullstack" className="bg-[#09090b] text-white">Full-Stack Application</option>
                  <option value="other" className="bg-[#09090b] text-white">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block font-mono text-xs text-muted-foreground mb-2 uppercase">
                  Project Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white font-mono text-xs focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-colors resize-none leading-relaxed"
                  placeholder="Tell me about your project vision, timeline, or requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-white text-black font-mono text-xs font-semibold tracking-wider hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    <span>SENDING MESSAGE...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SEND MESSAGE</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Information & Availability */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-sans text-2xl font-light text-white mb-4">Lets Collaborate</h3>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                Whether you're looking to build an intelligent AI system, scale a full-stack platform, or discuss innovative ideas, I'm available to collaborate.
              </p>
            </div>

            {/* Direct Info List */}
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/30 transition-all duration-300 group"
                >
                  <div className="p-3 rounded-full border border-white/15 bg-white/5 group-hover:border-white/40 group-hover:bg-white/10 transition-colors">
                    <info.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">{info.label}</p>
                    <p className="font-mono text-sm text-white font-medium">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-mono text-xs tracking-wider uppercase text-muted-foreground mb-4">Social & Portfolios</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/30 transition-all text-white font-mono text-xs"
                  >
                    <social.icon className="w-4 h-4" />
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability Banner */}
            <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-md">
              <h4 className="font-mono text-xs tracking-widest text-white uppercase mb-2">CURRENT AVAILABILITY</h4>
              <p className="font-mono text-xs text-muted-foreground mb-4 leading-relaxed">
                Currently open for select contract, consulting, and full-time AI/Full-Stack opportunities.
              </p>
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <span className="font-mono text-xs text-emerald-400 font-medium">ACCEPTING NEW PROJECTS</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
