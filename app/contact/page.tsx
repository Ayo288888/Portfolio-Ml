import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"

export const metadata: Metadata = {
  title: "Contact — Ilori Ayomide Wisdom",
  description: "Get in touch with Ilori Ayomide Wisdom for AI, Machine Learning, and Full-Stack Development projects and collaborations.",
}

export default function ContactPage() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-white selection:text-black">
        <CustomCursor />
        <Navbar />
        <main className="relative z-10">
          <ContactForm />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  )
}
